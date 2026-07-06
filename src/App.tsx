/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MapPin, 
  Sparkles, 
  BookOpen, 
  Target, 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  Phone, 
  User, 
  Mail, 
  Briefcase, 
  Award, 
  ArrowRight,
  ShieldCheck,
  Check,
  Lock,
  MessageSquare,
  AlertCircle,
  Database,
  RefreshCw,
  AlertTriangle,
  Server,
  Edit3,
  X,
  Menu,
  RotateCcw,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import React, { useState } from "react";
import AdminDashboard from "./components/AdminDashboard";
// @ts-expect-error - local image asset configuration
import heroImage from "./assets/images/regenerated_image_1783354623537.png";
// @ts-expect-error - local image asset configuration
import mentorImage from "./assets/images/regenerated_image_1783354731720.jpg";
// @ts-expect-error - local image asset configuration
import mod1Image from "./assets/images/regenerated_image_1783356317886.jpg";
// @ts-expect-error - local image asset configuration
import mod4Image from "./assets/images/regenerated_image_1783356449669.jpg";

// --- Logo Component ---
const EmpexsLogo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`${className} select-none`} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circle Background */}
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" />
      
      {/* Group to scale and center the logo graphic elements within the circle */}
      <g transform="translate(50, 50) scale(0.82) translate(-50, -50)">
        {/* Blue Area on Left */}
        <path 
          d="M 50 6 C 25.7 6 6 25.7 6 50 C 6 65.5 14 79.1 26.2 87.2 C 14.5 65.5 25.2 40.5 47.8 20.2 C 48.5 19.6 49.3 19 50 18.4 C 50 14.3 50 10.1 50 6 Z" 
          fill="#0F3F8C" 
        />
        
        {/* Stylized Human - White Head */}
        <circle cx="54" cy="48" r="6.5" fill="#FFFFFF" />
        
        {/* Stylized Human - Swooping Torso/Arms */}
        <path 
          d="M 6.5 42 C 15 41.5 27 46 39.5 51 C 46 53.6 51 56 53.5 58 C 48.5 57.5 39.5 52.5 25 47 C 14.5 43 6.5 42 6.5 42 Z" 
          fill="#FFFFFF" 
        />
        <path 
          d="M 52.5 57.5 C 49.5 54 41 49 28 44 C 33 46 40.5 50.5 47 55.5 C 50 58 52.5 61 52.5 61 Z" 
          fill="#FFFFFF" 
        />
        
        {/* Gold Main Area on Right */}
        <path 
          d="M 75.5 30.5 C 84.5 41.5 87.5 56.5 82.5 69.5 C 80.5 74 77.5 78 74 81.5 C 68.5 75 64 67.5 62.5 59 C 61 50.5 68 38 75.5 30.5 Z" 
          fill="#C59C27" 
        />
        
        {/* Gold Bottom Anchor Area */}
        <path 
          d="M 44.5 87 C 47.5 88 53.5 88.5 58 85.5 C 62 83 65.5 79 68.5 74.5 C 63 77.5 55.5 79.5 49 81 C 46.5 81.8 45 84.5 44.5 87 Z" 
          fill="#C59C27" 
        />
        
        {/* Dynamic Swoosh dividing arc */}
        <path 
          d="M 21.5 91 C 23.5 89 29 82.5 36.5 73 C 48.5 57 60 41 72.5 31.5 C 74 30.5 75.5 31.5 74.5 32.5 C 62.5 43 50.5 60.5 39 76 C 31 87.5 24 92 21.5 91 Z" 
          fill="#FFFFFF" 
        />
      </g>
    </svg>
  );
};

// --- Types ---
interface ModuleItem {
  id: string;
  badge: string;
  title: string;
  desc: string;
  lessons: string[];
}

interface FaqItem {
  question: string;
  answer: string;
}

interface CarouselModule {
  id: number;
  badge: string;
  title: string;
  desc: string;
  image: string;
}

// --- Content Data ---
const imageMap: Record<string, string> = {
  "mod1Image": mod1Image,
  "mod4Image": mod4Image
};

const CAROUSEL_MODULES: CarouselModule[] = [
  {
    id: 1,
    badge: "MÓDULO 1",
    title: "Aplicações da IA na Gestão",
    desc: "Você domina as ferramentas certas, personaliza a IA para seu contexto e integra imediatamente no seu dia a dia para ganhar velocidade e precisão na operação.",
    image: mod1Image
  },
  {
    id: 2,
    badge: "MÓDULO 2",
    title: "Engenharia de Prompts na Gestão",
    desc: "Você aprende a construir prompts cirúrgicos que extraem potencial real das IAs e resolvem problemas da sua gestão. A IA deixa de ser \"uma máquina de respostas\" e passa a ser um copiloto do seu negócio.",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    badge: "MÓDULO 3",
    title: "Agentes Departamentais",
    desc: "Você cria IAs do zero para operar em áreas chave: financeiro, marketing, RH, operações. Um time de especialistas digitais que automatizam tarefas, integram sistemas e agem como profissionais treinados.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    badge: "MÓDULO 4",
    title: "Análise de Dados e Decisões",
    desc: "Você transforma seus dados e planilhas em análises visuais claras e ágeis, identifica padrões críticos e toma decisões com mais segurança. Sem depender de analistas ou esperar relatórios demorados.",
    image: mod4Image
  },
  {
    id: 5,
    badge: "MÓDULO 5",
    title: "Liderança 4.0 com IA",
    desc: "Você cria seu modelo de liderança que funciona sem sua presença constante. A IA otimiza parte da comunicação, acelera procedimentos e transforma estratégia em execução previsível.",
    image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    badge: "MÓDULO 6",
    title: "Processos Lean com IA",
    desc: "Você mapeia, otimiza e acelera processos-chave, cortando desperdícios e aumentando eficiência. Resultado: operações mais enxutas, rápidas e com menor custo.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 7,
    badge: "MÓDULO 7",
    title: "Gestão de Pessoas com IA",
    desc: "Você usa IA para mapear talentos, alinhar metas e corrigir desvios com feedbacks baseados em dados. Equipes mais produtivas, alinhadas e que entregam mais.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 8,
    badge: "MÓDULO 8",
    title: "Carreira e Posicionamento",
    desc: "Você constrói um posicionamento que comunica autoridade e diferenciação real no seu portfólio e LinkedIn. Mais visibilidade estratégica e uma ascensão como referência no seu nicho.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
  }
];

const PRESET_IMAGES = [
  { url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=600", label: "Cérebro IA" },
  { url: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=600", label: "Programação" },
  { url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600", label: "Robótica" },
  { url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600", label: "Análise de Dados" },
  { url: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=600", label: "Tecnologia / Liderança" },
  { url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600", label: "Processos Digitais" },
  { url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600", label: "Gestão / Equipes" },
  { url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600", label: "Carreira / Foco" }
];

const FAQ_DATA: FaqItem[] = [
  {
    question: "O curso é realmente presencial e gratuito?",
    answer: "Sim! Este é um curso presencial realizado na Escola Sicchierolli em Franca/SP, totalmente gratuito. É uma oportunidade única patrocinada para capacitar líderes e profissionais da região."
  },
  {
    question: "Quais são os dias e horários das aulas?",
    answer: "As aulas acontecem de 13/07 a 05/08, sempre às segundas, terças e quartas-feiras, das 19h às 21h30."
  },
  {
    question: "Preciso ter conhecimento prévio em programação?",
    answer: "Não! O curso é focado em métodos de gestão e uso prático de ferramentas de IA sem necessidade de código (No-Code). É ideal para empresários, gestores e profissionais de qualquer setor."
  },
  {
    question: "Como funciona a seleção para as vagas?",
    answer: "Como as vagas são presenciais e limitadas pela capacidade física do local, haverá uma rápida avaliação de conhecimentos básicos enviada pelo professor para validar a sua inscrição e garantir o melhor aproveitamento do grupo."
  },
  {
    question: "Receberei certificado de conclusão?",
    answer: "Sim! Todos os participantes que cumprirem a presença mínima recomendada receberão um certificado oficial de conclusão assinado pelo mentor Alexandre Malta."
  }
];

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState("sicchierolli");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    role: "",
    location: "sicchierolli",
    agree: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>("m1");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Carousel curriculum states loaded dynamically from server
  const [modules, setModules] = useState<CarouselModule[]>(CAROUSEL_MODULES);
  const [isLoadingModules, setIsLoadingModules] = useState(true);

  const fetchModules = async () => {
    setIsLoadingModules(true);
    try {
      const res = await fetch("/api/learning-modules");
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setModules(data.data);
      } else {
        setModules(CAROUSEL_MODULES);
      }
    } catch (e) {
      console.error("Error loading dynamic modules:", e);
      setModules(CAROUSEL_MODULES);
    } finally {
      setIsLoadingModules(false);
    }
  };

  React.useEffect(() => {
    fetchModules();
  }, []);

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(4);
      } else if (window.innerWidth >= 640) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(1);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Supabase feedback states
  const [regSource, setRegSource] = useState<"supabase" | "in_memory" | null>(null);
  const [errorDetails, setErrorDetails] = useState<{ message: string; schemaHint?: string } | null>(null);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "location") {
      setSelectedLoc(value);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, agree: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.whatsapp || !formData.agree) {
      alert("Por favor, preencha todos os campos obrigatórios e aceite os termos.");
      return;
    }
    
    setIsSubmitting(true);
    setErrorDetails(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setRegSource(result.source);
        setShowSuccessModal(true);
      } else {
        setErrorDetails({
          message: result.message || "Ocorreu um erro ao processar o seu cadastro no servidor.",
          schemaHint: result.schemaHint
        });
      }
    } catch (err: any) {
      console.error("Erro na requisição:", err);
      setErrorDetails({
        message: "Não foi possível conectar ao servidor. Verifique se o backend está ativo."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const locName = formData.location === "sicchierolli" ? "Escola Sicchierolli" : "FATEC Franca";
    const message = encodeURIComponent(
      `Olá Alexandre! Acabei de me cadastrar no site para o curso presencial "Processos Ágeis com IA" na ${locName}. Quero confirmar minha vaga!`
    );
    window.open(`https://wa.me/5516996153442?text=${message}`, "_blank");
  };

  if (showAdmin) {
    return <AdminDashboard onBack={() => { setShowAdmin(false); fetchModules(); }} />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-lime-400 selection:text-neutral-950">
      
      {/* Top Warning Strip */}
      <div className="bg-gradient-to-r from-lime-500 via-neutral-900 to-cyan-500 text-white text-center py-2 px-4 text-xs font-bold tracking-widest uppercase relative z-50 flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 animate-pulse text-lime-300" />
        <span>Curso Presencial Gratuito — Escola Sicchierolli & FATEC Franca</span>
        <span className="hidden sm:inline-block bg-white/20 px-2 py-0.5 rounded text-[10px] ml-2">Vagas Limitadas</span>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <EmpexsLogo className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-black/20" />
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-widest text-white font-sans">ALEXANDRE MALTA</span>
              <span className="text-[10px] text-lime-400 font-bold tracking-wider uppercase font-mono">Processos Ágeis com IA</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-neutral-400">
            <a href="#locais" className="hover:text-lime-400 transition-colors">Locais & Horários</a>
            <a href="#sobre" className="hover:text-lime-400 transition-colors">O Curso</a>
            <a href="#conquistas" className="hover:text-lime-400 transition-colors">Benefícios</a>
            <a href="#cronograma" className="hover:text-lime-400 transition-colors">Cronograma</a>
            <a href="#mentor" className="hover:text-lime-400 transition-colors">O Mentor</a>
            <a href="#faq" className="hover:text-lime-400 transition-colors">Dúvidas</a>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="#inscricao" 
              className="hidden sm:inline-block bg-gradient-to-r from-lime-500 to-cyan-500 text-neutral-950 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md shadow-lime-500/20"
            >
              Garantir Vaga
            </a>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Alternar Menu"
              className="md:hidden w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 text-white flex items-center justify-center hover:bg-neutral-850 active:scale-95 transition-all cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu Drawer */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-20 left-0 right-0 z-30 bg-neutral-950/95 backdrop-blur-lg border-b border-white/10 px-6 py-8 flex flex-col gap-6 shadow-2xl"
          >
            <div className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest text-neutral-300">
              <a 
                href="#locais" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 border-b border-white/5 hover:text-lime-400 transition-colors block"
              >
                Locais & Horários
              </a>
              <a 
                href="#sobre" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 border-b border-white/5 hover:text-lime-400 transition-colors block"
              >
                O Curso
              </a>
              <a 
                href="#conquistas" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 border-b border-white/5 hover:text-lime-400 transition-colors block"
              >
                Benefícios
              </a>
              <a 
                href="#cronograma" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 border-b border-white/5 hover:text-lime-400 transition-colors block"
              >
                Cronograma
              </a>
              <a 
                href="#mentor" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 border-b border-white/5 hover:text-lime-400 transition-colors block"
              >
                O Mentor
              </a>
              <a 
                href="#faq" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 hover:text-lime-400 transition-colors block"
              >
                Dúvidas
              </a>
            </div>

            <a 
              href="#inscricao" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-gradient-to-r from-lime-400 to-lime-500 text-neutral-950 py-4 rounded-xl text-center text-xs font-black uppercase tracking-widest hover:brightness-110 active:scale-98 transition-all shadow-lg shadow-lime-500/20"
            >
              Garantir Minha Vaga
            </a>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative pt-16 pb-24 lg:py-32 overflow-hidden bg-neutral-950 border-b border-white/5">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-lime-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center relative z-10">
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lime-400/5 border border-lime-400/20 text-lime-400 text-xs font-black uppercase tracking-widest mb-8">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
              CURSO PRESENCIAL EM FRANCA/SP
            </div>

            {/* Giant Title matching banner */}
            <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white uppercase leading-none mb-6">
              PROCESSOS<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-lime-500">ÁGEIS</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">COM IA</span>
            </h1>

            {/* Banner Statement */}
            <div className="border-l-2 border-lime-400 pl-4 mb-10">
              <p className="text-lg md:text-xl font-bold tracking-wider text-white uppercase">
                TRANSFORME PROCESSOS. <span className="text-lime-400">IMPULSIONE RESULTADOS.</span> LIDERE O FUTURO.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <a 
                href="#inscricao" 
                className="bg-gradient-to-r from-lime-400 to-lime-500 text-neutral-950 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:brightness-110 active:scale-98 transition-all text-center flex items-center justify-center gap-3 shadow-lg shadow-lime-500/20 group"
              >
                Garantir Minha Vaga
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </a>
              
              <a 
                href="https://wa.me/5516996153442" 
                target="_blank" 
                rel="noreferrer" 
                className="bg-neutral-900/80 border border-white/10 hover:border-lime-400/20 text-white px-8 py-4 rounded-2xl text-sm font-bold tracking-wider hover:bg-neutral-900/50 transition-all text-center flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5 text-lime-400" />
                Mais Informações
              </a>
            </div>

          </div>

          {/* Right Column: Visual Portrait Card with AI overlay elements */}
          <div className="lg:col-span-5 relative group/hero">
            <div className="absolute inset-0 bg-gradient-to-tr from-lime-500/10 via-transparent to-cyan-500/10 rounded-3xl blur-2xl animate-pulse" />
            
            {/* Dynamic Floating Card 1: Sprint Otimizada */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 1.5, -1.5, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-4 left-2 sm:-left-4 md:-left-8 z-20 bg-neutral-900/90 backdrop-blur-md border border-white/10 px-3 py-2 sm:px-4 sm:py-3 rounded-2xl shadow-2xl flex items-center gap-2 sm:gap-3 select-none"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-lime-400/15 flex items-center justify-center border border-lime-400/20">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-lime-400" />
              </div>
              <div>
                <p className="text-[8px] sm:text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase">Foco e Ritmo</p>
                <p className="text-[10px] sm:text-xs font-black text-white">Sprint Ativa</p>
              </div>
            </motion.div>

            {/* Dynamic Floating Card 2: Agente de IA */}
            <motion.div
              animate={{
                y: [0, 10, 0],
                rotate: [0, -2, 2, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute top-[40%] right-2 sm:-right-4 md:-right-8 z-20 bg-neutral-900/90 backdrop-blur-md border border-white/10 px-3 py-2 sm:px-4 sm:py-3 rounded-2xl shadow-2xl flex items-center gap-2 sm:gap-3 select-none"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cyan-400/15 flex items-center justify-center border border-cyan-400/20">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
              </div>
              <div>
                <p className="text-[8px] sm:text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase">Co-Piloto</p>
                <p className="text-[10px] sm:text-xs font-black text-white">Agente de IA</p>
              </div>
            </motion.div>

            {/* Dynamic Floating Card 3: Eficiência */}
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [0, 1, -1, 0]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute bottom-[28%] left-2 sm:-left-3 md:-left-6 z-20 bg-neutral-900/90 backdrop-blur-md border border-white/10 px-3 py-2 sm:px-4 sm:py-3 rounded-2xl shadow-2xl flex items-center gap-2 sm:gap-3 select-none"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-400/15 flex items-center justify-center border border-amber-400/20">
                <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-[8px] sm:text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase">Performance</p>
                <p className="text-[10px] sm:text-xs font-black text-white">Fluxo Contínuo</p>
              </div>
            </motion.div>

            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-neutral-950 p-2">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-900">
                <img 
                  src={heroImage} 
                  alt="Processos Ágeis com Inteligência Artificial" 
                  className="w-full h-full object-cover group-hover/hero:scale-102 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/10 to-transparent" />
                
                {/* Neon Floating Badges matching banner elements */}
                <div className="absolute top-6 right-6 bg-lime-400/10 backdrop-blur-md border border-lime-400/30 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-lime-400">
                  INVESTIMENTO GRATUITO
                </div>

                {/* Banner message badge */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-neutral-950/80 backdrop-blur-lg border border-white/10 p-5 rounded-xl">
                    <p className="text-[10px] text-lime-400 font-bold uppercase tracking-widest font-mono mb-1">Para quem quer:</p>
                    <p className="text-white font-serif text-lg font-light italic">
                      "Evoluir, liderar e fazer a diferença."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Locais e Turmas Disponíveis Section */}
      <section id="locais" className="bg-neutral-900/40 border-b border-white/5 py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-[10px] text-lime-400 font-mono tracking-widest font-black uppercase mb-4 block">TURMAS PRESENCIAIS EM FRANCA/SP</span>
            <h2 className="text-3xl md:text-5xl font-light font-serif text-white leading-tight">
              Locais, Datas e <span className="italic font-normal text-lime-400">Horários</span>
            </h2>
            <p className="text-sm text-neutral-400 mt-4 font-light">
              Escolha a turma que melhor se adapta à sua rotina profissional. Ambas são 100% presenciais e gratuitas, mas possuem vagas estritamente limitadas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Local 01 Card */}
            <div className={`p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border transition-all flex flex-col justify-between ${
              selectedLoc === "sicchierolli" 
                ? "bg-gradient-to-b from-neutral-900 to-neutral-950 border-lime-400/40 shadow-xl shadow-lime-400/5" 
                : "bg-neutral-950/40 border-white/5 hover:border-white/10"
            }`}>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-[10px] font-black uppercase tracking-widest">
                    TURMA NOITE
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-serif text-white font-light mb-4">
                  Escola Sicchierolli
                </h3>

                <div className="space-y-4 text-sm mb-8">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider">DATAS</p>
                      <p className="font-bold text-white">De 13/07 à 05/08</p>
                      <p className="text-xs text-neutral-400 font-sans">Aulas às Segundas, Terças e Quartas</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider">HORÁRIO</p>
                      <p className="font-bold text-white">19h às 21h30</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider">ENDEREÇO</p>
                      <p className="font-bold text-white">Rua Prof. Laerte Barbosa Cintra, 929</p>
                      <p className="text-xs text-neutral-400 font-sans">Residencial Baldassari — Franca/SP</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider">INVESTIMENTO</p>
                      <p className="font-bold text-lime-400">100% Gratuito</p>
                      <p className="text-xs text-neutral-400 font-sans">Vagas estritamente limitadas!</p>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="#inscricao"
                onClick={() => {
                  setSelectedLoc("sicchierolli");
                  setFormData(prev => ({ ...prev, location: "sicchierolli" }));
                }}
                className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest text-center transition-all ${
                  selectedLoc === "sicchierolli"
                    ? "bg-lime-400 text-neutral-950 shadow-md shadow-lime-500/10 hover:brightness-110"
                    : "bg-neutral-900 border border-white/10 text-white hover:border-lime-400/30"
                }`}
              >
                Selecionar & Inscrever nesta Turma
              </a>
            </div>

            {/* Local 02 Card */}
            <div className={`p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border transition-all flex flex-col justify-between ${
              selectedLoc === "fatec" 
                ? "bg-gradient-to-b from-neutral-900 to-neutral-950 border-cyan-400/40 shadow-xl shadow-cyan-400/5" 
                : "bg-neutral-950/40 border-white/5 hover:border-white/10"
            }`}>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest">
                    TURMA TARDE
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-serif text-white font-light mb-4">
                  FATEC Franca
                </h3>

                <div className="space-y-4 text-sm mb-8">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider">DATAS</p>
                      <p className="font-bold text-white">De 15/07 à 20/08</p>
                      <p className="text-xs text-neutral-400 font-sans">Aulas às Quartas e Quintas</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider">HORÁRIO</p>
                      <p className="font-bold text-white">13h30 às 16h00</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider">ENDEREÇO</p>
                      <p className="font-bold text-white">FATEC - Faculdade de Tecnologia</p>
                      <p className="text-xs text-neutral-400 font-sans">Rua Irene Grecco, 4580, Vila Imperador — Franca/SP</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider">INVESTIMENTO</p>
                      <p className="font-bold text-cyan-400">100% Gratuito</p>
                      <p className="text-xs text-neutral-400 font-sans">Vagas estritamente limitadas!</p>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="#inscricao"
                onClick={() => {
                  setSelectedLoc("fatec");
                  setFormData(prev => ({ ...prev, location: "fatec" }));
                }}
                className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest text-center transition-all ${
                  selectedLoc === "fatec"
                    ? "bg-cyan-400 text-neutral-950 shadow-md shadow-cyan-500/10 hover:brightness-110"
                    : "bg-neutral-900 border border-white/10 text-white hover:border-cyan-400/30"
                }`}
              >
                Selecionar & Inscrever nesta Turma
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Target Audience / Para Quem é este Curso */}
      <section id="sobre" className="py-24 bg-neutral-950 relative">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-6">
            <span className="text-[10px] text-lime-400 font-mono tracking-widest font-bold uppercase mb-4 block">DIRECIONAMENTO</span>
            <h2 className="text-3xl md:text-5xl font-light font-serif leading-tight text-white mb-8">
              Para Quem é Este <span className="italic font-normal text-lime-400">Curso?</span>
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4 p-5 rounded-2xl bg-neutral-900/30 border border-white/5 hover:border-lime-400/20 transition-all">
                <div className="w-8 h-8 rounded-full bg-lime-400/10 flex items-center justify-center text-lime-400 shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Profissionais que querem dar um UP na carreira</h4>
                  <p className="text-sm text-neutral-400 mt-1 leading-relaxed">
                    Aprenda a dominar as metodologias ágeis mais valorizadas pelas grandes empresas, combinando-as com inteligência artificial para realizar tarefas complexas em minutos.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-2xl bg-neutral-900/30 border border-white/5 hover:border-lime-400/20 transition-all">
                <div className="w-8 h-8 rounded-full bg-lime-400/10 flex items-center justify-center text-lime-400 shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Empreendedores e líderes que desejam agilizar processos e crescer mais</h4>
                  <p className="text-sm text-neutral-400 mt-1 leading-relaxed">
                    Elimine o desperdício operacional de tempo e recursos, delegando rotinas para a IA e criando uma cultura de inovação focada em alta performance operacional.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-b from-neutral-900/60 to-neutral-950 p-6 sm:p-12 rounded-3xl sm:rounded-[2.5rem] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-lime-500/5 rounded-full blur-[80px] pointer-events-none" />
            
            <span className="text-[10px] text-lime-400 font-mono tracking-widest font-bold uppercase mb-4 block">REQUISITOS ADICIONAIS</span>
            <h3 className="text-2xl font-serif text-white font-light mb-6">Critérios de Seleção</h3>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-xs text-neutral-300 font-light">
                <div className="w-2 h-2 rounded-full bg-lime-400" />
                <span>Idade mínima de 18 anos no ato da matrícula.</span>
              </li>
              <li className="flex items-center gap-3 text-xs text-neutral-300 font-light">
                <div className="w-2 h-2 rounded-full bg-lime-400" />
                <span>Fazer o preenchimento do formulário cadastral abaixo.</span>
              </li>
              <li className="flex items-center gap-3 text-xs text-neutral-300 font-light">
                <div className="w-2 h-2 rounded-full bg-lime-400" />
                <span>Realizar a avaliação de conhecimentos básicos enviada no WhatsApp.</span>
              </li>
            </ul>

            <div className="bg-neutral-950/60 border border-white/15 p-4 rounded-xl text-xs text-neutral-400 leading-relaxed">
              <span className="font-bold text-white block mb-1">Importante:</span>
              A frequência mínima para certificação é de 75% das aulas ministradas de forma presencial.
            </div>
          </div>

        </div>
      </section>

      {/* Benefits Section: O Que Você Vai Conquistar */}
      <section id="conquistas" className="py-24 bg-neutral-900/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="text-[10px] text-lime-400 font-mono tracking-widest font-black uppercase mb-4 block">O QUE VOCÊ VAI CONQUISTAR:</span>
            <h2 className="text-3xl md:text-5xl font-light font-serif text-white leading-tight">
              Os Pilares de Sua <span className="italic font-normal text-lime-400">Evolução</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="bg-neutral-950/60 border border-white/5 p-6 sm:p-8 rounded-3xl hover:border-lime-400/20 transition-all flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-lime-400/10 flex items-center justify-center text-lime-400 mb-6">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Métodos Ágeis</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Fundamentos e métodos ágeis aplicados diretamente à sua rotina de liderança ou trabalho diário.
              </p>
            </div>

            <div className="bg-neutral-950/60 border border-white/5 p-6 sm:p-8 rounded-3xl hover:border-lime-400/20 transition-all flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-400 mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">IA Operacional</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Aprenda a mapear e utilizar a Inteligência Artificial para otimizar fluxos e processos reais.
              </p>
            </div>

            <div className="bg-neutral-950/60 border border-white/5 p-6 sm:p-8 rounded-3xl hover:border-lime-400/20 transition-all flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Alta Performance</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Mais produtividade individual e coletiva, menos retrabalho e melhores resultados práticos.
              </p>
            </div>

            <div className="bg-neutral-950/60 border border-white/5 p-6 sm:p-8 rounded-3xl hover:border-lime-400/20 transition-all flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-purple-400/10 flex items-center justify-center text-purple-400 mb-6">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Estudos de Caso</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Análise de cenários reais e exercícios práticos dirigidos para aplicar de imediato na sua empresa.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Curriculum Section */}
      <section id="cronograma" className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <span className="text-[10px] text-lime-400 font-mono tracking-widest font-black uppercase mb-4 block">PROGRAMA COMPLETO</span>
            <h2 className="text-3xl md:text-5xl font-light font-serif text-white">
              Grade de Aprendizado
            </h2>
            <p className="text-sm text-neutral-400 mt-4 font-light max-w-2xl mx-auto">
              Uma ementa projetada para levar você do absoluto zero à maestria operacional combinando metodologias ágeis e inteligência artificial.
            </p>
          </div>

          {/* Carousel Grid */}
          <div className="relative overflow-hidden">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {modules.slice(
                currentPage * itemsPerPage,
                (currentPage + 1) * itemsPerPage
              ).map((m) => (
                <div 
                  key={m.id} 
                  className="bg-[#0b0f19]/40 border border-white/5 rounded-[2rem] overflow-hidden flex flex-col h-full hover:border-[#00D2FF]/20 transition-all duration-300 shadow-xl shadow-black/25 group relative"
                >
                  {/* Card Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img 
                      src={imageMap[m.image] || m.image} 
                      alt={m.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {/* Soft dark overlay fading to top */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/10 to-transparent pointer-events-none" />
                    
                    {/* Badge */}
                    <div className="absolute bottom-4 left-6">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#00D2FF] text-neutral-950 text-[10px] font-black uppercase tracking-widest font-mono">
                        {m.badge}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 sm:p-8 pt-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white tracking-tight leading-snug mb-4">
                        {m.title}
                      </h3>
                      <p className="text-sm text-neutral-400 font-light leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Carousel Controls */}
          {Math.ceil(modules.length / itemsPerPage) > 1 && (
            <div className="mt-12 flex items-center justify-center gap-6">
              <button
                onClick={() => {
                  if (currentPage > 0) setCurrentPage(currentPage - 1);
                }}
                disabled={currentPage === 0}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                  currentPage === 0
                    ? "border-white/5 text-neutral-700 cursor-not-allowed"
                    : "border-white/10 text-white hover:border-[#00D2FF]/40 hover:bg-[#00D2FF]/5 active:scale-95"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Indicators */}
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.ceil(modules.length / itemsPerPage) }).map((_, idx) => {
                  const isActive = idx === currentPage;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx)}
                      className={`h-1.5 transition-all duration-300 rounded-full ${
                        isActive ? "w-6 bg-[#00D2FF]" : "w-1.5 bg-neutral-600 hover:bg-neutral-500"
                      }`}
                    />
                  );
                })}
              </div>

              <button
                onClick={() => {
                  const totalPages = Math.ceil(modules.length / itemsPerPage);
                  if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
                }}
                disabled={currentPage === Math.ceil(modules.length / itemsPerPage) - 1}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                  currentPage === Math.ceil(modules.length / itemsPerPage) - 1
                    ? "border-white/5 text-neutral-700 cursor-not-allowed"
                    : "border-white/10 text-white hover:border-[#00D2FF]/40 hover:bg-[#00D2FF]/5 active:scale-95"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      </section>

      {/* About Alexandre Malta */}
      <section id="mentor" className="py-24 bg-neutral-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="p-6 sm:p-16 rounded-3xl sm:rounded-[2.5rem] bg-neutral-900/30 border border-white/5">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative aspect-square w-full max-w-sm rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <img 
                    src={mentorImage} 
                    alt="Alexandre Malta Coach" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="lg:col-span-7">
                <span className="text-[10px] text-lime-400 font-mono tracking-widest font-bold uppercase mb-4 block">SEU PROFESSOR E FACILITADOR</span>
                <h2 className="text-3xl md:text-5xl font-light font-serif text-white mb-6">Alexandre Malta</h2>
                
                <p className="text-neutral-400 text-sm font-light leading-relaxed mb-6">
                  Especialista em Gestão Estratégica, Metodologias Ágeis e Otimização Operacional. Alexandre conta com uma vasta trajetória de mentoria corporativa, implementando sistemas inovadores de alta performance que integram conceitos Lean e tecnologia de ponta.
                </p>

                <p className="text-neutral-400 text-sm font-light leading-relaxed mb-8">
                  Como facilitador oficial deste curso presencial, Alexandre guiará cada participante nos exercícios e estudos de caso, assegurando que as ferramentas de inteligência artificial de última geração se convertam em resultados tangíveis e ganhos expressivos de produtividade imediata.
                </p>

                <div className="flex flex-wrap gap-6 sm:gap-8 border-t border-white/5 pt-8">
                  <div>
                    <span className="text-2xl sm:text-3xl font-serif text-lime-400 font-light">+35 Anos</span>
                    <span className="text-neutral-500 text-[10px] font-mono tracking-widest uppercase block mt-1">De Atuação</span>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-serif text-lime-400 font-light">100% Prático</span>
                    <span className="text-neutral-500 text-[10px] font-mono tracking-widest uppercase block mt-1">Direcionado</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Registration Form Block */}
      <section id="inscricao" className="py-24 bg-neutral-950 border-t border-white/5 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime-500/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          
          <div className="text-center mb-12">
            <span className="text-[10px] text-lime-400 font-mono tracking-widest font-black uppercase mb-4 block">GARANTA SUA PARTICIPAÇÃO</span>
            <h2 className="text-4xl md:text-5xl font-light font-serif text-white leading-tight">
              Inscrição para Seleção de Vagas
            </h2>
            <p className="text-neutral-400 text-sm font-light mt-4 leading-relaxed">
              As vagas são estritamente presenciais e limitadas pela capacidade física de cada local. Preencha o formulário abaixo para iniciar a sua avaliação básica de entrada.
            </p>
          </div>

          <div className="bg-neutral-900/50 border border-lime-400/30 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-12 backdrop-blur-lg">
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="text-xs font-mono font-bold tracking-wider text-neutral-400 uppercase block mb-2">Nome Completo *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: Alexandre Malta"
                    className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-mono font-bold tracking-wider text-neutral-400 uppercase block mb-2">E-mail Corporativo ou Pessoal *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="alexandre@exemplo.com"
                      className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold tracking-wider text-neutral-400 uppercase block mb-2">WhatsApp com DDD *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input 
                      type="tel" 
                      name="whatsapp"
                      required
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="(16) 99999-9999"
                      className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-bold tracking-wider text-neutral-400 uppercase block mb-2">Turma e Local de Interesse *</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <select 
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none appearance-none transition-all"
                  >
                    <option value="sicchierolli">Escola Sicchierolli (De 13/07 à 05/08 - Seg, Ter e Qua às 19h00)</option>
                    <option value="fatec">FATEC Franca (De 15/07 à 20/08 - Qua e Qui às 13h30)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-bold tracking-wider text-neutral-400 uppercase block mb-2">Sua Atuação Profissional Principal</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <select 
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none appearance-none transition-all"
                  >
                    <option value="">Selecione sua área...</option>
                    <option value="empresario">Empresário / Diretor</option>
                    <option value="lider">Líder / Coordenador</option>
                    <option value="profissional_lib">Profissional Autônomo</option>
                    <option value="outro">Outra atuação</option>
                  </select>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="agree"
                  name="agree"
                  required
                  checked={formData.agree}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 mt-0.5 rounded border-white/10 bg-neutral-950 text-lime-400 focus:ring-0 focus:ring-offset-0"
                />
                <label htmlFor="agree" className="text-xs text-neutral-400 leading-relaxed font-light">
                  Estou ciente de que as vagas são presenciais em Franca/SP e comprometo-me a realizar a avaliação básica de conhecimentos solicitada pelo facilitador. *
                </label>
              </div>

              {errorDetails && (
                <div className="p-5 bg-red-950/40 border border-red-500/30 rounded-2xl text-xs text-red-200 space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-red-400">Falha na Conexão Supabase</p>
                      <p className="mt-1 leading-relaxed">{errorDetails.message}</p>
                    </div>
                  </div>
                  {errorDetails.schemaHint && (
                    <div className="mt-3 pt-3 border-t border-red-500/10 space-y-2">
                      <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider font-bold">Crie a tabela executando este comando SQL no seu Supabase:</p>
                      <pre className="p-3 bg-neutral-950 border border-white/5 rounded-xl text-[10px] font-mono text-neutral-300 overflow-x-auto whitespace-pre selection:bg-red-500/30">
                        {errorDetails.schemaHint}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-lime-400 to-lime-500 text-neutral-950 py-5 rounded-xl text-sm font-black uppercase tracking-widest hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-3 shadow-md shadow-lime-500/20"
              >
                {isSubmitting ? "Processando Cadastro..." : "Garantir Minha Vaga Gratuita"}
                <ArrowRight className="w-5 h-5" />
              </button>

            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-neutral-500 font-mono tracking-widest uppercase">
              <Lock className="w-4 h-4 text-lime-400" />
              CONEXÃO CRIPTOGRAFADA • SEUS DADOS ESTÃO SEGUROS
            </div>

          </div>

        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-24 bg-neutral-950 border-t border-white/5 relative">
        <div className="max-w-3xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <span className="text-[10px] text-lime-400 font-mono tracking-widest font-black uppercase mb-4 block">PERGUNTAS FREQUENTES</span>
            <h2 className="text-3xl md:text-5xl font-light font-serif text-white">Dúvidas Resolvidas</h2>
          </div>

          <div className="space-y-4">
            {FAQ_DATA.map((faq, idx) => {
              const isExpanded = openFaq === idx;
              return (
                <div key={idx} className="border-b border-white/5 pb-4">
                  <button 
                    onClick={() => setOpenFaq(isExpanded ? null : idx)}
                    className="w-full py-5 flex items-center justify-between text-left group"
                  >
                    <span className="text-base font-serif font-light text-neutral-200 group-hover:text-lime-400 transition-colors">{faq.question}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isExpanded ? 'bg-lime-400 text-neutral-950' : 'text-neutral-500 border border-white/10'}`}>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="pb-5 text-neutral-400 text-sm font-light leading-relaxed"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>



      {/* Footer / Whatsapp Quick contact */}
      <footer className="py-16 bg-neutral-950 border-t border-white/5 text-xs text-neutral-600 font-sans">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <EmpexsLogo className="w-8 h-8 rounded-lg overflow-hidden" />
              <span className="text-sm font-black text-white uppercase tracking-widest font-sans">ALEXANDRE MALTA</span>
            </div>
            <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-1">CURSO PRESENCIAL • FRANCA/SP</p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
            <a 
              href="https://wa.me/5516996153442" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-white/10 hover:border-lime-400/30 text-white rounded-full text-xs font-bold transition-all"
            >
              <MessageSquare className="w-4 h-4 text-lime-400" />
              <span>Dúvidas no WhatsApp: (16) 99615-3442</span>
            </a>
            <p className="text-center md:text-right text-neutral-500 flex flex-wrap items-center justify-center md:justify-end gap-2.5 mt-1">
              <span>© 2026 Processos Ágeis com IA. Todos os direitos reservados.</span>
              <span className="text-neutral-800 hidden sm:inline">•</span>
              <button 
                onClick={() => setShowAdmin(true)}
                className="inline-flex items-center gap-1 hover:text-lime-400 text-neutral-500 font-medium transition-all active:scale-95 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-lime-400" />
                <span>Painel Admin</span>
              </button>
            </p>
          </div>

        </div>
      </footer>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowSuccessModal(false)} />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-neutral-900 border border-lime-400/30 p-8 md:p-12 rounded-[2.5rem] max-w-md w-full relative z-10 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400 mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-serif text-white font-light mb-4">Inscrição Iniciada!</h3>
            
            {regSource === "supabase" ? (
              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-[10px] font-mono uppercase tracking-widest">
                  ✨ Salvo no Supabase
                </span>
              </div>
            ) : (
              <div className="mb-6 bg-neutral-950 p-3 border border-white/5 rounded-xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-mono uppercase tracking-widest">
                  💾 Simulado (In-Memory)
                </span>
                <p className="text-[10px] text-neutral-500 font-sans mt-2">
                  Configure as variáveis de ambiente <span className="font-mono text-neutral-400">SUPABASE_URL</span> e <span className="font-mono text-neutral-400">SUPABASE_ANON_KEY</span> nos segredos para salvar de verdade!
                </p>
              </div>
            )}
            
            <p className="text-neutral-400 text-sm font-light leading-relaxed mb-8">
              Parabéns! Seus dados cadastrais foram enviados com sucesso. Agora, dê o próximo passo crucial para confirmar sua participação: clique no botão abaixo para nos enviar uma mensagem no WhatsApp e solicitar a sua avaliação básica.
            </p>

            <button 
              onClick={handleWhatsAppRedirect}
              className="w-full bg-gradient-to-r from-lime-400 to-lime-500 text-neutral-950 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Confirmar no WhatsApp</span>
            </button>

            <button 
              onClick={() => setShowSuccessModal(false)}
              className="text-[10px] text-neutral-500 hover:text-white font-mono tracking-widest uppercase mt-4 block mx-auto"
            >
              Fechar Janela
            </button>
          </motion.div>
        </div>
      )}



    </div>
  );
}
