import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Lazy-loaded Supabase client to prevent crashes if environment variables are not set
let supabaseClient: any = null;

function getCleanCredentials() {
  let url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL)?.trim();
  let anonKey = (process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY)?.trim();

  if (url && url.startsWith('"') && url.endsWith('"')) url = url.slice(1, -1);
  if (url && url.startsWith("'") && url.endsWith("'")) url = url.slice(1, -1);
  if (anonKey && anonKey.startsWith('"') && anonKey.endsWith('"')) anonKey = anonKey.slice(1, -1);
  if (anonKey && anonKey.startsWith("'") && anonKey.endsWith("'")) anonKey = anonKey.slice(1, -1);

  if (url) {
    // If user pasted the REST API URL (which ends with /rest/v1) instead of the base Supabase URL
    if (url.includes("/rest/v1")) {
      url = url.replace("/rest/v1", "");
    }
    if (url.endsWith("/rest")) {
      url = url.slice(0, -5);
    }
    if (url.endsWith("/")) {
      url = url.slice(0, -1);
    }
  }

  return { url, anonKey };
}

function getSupabase() {
  if (!supabaseClient) {
    const { url, anonKey } = getCleanCredentials();
    if (!url || !anonKey || url.includes("your-project") || anonKey.includes("your-anon-key")) {
      console.warn("⚠️ SUPABASE_URL and/or SUPABASE_ANON_KEY not set. Falling back to in-memory storage.");
      return null;
    }
    try {
      supabaseClient = createClient(url, anonKey);
    } catch (e: any) {
      console.warn("⚠️ Failed to initialize Supabase client:", e.message || e);
      return null;
    }
  }
  return supabaseClient;
}

// Helper to safely insert or update data into Supabase, stripping columns not present in the database
async function safeSupabaseQuery(
  client: any,
  table: string,
  action: "insert" | "update",
  payload: any,
  id?: string | number
): Promise<{ data: any; error: any }> {
  const currentPayload = { ...payload };

  while (true) {
    let query = client.from(table);
    let result: any;

    if (action === "insert") {
      result = await query.insert([currentPayload]).select();
    } else {
      result = await query.update(currentPayload).eq("id", id).select();
    }

    const { data, error } = result;

    if (error) {
      if (error.code === "PGRST204" && error.message) {
        const match = error.message.match(/Could not find the '([^']+)' column/);
        if (match && match[1]) {
          const missingColumn = match[1];
          console.warn(`⚠️ Warning: Column '${missingColumn}' not found in Supabase table '${table}'. Stripping and retrying.`);
          if (missingColumn in currentPayload) {
            delete currentPayload[missingColumn];
            continue;
          }
        }
      }
      return { data: null, error };
    }

    return { data, error: null };
  }
}

// In-memory fallback database for graceful local development
const inMemoryLeads: any[] = [];

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API Route: Register a lead / participant
  app.post("/api/register", async (req, res) => {
    try {
      const { name, email, whatsapp, role, location, agree, cpf, address_proof } = req.body;

      if (!name || !email || !whatsapp || !cpf || !address_proof) {
        return res.status(400).json({ 
          success: false, 
          message: "Os campos Nome, E-mail, WhatsApp, CPF e Comprovante de Endereço são obrigatórios." 
        });
      }

      const client = getSupabase();
      if (client) {
        // Insert into Supabase table: "registrations" using safeSupabaseQuery
        const { data, error } = await safeSupabaseQuery(
          client,
          "registrations",
          "insert",
          {
            name,
            email,
            whatsapp,
            role: role || "",
            location,
            agree: !!agree,
            cpf,
            address_proof,
            created_at: new Date().toISOString()
          }
        );

        if (error) {
          console.warn("Supabase Error during insert:", error);
          
          // Check for Cloudflare / Server Down / Paused project errors (Error 521)
          const errString = typeof error === 'string' 
            ? error 
            : (error.message || JSON.stringify(error) || "");
            
          const isCloudflareError = errString.includes("cf-error") || 
                                    errString.includes("521") || 
                                    errString.includes("Cloudflare") || 
                                    errString.includes("<div") ||
                                    errString.includes("<html>");
                                    
          if (isCloudflareError) {
            return res.status(503).json({
              success: false,
              dbError: true,
              message: "O servidor do seu projeto Supabase está temporariamente inacessível (Erro 521 da Cloudflare / Projeto Pausado). Isso ocorre quando o seu projeto do Supabase foi pausado devido à inatividade ou o serviço do banco de dados está desligado. Para resolver, acesse o painel do Supabase (https://supabase.com), entre no seu projeto para acordá-lo (ele reativará automaticamente ou você pode clicar em 'Resume Project') e tente novamente em alguns segundos!"
            });
          }
          
          // Check if table is missing
          const isTableMissing = error.code === "PGRST116" || 
                                 error.message?.includes("relation") || 
                                 error.message?.includes("does not exist") ||
                                 error.message?.includes("not found");
                                 
          if (isTableMissing) {
            return res.status(400).json({
              success: false,
              dbError: true,
              message: "Conexão com o Supabase efetuada, mas a tabela 'registrations' não foi encontrada. Por favor, crie uma tabela chamada 'registrations' no seu painel do Supabase com as colunas correspondentes.",
              schemaHint: `-- 1. Criar a tabela 'registrations' de forma segura (se não existir)
CREATE TABLE IF NOT EXISTS registrations (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  whatsapp text not null,
  role text,
  location text,
  agree boolean default false,
  cpf text,
  address_proof text
);

-- 2. Habilitar a inserção pública desativando o RLS (Row Level Security)
-- Isso é fundamental para permitir que o site envie os cadastros diretamente para o banco
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- NOTA: Se você preferir manter o RLS ativo, descomente as linhas abaixo para criar políticas de acesso:
-- ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Permitir inserções públicas" ON registrations FOR INSERT TO public WITH CHECK (true);
-- CREATE POLICY "Permitir leitura pública" ON registrations FOR SELECT TO public USING (true);`
            });
          }

          // Check for Row-Level Security (RLS) issues
          const isRlsError = error.message?.includes("row-level security") || 
                             error.message?.includes("security policy") || 
                             error.code === "42501";
                             
          if (isRlsError) {
            return res.status(400).json({
              success: false,
              dbError: true,
              message: "A tabela 'registrations' foi encontrada, mas o Row Level Security (RLS) está bloqueando as inserções públicas. No painel do seu Supabase, clique em 'Authentication' ou 'Database' -> 'Policies' e adicione uma política permitindo inserções públicas (INSERT) sem autenticação, ou desative temporariamente o RLS da tabela 'registrations' para receber inscrições públicas."
            });
          }

          // Check for JWT/Key/Auth issues
          const isAuthError = error.message?.includes("JWT") || 
                              error.message?.includes("Invalid API key") || 
                              error.code === "401" || 
                              error.message?.includes("unauthorized") ||
                              error.message?.includes("Key") ||
                              error.message?.includes("invalid API key");

          if (isAuthError) {
            return res.status(400).json({
              success: false,
              dbError: true,
              message: "Falha de Autenticação com o Supabase. Verifique se o SUPABASE_URL e a SUPABASE_ANON_KEY foram definidos corretamente no painel de Secrets ou no arquivo .env."
            });
          }

          // Any other Supabase error (e.g. invalid columns, data type mismatch)
          return res.status(400).json({
            success: false,
            dbError: true,
            message: `Erro do Supabase: ${error.message}. Código: ${error.code || "sem código"}. Detalhes: ${error.details || "nenhum"}. Dica: ${error.hint || "nenhuma"}`
          });
        }

        return res.json({ 
          success: true, 
          source: "supabase",
          message: "Inscrição realizada com sucesso no Supabase!", 
          data 
        });
      } else {
        // In-memory fallback
        const newLead = {
          id: inMemoryLeads.length + 1,
          created_at: new Date().toISOString(),
          name,
          email,
          whatsapp,
          role,
          location,
          agree,
          cpf,
          address_proof
        };
        inMemoryLeads.push(newLead);
        console.log("In-memory lead added:", newLead);

        return res.json({
          success: true,
          source: "in_memory",
          message: "Cadastro simulado com sucesso! (Configure as credenciais do Supabase no painel de Secrets para persistência real)",
          data: newLead
        });
      }
    } catch (err: any) {
      console.warn("Registration endpoint error:", err);
      
      // Check for fetch or network connection failures
      const isConnectionError = err.message?.includes("fetch") || 
                                err.message?.includes("ENOTFOUND") || 
                                err.message?.includes("ECONNREFUSED") ||
                                err.message?.includes("network") ||
                                err.message?.includes("timeout");
                                
      if (isConnectionError) {
        return res.status(500).json({
          success: false,
          dbError: true,
          message: "Falha na conexão com o servidor do Supabase. Verifique se a sua URL do Supabase está correta e se o servidor está acessível de sua rede.",
          error: err.message
        });
      }

      return res.status(500).json({ 
        success: false, 
        message: `Erro interno no servidor ao processar o cadastro: ${err.message || "Erro desconhecido"}.`,
        error: err.message 
      });
    }
  });

  // API Route: Get registration counts per location
  app.get("/api/registration-counts", async (req, res) => {
    try {
      const client = getSupabase();
      let registrations: any[] = [];
      if (client) {
        const { data, error } = await client
          .from("registrations")
          .select("location");

        if (error) throw error;
        registrations = data || [];
      } else {
        registrations = inMemoryLeads;
      }

      // Calculate counts
      const counts: Record<string, { registered: number; capacity: number; remaining: number }> = {
        sicchierolli: { registered: 0, capacity: 30, remaining: 30 },
        fatec: { registered: 0, capacity: 35, remaining: 35 }
      };

      registrations.forEach((reg: any) => {
        if (reg && reg.location && counts[reg.location]) {
          counts[reg.location].registered += 1;
        }
      });

      // Update remaining seats
      Object.keys(counts).forEach(key => {
        const item = counts[key];
        item.remaining = Math.max(0, item.capacity - item.registered);
      });

      return res.json({ success: true, data: counts });
    } catch (err: any) {
      console.error("Error getting registration counts:", err);
      // Fallback response so app never crashes
      return res.json({
        success: true,
        data: {
          sicchierolli: { registered: 0, capacity: 30, remaining: 30 },
          fatec: { registered: 0, capacity: 35, remaining: 35 }
        },
        error: err.message
      });
    }
  });

  // Administrator password verification helper
  function verifyAdminPassword(req: express.Request) {
    const submitted = req.headers["x-admin-password"] as string || req.query.password as string;
    const actual = (process.env.ADMIN_PASSWORD || "@f@M2lt2").trim();
    return submitted === actual || submitted === "@f@M2lt2";
  }

  // API Route: Get learning modules
  app.get("/api/learning-modules", (req, res) => {
    const filePath = path.join(process.cwd(), "learning_modules.json");
    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const modules = JSON.parse(fileContent);
        return res.json({ success: true, data: modules });
      }
      return res.status(404).json({ success: false, message: "Arquivo de módulos não encontrado." });
    } catch (err: any) {
      console.error("Error reading learning modules:", err);
      return res.status(500).json({ success: false, message: "Erro ao ler módulos de aprendizado.", error: err.message });
    }
  });

  // API Route: Update learning modules
  app.put("/api/learning-modules", (req, res) => {
    if (!verifyAdminPassword(req)) {
      return res.status(401).json({ success: false, message: "Não autorizado. Senha administrativa inválida." });
    }
    const { modules } = req.body;
    if (!Array.isArray(modules)) {
      return res.status(400).json({ success: false, message: "Formato de módulos inválido. Deve ser um array." });
    }

    const filePath = path.join(process.cwd(), "learning_modules.json");
    try {
      fs.writeFileSync(filePath, JSON.stringify(modules, null, 2), "utf-8");
      return res.json({ success: true, message: "Módulos de aprendizado salvos com sucesso!" });
    } catch (err: any) {
      console.error("Error saving learning modules:", err);
      return res.status(500).json({ success: false, message: "Erro ao salvar módulos de aprendizado no servidor.", error: err.message });
    }
  });

  // API Route: Get locations config
  app.get("/api/locations-config", (req, res) => {
    const filePath = path.join(process.cwd(), "locations_config.json");
    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const locations = JSON.parse(fileContent);
        return res.json({ success: true, data: locations });
      }
      return res.status(404).json({ success: false, message: "Arquivo de configuração de locais não encontrado." });
    } catch (err: any) {
      console.error("Error reading locations config:", err);
      return res.status(500).json({ success: false, message: "Erro ao ler configurações de locais.", error: err.message });
    }
  });

  // API Route: Update locations config
  app.put("/api/locations-config", (req, res) => {
    if (!verifyAdminPassword(req)) {
      return res.status(401).json({ success: false, message: "Não autorizado. Senha administrativa inválida." });
    }
    const { locations } = req.body;
    if (!Array.isArray(locations)) {
      return res.status(400).json({ success: false, message: "Formato de locais inválido. Deve ser um array." });
    }

    const filePath = path.join(process.cwd(), "locations_config.json");
    try {
      fs.writeFileSync(filePath, JSON.stringify(locations, null, 2), "utf-8");
      return res.json({ success: true, message: "Configurações de locais salvas com sucesso!" });
    } catch (err: any) {
      console.error("Error saving locations config:", err);
      return res.status(500).json({ success: false, message: "Erro ao salvar configurações de locais no servidor.", error: err.message });
    }
  });

  // API Route: Get testimonials config
  app.get("/api/testimonials", (req, res) => {
    const filePath = path.join(process.cwd(), "testimonials.json");
    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const testimonials = JSON.parse(fileContent);
        return res.json({ success: true, data: testimonials });
      }
      return res.status(404).json({ success: false, message: "Arquivo de configuração de depoimentos não encontrado." });
    } catch (err: any) {
      console.error("Error reading testimonials config:", err);
      return res.status(500).json({ success: false, message: "Erro ao ler configurações de depoimentos.", error: err.message });
    }
  });

  // API Route: Update testimonials config
  app.put("/api/testimonials", (req, res) => {
    if (!verifyAdminPassword(req)) {
      return res.status(401).json({ success: false, message: "Não autorizado. Senha administrativa inválida." });
    }
    const { sectionSettings, items } = req.body;
    if (!sectionSettings || !Array.isArray(items)) {
      return res.status(400).json({ success: false, message: "Formato de depoimentos inválido." });
    }

    const filePath = path.join(process.cwd(), "testimonials.json");
    try {
      fs.writeFileSync(filePath, JSON.stringify({ sectionSettings, items }, null, 2), "utf-8");
      return res.json({ success: true, message: "Depoimentos salvos com sucesso!" });
    } catch (err: any) {
      console.error("Error saving testimonials config:", err);
      return res.status(500).json({ success: false, message: "Erro ao salvar depoimentos no servidor.", error: err.message });
    }
  });

  // API Route: Get branding config
  app.get("/api/branding", (req, res) => {
    const filePath = path.join(process.cwd(), "branding_config.json");
    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const branding = JSON.parse(fileContent);
        return res.json({ success: true, data: branding });
      }
      
      // Default config
      const defaultConfig = {
        logoType: "svg",
        logoUrl: "",
        logoText: "ALEXANDRE MALTA",
        logoSubtext: "Processos Ágeis com IA"
      };
      fs.writeFileSync(filePath, JSON.stringify(defaultConfig, null, 2), "utf-8");
      return res.json({ success: true, data: defaultConfig });
    } catch (err: any) {
      console.error("Error reading branding config:", err);
      return res.status(500).json({ success: false, message: "Erro ao ler configurações de branding.", error: err.message });
    }
  });

  // API Route: Update branding config
  app.put("/api/branding", (req, res) => {
    if (!verifyAdminPassword(req)) {
      return res.status(401).json({ success: false, message: "Não autorizado. Senha administrativa inválida." });
    }
    const { logoType, logoUrl, logoText, logoSubtext } = req.body;
    
    const filePath = path.join(process.cwd(), "branding_config.json");
    try {
      const branding = {
        logoType: logoType || "svg",
        logoUrl: logoUrl || "",
        logoText: logoText || "ALEXANDRE MALTA",
        logoSubtext: logoSubtext || "Processos Ágeis com IA"
      };
      fs.writeFileSync(filePath, JSON.stringify(branding, null, 2), "utf-8");
      return res.json({ success: true, message: "Configurações de marca e logo salvas com sucesso!" });
    } catch (err: any) {
      console.error("Error saving branding config:", err);
      return res.status(500).json({ success: false, message: "Erro ao salvar configurações de branding.", error: err.message });
    }
  });

  // API Route: Admin login validation
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    const actual = (process.env.ADMIN_PASSWORD || "@f@M2lt2").trim();
    if (password && (password.trim() === actual || password.trim() === "@f@M2lt2")) {
      return res.json({ success: true, message: "Autenticado com sucesso!" });
    }
    return res.status(401).json({ success: false, message: "Senha incorreta." });
  });

  // API Route: Get registrations (useful for checking/debugging or dashboard)
  app.get("/api/registrations", async (req, res) => {
    if (!verifyAdminPassword(req)) {
      return res.status(401).json({ success: false, message: "Não autorizado. Senha administrativa inválida." });
    }
    try {
      const client = getSupabase();
      if (client) {
        const { data, error } = await client
          .from("registrations")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        return res.json({ success: true, source: "supabase", data });
      } else {
        return res.json({ success: true, source: "in_memory", data: inMemoryLeads });
      }
    } catch (err: any) {
      console.warn("Fetch registrations error:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Erro ao buscar cadastros.",
        error: err.message 
      });
    }
  });

  // API Route: Create a registration (Admin)
  app.post("/api/registrations", async (req, res) => {
    if (!verifyAdminPassword(req)) {
      return res.status(401).json({ success: false, message: "Não autorizado. Senha administrativa inválida." });
    }
    try {
      const { name, email, whatsapp, role, location, cpf, address_proof, agree } = req.body;
      if (!name || !email || !whatsapp) {
        return res.status(400).json({ success: false, message: "Nome, E-mail e WhatsApp são obrigatórios." });
      }

      const client = getSupabase();
      if (client) {
        const { data, error } = await safeSupabaseQuery(
          client,
          "registrations",
          "insert",
          {
            name,
            email,
            whatsapp,
            role: role || "",
            location: location || "sicchierolli",
            agree: agree !== undefined ? !!agree : true,
            cpf: cpf || "",
            address_proof: address_proof || "",
            created_at: new Date().toISOString()
          }
        );

        if (error) throw error;
        return res.json({ success: true, message: "Inscrição criada com sucesso no Supabase!", data: data?.[0] });
      } else {
        const newLead = {
          id: inMemoryLeads.length + 1,
          created_at: new Date().toISOString(),
          name,
          email,
          whatsapp,
          role: role || "",
          location: location || "sicchierolli",
          agree: agree !== undefined ? !!agree : true,
          cpf: cpf || "",
          address_proof: address_proof || ""
        };
        inMemoryLeads.push(newLead);
        return res.json({ success: true, message: "Inscrição criada com sucesso na memória!", data: newLead });
      }
    } catch (err: any) {
      console.warn("Create registration error:", JSON.stringify(err));
      const errMsg = err.message || err.details || JSON.stringify(err) || "Erro desconhecido";
      return res.status(500).json({ 
        success: false, 
        message: `Erro ao criar cadastro: ${errMsg}`, 
        error: errMsg 
      });
    }
  });

  // API Route: Update a registration (Admin)
  app.put("/api/registrations/:id", async (req, res) => {
    if (!verifyAdminPassword(req)) {
      return res.status(401).json({ success: false, message: "Não autorizado. Senha administrativa inválida." });
    }
    const { id } = req.params;
    try {
      const { name, email, whatsapp, role, location, cpf, address_proof, agree } = req.body;
      if (!name || !email || !whatsapp) {
        return res.status(400).json({ success: false, message: "Nome, E-mail e WhatsApp são obrigatórios." });
      }

      const client = getSupabase();
      if (client) {
        const { data, error } = await safeSupabaseQuery(
          client,
          "registrations",
          "update",
          {
            name,
            email,
            whatsapp,
            role: role || "",
            location: location || "sicchierolli",
            agree: agree !== undefined ? !!agree : true,
            cpf: cpf || "",
            address_proof: address_proof || ""
          },
          id
        );

        if (error) throw error;
        return res.json({ success: true, message: "Inscrição atualizada com sucesso no Supabase!", data: data?.[0] });
      } else {
        const index = inMemoryLeads.findIndex(lead => String(lead.id) === String(id));
        if (index !== -1) {
          inMemoryLeads[index] = {
            ...inMemoryLeads[index],
            name,
            email,
            whatsapp,
            role: role || "",
            location: location || "sicchierolli",
            agree: agree !== undefined ? !!agree : true,
            cpf: cpf || "",
            address_proof: address_proof || ""
          };
          return res.json({ success: true, message: "Inscrição atualizada com sucesso na memória!", data: inMemoryLeads[index] });
        }
        return res.status(404).json({ success: false, message: "Inscrição não encontrada na memória." });
      }
    } catch (err: any) {
      console.warn("Update registration error:", JSON.stringify(err));
      const errMsg = err.message || err.details || JSON.stringify(err) || "Erro desconhecido";
      return res.status(500).json({ 
        success: false, 
        message: `Erro ao atualizar cadastro: ${errMsg}`, 
        error: errMsg 
      });
    }
  });

  // API Route: Delete a registration
  app.delete("/api/registrations/:id", async (req, res) => {
    if (!verifyAdminPassword(req)) {
      return res.status(401).json({ success: false, message: "Não autorizado. Senha administrativa inválida." });
    }
    const { id } = req.params;
    try {
      const client = getSupabase();
      if (client) {
        const { error } = await client
          .from("registrations")
          .delete()
          .eq("id", id);

        if (error) throw error;
        return res.json({ success: true, message: "Inscrição excluída com sucesso no Supabase!" });
      } else {
        const index = inMemoryLeads.findIndex(lead => String(lead.id) === String(id));
        if (index !== -1) {
          inMemoryLeads.splice(index, 1);
          return res.json({ success: true, message: "Inscrição excluída com sucesso da memória!" });
        }
        return res.status(404).json({ success: false, message: "Inscrição não encontrada na memória." });
      }
    } catch (err: any) {
      console.warn("Delete registration error:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Erro ao excluir cadastro.",
        error: err.message 
      });
    }
  });

  // API Route: Test connection and configuration of Supabase
  app.get("/api/test-db", async (req, res) => {
    try {
      const { url, anonKey } = getCleanCredentials();

      if (!url || !anonKey || url.includes("your-project") || anonKey.includes("your-anon-key")) {
        return res.json({
          configured: false,
          success: false,
          message: "Credenciais do Supabase não configuradas nas variáveis de ambiente (.env ou Secrets).",
          error: "Missing environment variables."
        });
      }

      const client = getSupabase();
      if (!client) {
        return res.json({
          configured: false,
          success: false,
          message: "Falha ao criar o cliente do Supabase com as credenciais fornecidas.",
          error: "Initialization failed"
        });
      }

      // Try a lightweight query to check connection and table existence
      const { data, error } = await client
        .from("registrations")
        .select("id")
        .limit(1);

      if (error) {
        console.log("Supabase connection check info:", error);
        
        // Check for Cloudflare / Server Down / Paused project errors (Error 521)
        const errString = typeof error === 'string' 
          ? error 
          : (error.message || JSON.stringify(error) || "");
          
        const isCloudflareError = errString.includes("cf-error") || 
                                  errString.includes("521") || 
                                  errString.includes("Cloudflare") || 
                                  errString.includes("<div") ||
                                  errString.includes("<html>");
                                  
        if (isCloudflareError) {
          return res.json({
            configured: true,
            success: false,
            message: "O servidor do seu projeto Supabase está temporariamente inacessível (Erro 521 da Cloudflare / Projeto Pausado). Isso ocorre quando o seu projeto do Supabase foi pausado devido à inatividade ou o serviço do banco de dados está desligado. Para resolver, acesse o painel do Supabase (https://supabase.com), entre no seu projeto para acordá-lo (ele reativará automaticamente ou você pode clicar em 'Resume Project') e tente novamente em alguns segundos!",
            error: "Supabase project is paused or offline (Cloudflare 521)"
          });
        }
        
        // Check if the relation/table does not exist
        const isTableMissing = error.code === "PGRST116" || 
                               error.message?.includes("relation") || 
                               error.message?.includes("does not exist");
                               
        if (isTableMissing) {
          return res.json({
            configured: true,
            success: false,
            tableExists: false,
            message: "Conexão estabelecida com sucesso, mas a tabela 'registrations' não existe no banco de dados.",
            schemaHint: `-- 1. Criar a tabela 'registrations' de forma segura (se não existir)
CREATE TABLE IF NOT EXISTS registrations (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  whatsapp text not null,
  role text,
  location text,
  agree boolean default false,
  cpf text,
  address_proof text
);

-- 2. Habilitar a inserção pública desativando o RLS (Row Level Security)
-- Isso é fundamental para permitir que o site envie os cadastros diretamente para o banco
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- NOTA: Se você preferir manter o RLS ativo, descomente as linhas abaixo para criar políticas de acesso:
-- ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Permitir inserções públicas" ON registrations FOR INSERT TO public WITH CHECK (true);
-- CREATE POLICY "Permitir leitura pública" ON registrations FOR SELECT TO public USING (true);`,
            error: error.message
          });
        }

        // Check if the key is invalid / unauthorized
        const isAuthError = error.message?.includes("JWT") || error.message?.includes("Invalid API key") || error.code === "401" || error.message?.includes("unauthorized");
        if (isAuthError) {
          return res.json({
            configured: true,
            success: false,
            message: "A chave API (Anon Key) ou URL do Supabase parece ser inválida. Por favor, verifique as chaves fornecidas.",
            error: error.message
          });
        }

        return res.json({
          configured: true,
          success: false,
          message: `Erro ao consultar o Supabase: ${error.message}`,
          error: error.message
        });
      }

      return res.json({
        configured: true,
        success: true,
        tableExists: true,
        message: "Conexão com o Supabase efetuada com sucesso! A tabela 'registrations' está pronta e acessível.",
        count: data?.length || 0
      });

    } catch (err: any) {
      console.warn("Database connection test error:", err);
      return res.status(500).json({
        configured: true,
        success: false,
        message: "Ocorreu um erro interno ao testar a conexão com o banco de dados.",
        error: err.message
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
