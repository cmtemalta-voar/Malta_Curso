import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Search, 
  Download, 
  Trash2, 
  RefreshCw, 
  ShieldAlert, 
  Check, 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Sparkles,
  Lock,
  LogOut,
  AlertCircle,
  Database,
  ArrowRight,
  MessageSquare,
  Server,
  Edit3,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  FileText,
  Clock,
  Award
} from "lucide-react";

// @ts-expect-error - local image asset configuration
import mod1Image from "../assets/images/regenerated_image_1783356317886.jpg";
// @ts-expect-error - local image asset configuration
import mod4Image from "../assets/images/regenerated_image_1783356449669.jpg";

const imageMap: Record<string, string> = {
  "mod1Image": mod1Image,
  "mod4Image": mod4Image
};

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

interface Registration {
  id: string | number;
  created_at: string;
  name: string;
  email: string;
  whatsapp: string;
  role?: string;
  location: string;
  agree: boolean;
  cpf?: string;
  address_proof?: string;
}

interface AdminDashboardProps {
  onBack: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [dbSource, setDbSource] = useState<"supabase" | "in_memory" | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [listError, setListError] = useState("");

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  // Deletion state
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Database connection testing states
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [dbTestResult, setDbTestResult] = useState<{
    configured: boolean;
    success: boolean;
    tableExists?: boolean;
    message: string;
    schemaHint?: string;
    error?: string;
  } | null>(null);

  // Learning modules management states
  const [activeTab, setActiveTab] = useState<"leads" | "modules" | "locations" | "testimonials" | "branding">("leads");
  const [learningModules, setLearningModules] = useState<any[]>([]);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [modulesError, setModulesError] = useState("");
  const [editingModule, setEditingModule] = useState<any | null>(null);
  const [tempBadge, setTempBadge] = useState("");
  const [tempTitle, setTempTitle] = useState("");
  const [tempDesc, setTempDesc] = useState("");
  const [tempImage, setTempImage] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");
  const [isSavingModules, setIsSavingModules] = useState(false);

  // Testimonials management states
  const [testimonialsData, setTestimonialsData] = useState<{
    sectionSettings: { badge: string; title: string; description: string };
    items: any[];
  }>({
    sectionSettings: {
      badge: "DEPOIMENTOS REAIS",
      title: "Histórias de Sucesso",
      description: "Veja como profissionais e líderes de tecnologia estão revolucionando seus resultados e acelerando entregas com IA Generativa e Processos Ágeis."
    },
    items: []
  });
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(false);
  const [testimonialsError, setTestimonialsError] = useState("");
  const [isSavingTestimonials, setIsSavingTestimonials] = useState(false);

  // States for editing sectionSettings
  const [tempTestimonialSecBadge, setTempTestimonialSecBadge] = useState("");
  const [tempTestimonialSecTitle, setTempTestimonialSecTitle] = useState("");
  const [tempTestimonialSecDesc, setTempTestimonialSecDesc] = useState("");

  // States for editing a single testimonial item
  const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);
  const [tempTestimonialName, setTempTestimonialName] = useState("");
  const [tempTestimonialRole, setTempTestimonialRole] = useState("");
  const [tempTestimonialQuote, setTempTestimonialQuote] = useState("");
  const [tempTestimonialRating, setTempTestimonialRating] = useState(5);
  const [tempTestimonialHighlight, setTempTestimonialHighlight] = useState("");
  const [tempTestimonialImage, setTempTestimonialImage] = useState("");
  const [tempTestimonialVideoUrl, setTempTestimonialVideoUrl] = useState("");
  
  const [isUploadingTestimonialImage, setIsUploadingTestimonialImage] = useState(false);
  const [testimonialImageUploadError, setTestimonialImageUploadError] = useState("");

  const [isUploadingTestimonialVideo, setIsUploadingTestimonialVideo] = useState(false);
  const [testimonialVideoUploadError, setTestimonialVideoUploadError] = useState("");

  // Locations management states
  const [locations, setLocations] = useState<any[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [locationsError, setLocationsError] = useState("");
  const [editingLocation, setEditingLocation] = useState<any | null>(null);

  // Temp fields for editing location
  const [tempLocBadge, setTempLocBadge] = useState("");
  const [tempLocTitle, setTempLocTitle] = useState("");
  const [tempLocDatesTitle, setTempLocDatesTitle] = useState("");
  const [tempLocDates, setTempLocDates] = useState("");
  const [tempLocDatesSub, setTempLocDatesSub] = useState("");
  const [tempLocHoursTitle, setTempLocHoursTitle] = useState("");
  const [tempLocHours, setTempLocHours] = useState("");
  const [tempLocAddressTitle, setTempLocAddressTitle] = useState("");
  const [tempLocAddress, setTempLocAddress] = useState("");
  const [tempLocAddressSub, setTempLocAddressSub] = useState("");
  const [tempLocInvestmentTitle, setTempLocInvestmentTitle] = useState("");
  const [tempLocInvestment, setTempLocInvestment] = useState("");
  const [tempLocInvestmentSub, setTempLocInvestmentSub] = useState("");
  const [tempLocButtonText, setTempLocButtonText] = useState("");

  const [isSavingLocations, setIsSavingLocations] = useState(false);

  // Branding management states
  const [brandingConfig, setBrandingConfig] = useState({
    logoType: "svg",
    logoUrl: "",
    logoText: "ALEXANDRE MALTA",
    logoSubtext: "Processos Ágeis com IA"
  });
  const [isLoadingBranding, setIsLoadingBranding] = useState(false);
  const [brandingError, setBrandingError] = useState("");
  const [isSavingBranding, setIsSavingBranding] = useState(false);
  const [tempLogoType, setTempLogoType] = useState("svg");
  const [tempLogoUrl, setTempLogoUrl] = useState("");
  const [tempLogoText, setTempLogoText] = useState("");
  const [tempLogoSubtext, setTempLogoSubtext] = useState("");
  const [isUploadingLogoImage, setIsUploadingLogoImage] = useState(false);
  const [logoImageUploadError, setLogoImageUploadError] = useState("");

  const fetchBrandingConfig = async () => {
    setIsLoadingBranding(true);
    setBrandingError("");
    try {
      const res = await fetch("/api/branding");
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        const b = data.data;
        setBrandingConfig(b);
        setTempLogoType(b.logoType || "svg");
        setTempLogoUrl(b.logoUrl || "");
        setTempLogoText(b.logoText || "");
        setTempLogoSubtext(b.logoSubtext || "");
      } else {
        setBrandingError(data.message || "Erro ao carregar configurações de marca.");
      }
    } catch (err: any) {
      console.error("Error fetching branding:", err);
      setBrandingError("Erro ao se conectar ao servidor para buscar marca.");
    } finally {
      setIsLoadingBranding(false);
    }
  };

  const handleSaveBranding = async () => {
    setIsSavingBranding(true);
    try {
      const res = await fetch("/api/branding", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password
        },
        body: JSON.stringify({
          logoType: tempLogoType,
          logoUrl: tempLogoUrl,
          logoText: tempLogoText,
          logoSubtext: tempLogoSubtext
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBrandingConfig({
          logoType: tempLogoType,
          logoUrl: tempLogoUrl,
          logoText: tempLogoText,
          logoSubtext: tempLogoSubtext
        });
        alert("Configurações de marca salvas com sucesso!");
      } else {
        alert(data.message || "Erro ao salvar configurações de marca.");
      }
    } catch (err: any) {
      console.error("Error updating branding:", err);
      alert("Erro ao se conectar ao servidor para salvar.");
    } finally {
      setIsSavingBranding(false);
    }
  };

  const handleLogoImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setLogoImageUploadError("A imagem deve ter menos de 2MB.");
      return;
    }

    setIsUploadingLogoImage(true);
    setLogoImageUploadError("");
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setTempLogoUrl(reader.result);
        setTempLogoType("image");
      } else {
        setLogoImageUploadError("Erro ao processar imagem.");
      }
      setIsUploadingLogoImage(false);
    };
    reader.onerror = () => {
      setLogoImageUploadError("Erro ao ler o arquivo.");
      setIsUploadingLogoImage(false);
    };
    reader.readAsDataURL(file);
  };

  const fetchLearningModules = async () => {
    setIsLoadingModules(true);
    setModulesError("");
    try {
      const res = await fetch("/api/learning-modules");
      const data = await res.json();
      if (res.ok && data.success) {
        setLearningModules(data.data || []);
      } else {
        setModulesError(data.message || "Erro ao carregar os módulos de aprendizado.");
      }
    } catch (err: any) {
      console.error("Error fetching learning modules:", err);
      setModulesError("Erro ao se conectar ao servidor para buscar módulos de aprendizado.");
    } finally {
      setIsLoadingModules(false);
    }
  };

  const fetchLocationsConfig = async () => {
    setIsLoadingLocations(true);
    setLocationsError("");
    try {
      const res = await fetch("/api/locations-config");
      const data = await res.json();
      if (res.ok && data.success) {
        setLocations(data.data || []);
      } else {
        setLocationsError(data.message || "Erro ao carregar as configurações de locais.");
      }
    } catch (err: any) {
      console.error("Error fetching locations config:", err);
      setLocationsError("Erro ao se conectar ao servidor para buscar configurações de locais.");
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const fetchTestimonials = async () => {
    setIsLoadingTestimonials(true);
    setTestimonialsError("");
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      if (res.ok && data.success) {
        setTestimonialsData(data.data || { sectionSettings: { badge: "", title: "", description: "" }, items: [] });
      } else {
        setTestimonialsError(data.message || "Erro ao carregar os depoimentos.");
      }
    } catch (err: any) {
      console.error("Error fetching testimonials:", err);
      setTestimonialsError("Erro ao se conectar ao servidor para buscar depoimentos.");
    } finally {
      setIsLoadingTestimonials(false);
    }
  };

  const handleSaveTestimonials = async (updatedData: typeof testimonialsData) => {
    setIsSavingTestimonials(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password
        },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestimonialsData(updatedData);
        return true;
      } else {
        alert(data.message || "Erro ao salvar os depoimentos.");
        return false;
      }
    } catch (err: any) {
      console.error("Error updating testimonials:", err);
      alert("Erro ao conectar ao servidor para salvar os depoimentos.");
      return false;
    } finally {
      setIsSavingTestimonials(false);
    }
  };

  const handleEditLocationClick = (loc: any) => {
    setEditingLocation(loc);
    setTempLocBadge(loc.badge || "");
    setTempLocTitle(loc.title || "");
    setTempLocDatesTitle(loc.datesTitle || "DATAS");
    setTempLocDates(loc.dates || "");
    setTempLocDatesSub(loc.datesSub || "");
    setTempLocHoursTitle(loc.hoursTitle || "HORÁRIO");
    setTempLocHours(loc.hours || "");
    setTempLocAddressTitle(loc.addressTitle || "ENDEREÇO");
    setTempLocAddress(loc.address || "");
    setTempLocAddressSub(loc.addressSub || "");
    setTempLocInvestmentTitle(loc.investmentTitle || "INVESTIMENTO");
    setTempLocInvestment(loc.investment || "");
    setTempLocInvestmentSub(loc.investmentSub || "");
    setTempLocButtonText(loc.buttonText || "");
  };

  const handleSaveLocation = async () => {
    if (!editingLocation) return;
    setIsSavingLocations(true);
    
    const updatedLocations = locations.map((loc: any) => {
      if (loc.id === editingLocation.id) {
        return {
          ...loc,
          badge: tempLocBadge,
          title: tempLocTitle,
          datesTitle: tempLocDatesTitle,
          dates: tempLocDates,
          datesSub: tempLocDatesSub,
          hoursTitle: tempLocHoursTitle,
          hours: tempLocHours,
          addressTitle: tempLocAddressTitle,
          address: tempLocAddress,
          addressSub: tempLocAddressSub,
          investmentTitle: tempLocInvestmentTitle,
          investment: tempLocInvestment,
          investmentSub: tempLocInvestmentSub,
          buttonText: tempLocButtonText
        };
      }
      return loc;
    });

    try {
      const res = await fetch("/api/locations-config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password
        },
        body: JSON.stringify({ locations: updatedLocations })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLocations(updatedLocations);
        setEditingLocation(null);
      } else {
        alert("Erro ao salvar: " + (data.message || "Por favor, tente novamente."));
      }
    } catch (err: any) {
      console.error("Error updating location:", err);
      alert("Erro ao conectar ao servidor para salvar.");
    } finally {
      setIsSavingLocations(false);
    }
  };

  const handleSaveSectionSettings = async () => {
    const updatedData = {
      ...testimonialsData,
      sectionSettings: {
        badge: tempTestimonialSecBadge,
        title: tempTestimonialSecTitle,
        description: tempTestimonialSecDesc
      }
    };
    const success = await handleSaveTestimonials(updatedData);
    if (success) {
      alert("Configurações do cabeçalho de depoimentos salvas com sucesso!");
    }
  };

  const handleDeleteTestimonial = async (index: number) => {
    if (!confirm("Tem certeza que deseja excluir este depoimento? Esta ação não pode ser desfeita.")) {
      return;
    }
    const updatedItems = testimonialsData.items.filter((_, i) => i !== index);
    const updatedData = {
      ...testimonialsData,
      items: updatedItems
    };
    const success = await handleSaveTestimonials(updatedData);
    if (success) {
      alert("Depoimento excluído com sucesso!");
    }
  };

  const handleEditTestimonialClick = (item: any, index: number) => {
    setEditingTestimonial({ ...item, index });
    setTempTestimonialName(item.name || "");
    setTempTestimonialRole(item.role || "");
    setTempTestimonialQuote(item.quote || "");
    setTempTestimonialRating(item.rating || 5);
    setTempTestimonialHighlight(item.highlight || "");
    setTempTestimonialImage(item.image || "");
    setTempTestimonialVideoUrl(item.videoUrl || "");
    setTestimonialImageUploadError("");
    setTestimonialVideoUploadError("");
  };

  const handleAddNewTestimonialClick = () => {
    setEditingTestimonial({ isNew: true });
    setTempTestimonialName("");
    setTempTestimonialRole("");
    setTempTestimonialQuote("");
    setTempTestimonialRating(5);
    setTempTestimonialHighlight("");
    setTempTestimonialImage("");
    setTempTestimonialVideoUrl("");
    setTestimonialImageUploadError("");
    setTestimonialVideoUploadError("");
  };

  const handleSaveTestimonialItem = async () => {
    if (!tempTestimonialName.trim()) {
      alert("Por favor, informe o nome do depoente.");
      return;
    }
    if (!tempTestimonialQuote.trim()) {
      alert("Por favor, preencha o texto do depoimento.");
      return;
    }

    const newItem = {
      name: tempTestimonialName,
      role: tempTestimonialRole,
      quote: tempTestimonialQuote,
      rating: Number(tempTestimonialRating),
      highlight: tempTestimonialHighlight,
      image: tempTestimonialImage,
      videoUrl: tempTestimonialVideoUrl
    };

    let updatedItems = [...testimonialsData.items];
    if (editingTestimonial && editingTestimonial.isNew) {
      updatedItems.push(newItem);
    } else if (editingTestimonial && typeof editingTestimonial.index === 'number') {
      updatedItems[editingTestimonial.index] = newItem;
    }

    const updatedData = {
      ...testimonialsData,
      items: updatedItems
    };

    const success = await handleSaveTestimonials(updatedData);
    if (success) {
      setEditingTestimonial(null);
      alert(editingTestimonial?.isNew ? "Depoimento adicionado com sucesso!" : "Depoimento atualizado com sucesso!");
    }
  };

  const handleTestimonialImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setTestimonialImageUploadError("A imagem deve ter menos de 3MB.");
      return;
    }

    setIsUploadingTestimonialImage(true);
    setTestimonialImageUploadError("");
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setTempTestimonialImage(reader.result);
      } else {
        setTestimonialImageUploadError("Erro ao processar imagem.");
      }
      setIsUploadingTestimonialImage(false);
    };
    reader.onerror = () => {
      setTestimonialImageUploadError("Erro ao ler o arquivo de imagem.");
      setIsUploadingTestimonialImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleTestimonialVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setTestimonialVideoUploadError("O vídeo deve ter menos de 15MB. Para arquivos maiores, informe o link/URL do YouTube ou Vimeo.");
      return;
    }

    setIsUploadingTestimonialVideo(true);
    setTestimonialVideoUploadError("");
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setTempTestimonialVideoUrl(reader.result);
      } else {
        setTestimonialVideoUploadError("Erro ao processar vídeo.");
      }
      setIsUploadingTestimonialVideo(false);
    };
    reader.onerror = () => {
      setTestimonialVideoUploadError("Erro ao ler o arquivo de vídeo.");
      setIsUploadingTestimonialVideo(false);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (activeTab === "testimonials" && testimonialsData) {
      setTempTestimonialSecBadge(testimonialsData.sectionSettings.badge || "");
      setTempTestimonialSecTitle(testimonialsData.sectionSettings.title || "");
      setTempTestimonialSecDesc(testimonialsData.sectionSettings.description || "");
    }
  }, [activeTab, testimonialsData]);

  const handleEditModuleClick = (mod: any) => {
    setEditingModule(mod);
    setTempBadge(mod.badge || "");
    setTempTitle(mod.title || "");
    setTempDesc(mod.desc || "");
    setTempImage(mod.image || "");
    setImageUploadError("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setImageUploadError("A imagem deve ter menos de 3MB.");
      return;
    }

    setIsUploadingImage(true);
    setImageUploadError("");
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setTempImage(reader.result);
      } else {
        setImageUploadError("Erro ao processar o arquivo.");
      }
      setIsUploadingImage(false);
    };
    reader.onerror = () => {
      setImageUploadError("Falha na leitura do arquivo.");
      setIsUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveModule = async () => {
    if (!editingModule) return;
    setIsSavingModules(true);
    
    const updatedModules = learningModules.map((m: any) => {
      if (m.id === editingModule.id) {
        return {
          ...m,
          badge: tempBadge,
          title: tempTitle,
          desc: tempDesc,
          image: tempImage
        };
      }
      return m;
    });

    try {
      const res = await fetch("/api/learning-modules", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password
        },
        body: JSON.stringify({ modules: updatedModules })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLearningModules(updatedModules);
        setEditingModule(null);
      } else {
        alert("Erro ao salvar: " + (data.message || "Por favor, tente novamente."));
      }
    } catch (err: any) {
      console.error("Error updating module:", err);
      alert("Erro ao conectar ao servidor para salvar.");
    } finally {
      setIsSavingModules(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchLearningModules();
      fetchLocationsConfig();
      fetchTestimonials();
      fetchBrandingConfig();
    }
  }, [isLoggedIn]);

  const testDatabaseConnection = async () => {
    setIsTestingDb(true);
    setDbTestResult(null);
    try {
      const response = await fetch("/api/test-db");
      const result = await response.json();
      setDbTestResult(result);
    } catch (err: any) {
      console.error("Error testing connection:", err);
      setDbTestResult({
        configured: true,
        success: false,
        message: "Não foi possível contactar o servidor para testar a conexão com o banco de dados.",
        error: err.message || "Erro de rede"
      });
    } finally {
      setIsTestingDb(false);
    }
  };

  // Check session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (savedToken) {
      setPassword(savedToken);
      setIsLoggedIn(true);
      fetchRegistrations(savedToken);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setLoginError("Por favor, digite a senha.");
      return;
    }

    setIsLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsLoggedIn(true);
        localStorage.setItem("admin_token", password);
        fetchRegistrations(password);
      } else {
        setLoginError(data.message || "Senha incorreta.");
      }
    } catch (err) {
      console.error(err);
      setLoginError("Erro ao conectar ao servidor. Verifique o backend.");
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword("");
    localStorage.removeItem("admin_token");
    setRegistrations([]);
  };

  const fetchRegistrations = async (authPass = password) => {
    setIsLoadingList(true);
    setListError("");
    try {
      const res = await fetch(`/api/registrations?password=${encodeURIComponent(authPass)}`, {
        headers: {
          "x-admin-password": authPass
        }
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setRegistrations(data.data || []);
        setDbSource(data.source);
      } else {
        setListError(data.message || "Erro ao carregar dados do banco.");
        if (res.status === 401) {
          handleLogout();
        }
      }
    } catch (err: any) {
      console.error(err);
      setListError("Não foi possível conectar ao servidor para buscar registros.");
    } finally {
      setIsLoadingList(false);
    }
  };

  const handleDeleteRegistration = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/registrations/${deletingId}`, {
        method: "DELETE",
        headers: {
          "x-admin-password": password
        }
      });
      const data = await res.json();

      if (res.ok && data.success) {
        // Remove from local list
        setRegistrations(prev => prev.filter(r => r.id !== deletingId));
        setDeletingId(null);
      } else {
        alert(data.message || "Erro ao excluir o registro.");
      }
    } catch (err: any) {
      console.error(err);
      alert("Erro de conexão ao excluir o registro.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return isoString;
    }
  };

  const handleWhatsAppContact = (reg: Registration) => {
    const locName = reg.location === "sicchierolli" ? "Escola Sicchierolli" : "FATEC Franca";
    const firstName = reg.name.trim().split(" ")[0];
    const message = encodeURIComponent(
      `Olá ${firstName}! Aqui é o Alexandre Malta. Vi que você se cadastrou para o nosso curso presencial "Processos Ágeis com IA" na ${locName}. Seja muito bem-vindo(a)! Como estão as suas expectativas para as aulas?`
    );
    // Clean phone number: keep only numbers
    const cleanPhone = reg.whatsapp.replace(/\D/g, "");
    // Add country code 55 if not present
    const phoneWithCountry = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
    window.open(`https://wa.me/${phoneWithCountry}?text=${message}`, "_blank");
  };

  const exportToCSV = () => {
    if (filteredRegistrations.length === 0) {
      alert("Nenhum registro filtrado para exportar.");
      return;
    }

    const headers = ["ID", "Data Cadastro", "Nome", "CPF", "E-mail", "WhatsApp", "Cargo", "Local", "Termos Aceitos"];
    const rows = filteredRegistrations.map(reg => [
      reg.id,
      formatDate(reg.created_at),
      `"${reg.name.replace(/"/g, '""')}"`,
      `"${(reg.cpf || '').replace(/"/g, '""')}"`,
      `"${reg.email.replace(/"/g, '""')}"`,
      `"${reg.whatsapp.replace(/"/g, '""')}"`,
      `"${(reg.role || '').replace(/"/g, '""')}"`,
      reg.location === "sicchierolli" ? "Escola Sicchierolli" : "FATEC Franca",
      reg.agree ? "Sim" : "Não"
    ]);
    
    // Add UTF-8 BOM so Excel opens accented characters correctly
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `inscritos_curso_ia_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Extract all unique roles present in database
  const availableRoles = Array.from(
    new Set(registrations.map(r => r.role?.trim()).filter(Boolean))
  ) as string[];

  // Filtering Logic
  const filteredRegistrations = registrations.filter(reg => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      reg.name.toLowerCase().includes(query) ||
      reg.email.toLowerCase().includes(query) ||
      reg.whatsapp.includes(query) ||
      (reg.cpf && reg.cpf.toLowerCase().includes(query));

    const matchesLocation = 
      locationFilter === "all" || reg.location === locationFilter;

    const matchesRole = 
      roleFilter === "all" || (reg.role && reg.role.trim() === roleFilter);

    return matchesSearch && matchesLocation && matchesRole;
  });

  // Calculate metrics
  const totalCount = registrations.length;
  const sicchierolliCount = registrations.filter(r => r.location === "sicchierolli").length;
  const fatecCount = registrations.filter(r => r.location === "fatec").length;
  const withRoleCount = registrations.filter(r => r.role && r.role.trim() !== "").length;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white font-sans flex items-center justify-center px-4 relative overflow-hidden">
        {/* Glow Background Elements */}
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-lime-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-md w-full relative z-10">
          {/* Back button */}
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white mb-8 group transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Voltar para o Site</span>
          </button>

          {/* Login Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black/50"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-lime-400 to-cyan-400 p-[1px] mx-auto mb-6">
              <div className="w-full h-full bg-neutral-950 rounded-2xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-lime-400" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-xl font-bold tracking-tight uppercase">Área Administrativa</h2>
              <p className="text-xs text-neutral-400 mt-2 font-light leading-relaxed">
                Acesso restrito para consulta aos dados das pessoas cadastradas no curso.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase block mb-2">
                  Senha de Acesso
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha administrativa"
                  className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-3.5 px-4 text-xs text-white focus:outline-none transition-all font-mono"
                  disabled={isLoginLoading}
                  autoFocus
                />
              </div>

              {loginError && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoginLoading}
                className="w-full bg-gradient-to-r from-lime-400 to-lime-500 text-neutral-950 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 disabled:brightness-75 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoginLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verificando...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar no Painel</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans relative pb-24 selection:bg-lime-400 selection:text-neutral-950">
      
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lime-500/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Top Admin Header */}
      <nav className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            {/* Back Arrow */}
            <button 
              onClick={onBack}
              title="Voltar para o site institucional"
              className="w-10 h-10 rounded-xl border border-white/10 hover:border-lime-400/30 flex items-center justify-center text-neutral-400 hover:text-white transition-all hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-widest text-white uppercase">PAINEL ADMINISTRATIVO</span>
              <span className="text-[10px] text-lime-400 font-bold tracking-wider uppercase font-mono flex items-center gap-1.5 mt-0.5">
                <Database className="w-3.5 h-3.5" />
                <span>Gestão de Leads • Curso IA</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Supabase status badge */}
            {dbSource === "supabase" ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-[10px] font-mono uppercase tracking-widest">
                <Database className="w-3.5 h-3.5" />
                <span>Supabase Conectado</span>
              </span>
            ) : dbSource === "in_memory" ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-mono uppercase tracking-widest" title="Cadastros persistidos temporariamente em memória. Configure a SUPABASE_URL nos segredos para persistência permanente.">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Modo de Memória (Fallback)</span>
              </span>
            ) : null}

            {/* Refresh list button */}
            <button 
              onClick={() => fetchRegistrations()}
              disabled={isLoadingList}
              title="Atualizar lista"
              className="p-2.5 rounded-xl border border-white/10 hover:border-lime-400/30 bg-neutral-900/50 hover:bg-neutral-900 text-neutral-400 hover:text-white transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingList ? "animate-spin" : ""}`} />
            </button>

            {/* Logout button */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-850 border border-white/10 hover:border-red-500/30 hover:text-red-400 text-neutral-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>

        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-10 relative z-10 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-white/5 gap-6">
          <button
            onClick={() => setActiveTab("leads")}
            className={`pb-4 text-sm font-black uppercase tracking-wider transition-all relative cursor-pointer ${
              activeTab === "leads" 
                ? "text-lime-400" 
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <span>Inscrições (Leads)</span>
            {activeTab === "leads" && (
              <motion.div 
                layoutId="activeTabUnderline" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-400"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("modules")}
            className={`pb-4 text-sm font-black uppercase tracking-wider transition-all relative cursor-pointer ${
              activeTab === "modules" 
                ? "text-lime-400" 
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <span>Grade de Aprendizado (Módulos)</span>
            {activeTab === "modules" && (
              <motion.div 
                layoutId="activeTabUnderline" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-400"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("locations")}
            className={`pb-4 text-sm font-black uppercase tracking-wider transition-all relative cursor-pointer ${
              activeTab === "locations" 
                ? "text-lime-400" 
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <span>Turmas & Locais</span>
            {activeTab === "locations" && (
              <motion.div 
                layoutId="activeTabUnderline" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-400"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("testimonials")}
            className={`pb-4 text-sm font-black uppercase tracking-wider transition-all relative cursor-pointer ${
              activeTab === "testimonials" 
                ? "text-lime-400" 
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <span>Depoimentos</span>
            {activeTab === "testimonials" && (
              <motion.div 
                layoutId="activeTabUnderline" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-400"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("branding")}
            className={`pb-4 text-sm font-black uppercase tracking-wider transition-all relative cursor-pointer ${
              activeTab === "branding" 
                ? "text-lime-400" 
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <span>Marca & Logo</span>
            {activeTab === "branding" && (
              <motion.div 
                layoutId="activeTabUnderline" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-400"
              />
            )}
          </button>
        </div>

        {activeTab === "leads" && (
          <>
            {/* Error notification if couldn't load registrations */}
            {listError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Falha na consulta</p>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{listError}</p>
                </div>
              </div>
            )}

            {/* Dynamic Metric bento grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 01: Total */}
              <div className="bg-neutral-900/40 border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-lime-500/5 rounded-full blur-[40px] pointer-events-none" />
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase font-bold">TOTAL DE INSCRITOS</span>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-4xl md:text-5xl font-black text-white tracking-tight">{totalCount}</span>
                  <span className="text-xs text-lime-400 font-mono">cadastros</span>
                </div>
                <p className="text-[10px] text-neutral-400 mt-3 font-light">Todas as turmas e locais compilados.</p>
              </div>

              {/* Card 02: Escola Sicchierolli */}
              <div className="bg-neutral-900/40 border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-lime-500/5 rounded-full blur-[40px] pointer-events-none" />
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase font-bold">ESCOLA SICCHIEROLLI (NOITE)</span>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-4xl md:text-5xl font-black text-lime-400 tracking-tight">{sicchierolliCount}</span>
                  <span className="text-xs text-neutral-400 font-mono">
                    {totalCount > 0 ? `${Math.round((sicchierolliCount / totalCount) * 100)}%` : "0%"}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 mt-3 font-light">Inscrições para a turma noturna.</p>
              </div>

              {/* Card 03: FATEC */}
              <div className="bg-neutral-900/40 border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-cyan-500/5 rounded-full blur-[40px] pointer-events-none" />
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase font-bold">FATEC FRANCA (TARDE)</span>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-4xl md:text-5xl font-black text-cyan-400 tracking-tight">{fatecCount}</span>
                  <span className="text-xs text-neutral-400 font-mono">
                    {totalCount > 0 ? `${Math.round((fatecCount / totalCount) * 100)}%` : "0%"}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 mt-3 font-light">Inscrições para a turma vespertina.</p>
              </div>

              {/* Card 04: Engajamento / Cargos */}
              <div className="bg-neutral-900/40 border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-amber-500/5 rounded-full blur-[40px] pointer-events-none" />
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase font-bold">DADOS PROFISSIONAIS</span>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-4xl md:text-5xl font-black text-amber-400 tracking-tight">{withRoleCount}</span>
                  <span className="text-xs text-neutral-400 font-mono">
                    {totalCount > 0 ? `${Math.round((withRoleCount / totalCount) * 100)}%` : "0%"}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 mt-3 font-light">Inscritos que informaram cargo / profissão.</p>
              </div>
            </div>

            {/* Filter and Actions Bar */}
            <div className="p-6 bg-neutral-900/30 border border-white/5 rounded-3xl space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-4 font-sans">
              {/* Left Side: Inputs and Selects */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nome, email, fone..."
                    className="w-full bg-neutral-950 border border-white/5 hover:border-white/10 focus:border-lime-400 rounded-2xl py-3 pl-11 pr-4 text-xs text-white focus:outline-none transition-all"
                  />
                </div>

                {/* Location Select */}
                <div>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/5 hover:border-white/10 focus:border-lime-400 rounded-2xl py-3 px-4 text-xs text-neutral-300 focus:outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="all">📍 Todas as Turmas / Locais</option>
                    <option value="sicchierolli">Sicchierolli (Noite)</option>
                    <option value="fatec">FATEC Franca (Tarde)</option>
                  </select>
                </div>

                {/* Role Select */}
                <div>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/5 hover:border-white/10 focus:border-lime-400 rounded-2xl py-3 px-4 text-xs text-neutral-300 focus:outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="all">💼 Todos os Cargos</option>
                    {availableRoles.map((role, idx) => (
                      <option key={idx} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right Side: Actions (CSV Export) */}
              <div className="flex gap-3 shrink-0">
                {searchQuery || locationFilter !== "all" || roleFilter !== "all" ? (
                  <button 
                    onClick={() => {
                      setSearchQuery("");
                      setLocationFilter("all");
                      setRoleFilter("all");
                    }}
                    className="px-4 py-3 rounded-2xl border border-white/10 hover:bg-white/5 text-xs font-bold text-neutral-400 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Limpar Filtros</span>
                  </button>
                ) : null}

                <button 
                  onClick={exportToCSV}
                  disabled={filteredRegistrations.length === 0}
                  className="bg-neutral-900 hover:bg-neutral-850 border border-white/10 hover:border-lime-400/30 text-white font-bold py-3 px-5 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
                >
                  <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                  <span>Exportar Planilha (CSV)</span>
                </button>
              </div>
            </div>

            {/* registrations Table Container */}
            <div className="bg-neutral-900/20 border border-white/5 rounded-[2rem] overflow-hidden font-sans">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-neutral-900/30 text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-bold">
                      <th className="py-5 px-6">Inscrito</th>
                      <th className="py-5 px-6">Contato / CPF</th>
                      <th className="py-5 px-6">Cargo / Profissão</th>
                      <th className="py-5 px-6">Local / Turma</th>
                      <th className="py-5 px-6">Comprovante de Endereço</th>
                      <th className="py-5 px-6">Data Cadastro</th>
                      <th className="py-5 px-6 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {isLoadingList ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="py-5 px-6">
                            <div className="h-4 bg-white/5 rounded-md w-32 mb-2" />
                            <div className="h-3 bg-white/5 rounded-md w-20" />
                          </td>
                          <td className="py-5 px-6">
                            <div className="h-3 bg-white/5 rounded-md w-36 mb-2" />
                            <div className="h-3 bg-white/5 rounded-md w-28" />
                          </td>
                          <td className="py-5 px-6">
                            <div className="h-4 bg-white/5 rounded-md w-24" />
                          </td>
                          <td className="py-5 px-6">
                            <div className="h-4 bg-white/5 rounded-md w-28" />
                          </td>
                          <td className="py-5 px-6">
                            <div className="h-6 bg-white/5 rounded-lg w-24" />
                          </td>
                          <td className="py-5 px-6">
                            <div className="h-3 bg-white/5 rounded-md w-24" />
                          </td>
                          <td className="py-5 px-6 text-right">
                            <div className="h-8 bg-white/5 rounded-lg w-16 ml-auto" />
                          </td>
                        </tr>
                      ))
                    ) : filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-16 text-center text-neutral-500 font-light">
                          <div className="max-w-md mx-auto space-y-3">
                            <div className="w-12 h-12 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center mx-auto text-neutral-400">
                              <Search className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-bold text-neutral-300">Nenhum registro encontrado</p>
                            <p className="text-xs text-neutral-500">
                              {registrations.length === 0 
                                ? "Nenhuma pessoa se cadastrou para o curso ainda." 
                                : "Tente alterar os filtros de busca para encontrar o que procura."}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="py-5 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center font-bold text-neutral-400 uppercase text-[10px]">
                                {reg.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-white text-sm">{reg.name}</p>
                                <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">ID: {reg.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 px-6">
                            <div className="space-y-1">
                              <a href={`mailto:${reg.email}`} className="text-neutral-300 hover:text-lime-400 transition-colors flex items-center gap-1.5 font-light">
                                <Mail className="w-3.5 h-3.5 text-neutral-500" />
                                <span>{reg.email}</span>
                              </a>
                              <div className="text-neutral-300 flex items-center gap-1.5 font-light">
                                <Phone className="w-3.5 h-3.5 text-neutral-500" />
                                <span>{reg.whatsapp}</span>
                              </div>
                              {reg.cpf && (
                                <div className="text-[10px] text-neutral-500 font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 pt-0.5">
                                  <span className="px-1.5 py-0.5 bg-neutral-900 border border-white/5 rounded text-[9px]">CPF</span>
                                  <span>{reg.cpf}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-5 px-6">
                            {reg.role ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-neutral-300 text-xs font-medium">
                                <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
                                <span>{reg.role}</span>
                              </span>
                            ) : (
                              <span className="text-neutral-600 font-light italic">Não informado</span>
                            )}
                          </td>
                          <td className="py-5 px-6">
                            {reg.location === "sicchierolli" ? (
                              <div className="space-y-1">
                                <p className="font-bold text-white flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
                                  <span>Escola Sicchierolli</span>
                                </p>
                                <p className="text-[10px] text-neutral-400 font-mono">SEG/TER/QUA • 19h às 21h30</p>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <p className="font-bold text-white flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                  <span>FATEC Franca</span>
                                </p>
                                <p className="text-[10px] text-neutral-400 font-mono">QUA/QUI • 13h30 às 16h00</p>
                              </div>
                            )}
                          </td>
                          <td className="py-5 px-6">
                            {reg.address_proof ? (
                              <a
                                href={reg.address_proof}
                                download={`comprovante_${reg.name.toLowerCase().replace(/\s+/g, "_")}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-400/10 border border-lime-400/20 hover:border-lime-400 hover:bg-lime-400 text-lime-400 hover:text-neutral-950 text-[10px] font-bold uppercase tracking-wider transition-all"
                              >
                                {reg.address_proof.startsWith("data:application/pdf") ? (
                                  <FileText className="w-3.5 h-3.5" />
                                ) : (
                                  <ImageIcon className="w-3.5 h-3.5" />
                                )}
                                <span>Baixar Doc</span>
                              </a>
                            ) : (
                              <span className="text-neutral-600 font-light italic">Não enviado</span>
                            )}
                          </td>
                          <td className="py-5 px-6">
                            <div className="flex items-center gap-1.5 text-neutral-400 font-mono text-[11px]">
                              <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                              <span>{formatDate(reg.created_at)}</span>
                            </div>
                          </td>
                          <td className="py-5 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleWhatsAppContact(reg)}
                                title="Entrar em contato via WhatsApp"
                                className="p-2 bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500 hover:bg-emerald-500 text-emerald-400 hover:text-neutral-950 rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeletingId(reg.id)}
                                title="Excluir inscrição"
                                className="p-2 bg-red-500/10 border border-red-500/20 hover:border-red-500 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {!isLoadingList && filteredRegistrations.length > 0 && (
                <div className="py-4 px-6 bg-neutral-900/30 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                  <span>Exibindo {filteredRegistrations.length} de {totalCount} cadastros totais</span>
                  <span>Processos Ágeis com IA</span>
                </div>
              )}
            </div>

            {/* Supabase Connection Diagnostic Section - Moved to Admin Area */}
            <section className="py-6 border-t border-white/5 relative overflow-hidden mt-8">
              <div className="bg-neutral-900/60 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/5 rounded-full blur-3xl -z-10" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-lime-400 animate-pulse" />
                      <h4 className="text-sm font-black text-white uppercase tracking-wider font-mono">Status da Conexão Supabase</h4>
                    </div>
                    <p className="text-xs text-neutral-400 font-light max-w-md">
                      Verifique se o seu sistema está corretamente conectado ao Supabase para capturar os leads de forma permanente.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={testDatabaseConnection}
                    disabled={isTestingDb}
                    className="shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold font-mono uppercase tracking-wider border border-white/10 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${isTestingDb ? 'animate-spin text-lime-400' : 'text-neutral-400'}`} />
                    {isTestingDb ? 'Testando...' : 'Testar Conexão'}
                  </button>
                </div>

                {dbTestResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 pt-6 border-t border-white/5 space-y-4"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-xs font-mono text-neutral-400">Status:</div>
                      
                      {dbTestResult.configured ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-[10px] font-mono uppercase tracking-wider">
                          ● Configurado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-400/10 border border-red-400/20 text-red-400 text-[10px] font-mono uppercase tracking-wider">
                          ● Não Configurado
                        </span>
                      )}

                      {dbTestResult.configured && (
                        dbTestResult.success ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-[10px] font-mono uppercase tracking-wider">
                            ● Conectado com Sucesso
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-mono uppercase tracking-wider">
                            ● Erro de Conexão
                          </span>
                        )
                      )}
                    </div>

                    <div className="text-xs font-sans text-neutral-300 leading-relaxed bg-neutral-950/40 p-4 border border-white/5 rounded-2xl">
                      {dbTestResult.message}
                    </div>

                    {dbTestResult.error && (
                      <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl font-mono text-[11px] text-red-300/90 whitespace-pre-wrap">
                        Erro técnico: {dbTestResult.error}
                      </div>
                    )}

                    {dbTestResult.schemaHint && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">
                          <Server className="w-4 h-4 text-lime-400" />
                          Ação necessária no painel do Supabase
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-relaxed font-light">
                          Acesse a aba <strong>SQL Editor</strong> no painel do seu Supabase, crie uma nova query, cole o código abaixo e clique em <strong>Run</strong>:
                        </p>
                        <pre className="p-4 bg-neutral-950 border border-white/5 rounded-2xl text-[10px] font-mono text-neutral-300 overflow-x-auto whitespace-pre selection:bg-lime-500/30">
                          {dbTestResult.schemaHint}
                        </pre>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </section>
          </>
        )}

        {activeTab === "modules" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header of Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-neutral-900/30 border border-white/5 rounded-3xl p-6 md:p-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-lime-400" />
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider">Grade de Aprendizado</h3>
                </div>
                <p className="text-xs text-neutral-400 font-light max-w-2xl leading-relaxed">
                  Gerencie todo o cronograma e ementa do curso. Altere os textos (Módulos, Títulos, Descrições) e as imagens dos cards que aparecem na landing page.
                </p>
              </div>
              <button
                onClick={fetchLearningModules}
                disabled={isLoadingModules}
                className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold font-mono uppercase tracking-wider border border-white/10 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingModules ? "animate-spin text-lime-400" : "text-neutral-400"}`} />
                Recarregar Módulos
              </button>
            </div>

            {modulesError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{modulesError}</span>
              </div>
            )}

            {isLoadingModules ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="bg-[#0b0f19]/40 border border-white/5 rounded-[2rem] p-6 h-80 animate-pulse space-y-4">
                    <div className="h-32 bg-white/5 rounded-2xl w-full" />
                    <div className="h-4 bg-white/5 rounded w-1/3" />
                    <div className="h-6 bg-white/5 rounded w-3/4" />
                    <div className="h-12 bg-white/5 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {learningModules.map((mod: any) => {
                  const displayImage = imageMap[mod.image] || mod.image;
                  return (
                    <div
                      key={mod.id}
                      className="bg-[#0b0f19]/40 border border-white/5 hover:border-lime-400/20 rounded-[2rem] overflow-hidden flex flex-col h-full transition-all duration-300 relative group"
                    >
                      {/* Thumbnail Image */}
                      <div className="relative aspect-[16/10] bg-neutral-950 overflow-hidden">
                        {displayImage ? (
                          <img
                            src={displayImage}
                            alt={mod.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-600 font-mono text-xs">
                            Sem Imagem
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-lime-400 text-neutral-950 text-[9px] font-black uppercase tracking-wider font-mono">
                            {mod.badge}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h4 className="text-base font-bold text-white tracking-tight leading-snug line-clamp-2">
                            {mod.title}
                          </h4>
                          <p className="text-xs text-neutral-400 font-light leading-relaxed line-clamp-3">
                            {mod.desc}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleEditModuleClick(mod)}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neutral-800 hover:bg-lime-400 hover:text-neutral-950 text-neutral-300 text-xs font-black uppercase tracking-widest transition-all duration-200 active:scale-95 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar Card</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "locations" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header of Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-neutral-900/30 border border-white/5 rounded-3xl p-6 md:p-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-lime-400" />
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider">Turmas e Locais</h3>
                </div>
                <p className="text-xs text-neutral-400 font-light max-w-2xl leading-relaxed">
                  Gerencie todas as turmas e locais presenciais. Altere livremente as etiquetas, títulos, datas, horários, endereços, textos de investimento e o botão de inscrição de cada card.
                </p>
              </div>
              <button
                type="button"
                onClick={fetchLocationsConfig}
                disabled={isLoadingLocations}
                className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold font-mono uppercase tracking-wider border border-white/10 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingLocations ? "animate-spin text-lime-400" : "text-neutral-400"}`} />
                Recarregar Configurações
              </button>
            </div>

            {locationsError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{locationsError}</span>
              </div>
            )}

            {isLoadingLocations ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div key={idx} className="bg-[#0b0f19]/40 border border-white/5 rounded-[2rem] p-8 h-[500px] animate-pulse space-y-4" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {locations.map((loc: any) => (
                  <div 
                    key={loc.id} 
                    className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border bg-gradient-to-b from-neutral-900 to-neutral-950 border-white/5 shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-[10px] font-black uppercase tracking-widest">
                          {loc.badge}
                        </div>
                      </div>

                      <h3 className="text-xl md:text-2xl font-serif text-white font-light mb-4">
                        {loc.title}
                      </h3>

                      <div className="space-y-4 text-sm mb-8 font-light">
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider">{loc.datesTitle}</p>
                            <p className="font-bold text-white">{loc.dates}</p>
                            <p className="text-xs text-neutral-400 font-sans">{loc.datesSub}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider">{loc.hoursTitle}</p>
                            <p className="font-bold text-white">{loc.hours}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider">{loc.addressTitle}</p>
                            <p className="font-bold text-white">{loc.address}</p>
                            <p className="text-xs text-neutral-400 font-sans">{loc.addressSub}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Award className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider">{loc.investmentTitle}</p>
                            <p className="font-bold text-lime-400">{loc.investment}</p>
                            <p className="text-xs text-neutral-400 font-sans">{loc.investmentSub}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-center py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-neutral-900 border border-white/10 text-white/50 select-none">
                        {loc.buttonText}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleEditLocationClick(loc)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-lime-400 text-neutral-950 hover:bg-lime-300 font-black text-xs uppercase tracking-widest transition-all duration-200 active:scale-95 cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Editar Campos do Card</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "testimonials" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header of Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-neutral-900/30 border border-white/5 rounded-3xl p-6 md:p-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-lime-400" />
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider">Depoimentos dos Alunos</h3>
                </div>
                <p className="text-xs text-neutral-400 font-light max-w-2xl leading-relaxed">
                  Gerencie todos os depoimentos de ex-alunos que aparecem na landing page. Altere textos do cabeçalho da seção, crie novos depoimentos, carregue fotos, adicione notas, e configure vídeos (fazendo upload ou inserindo links de vídeo).
                </p>
              </div>
              <button
                type="button"
                onClick={fetchTestimonials}
                disabled={isLoadingTestimonials}
                className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold font-mono uppercase tracking-wider border border-white/10 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingTestimonials ? "animate-spin text-lime-400" : "text-neutral-400"}`} />
                Recarregar Depoimentos
              </button>
            </div>

            {testimonialsError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Erro de Carregamento</p>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{testimonialsError}</p>
                </div>
              </div>
            )}

            {isLoadingTestimonials ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <RefreshCw className="w-8 h-8 text-lime-400 animate-spin" />
                <p className="text-sm text-neutral-400 font-mono">Buscando depoimentos...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Panel: Section Title Customization */}
                <div className="lg:col-span-4 bg-neutral-900/50 border border-white/5 rounded-3xl p-6 space-y-6 h-fit">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Cabeçalho da Seção</h4>
                    <p className="text-[11px] text-neutral-400">Edite as informações gerais da seção de depoimentos.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase block mb-1">
                        Etiqueta Superior (Badge)
                      </label>
                      <input
                        type="text"
                        value={tempTestimonialSecBadge}
                        onChange={(e) => setTempTestimonialSecBadge(e.target.value)}
                        placeholder="Ex: DEPOIMENTOS"
                        className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-3 px-4 text-xs text-white focus:outline-none transition-all font-sans"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase block mb-1">
                        Título Principal da Seção
                      </label>
                      <input
                        type="text"
                        value={tempTestimonialSecTitle}
                        onChange={(e) => setTempTestimonialSecTitle(e.target.value)}
                        placeholder="Ex: O Que Dizem Nossos Alunos"
                        className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-3 px-4 text-xs text-white focus:outline-none transition-all font-sans"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase block mb-1">
                        Descrição da Seção
                      </label>
                      <textarea
                        value={tempTestimonialSecDesc}
                        onChange={(e) => setTempTestimonialSecDesc(e.target.value)}
                        placeholder="Texto de descrição curto da seção..."
                        rows={4}
                        className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-3 px-4 text-xs text-white focus:outline-none transition-all font-sans resize-none leading-relaxed"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveSectionSettings}
                      disabled={isSavingTestimonials}
                      className="w-full bg-lime-400 hover:bg-lime-300 text-neutral-950 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      {isSavingTestimonials ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Salvando...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Salvar Configurações</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Right Panel: Testimonial Cards List */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      Lista de Depoimentos ({testimonialsData?.items?.length || 0})
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddNewTestimonialClick}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-300 hover:to-lime-400 text-neutral-950 rounded-xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Adicionar Depoimento</span>
                    </button>
                  </div>

                  {(!testimonialsData?.items || testimonialsData.items.length === 0) ? (
                    <div className="border border-dashed border-white/10 rounded-3xl p-12 text-center space-y-3">
                      <MessageSquare className="w-8 h-8 text-neutral-600 mx-auto" />
                      <p className="text-sm text-neutral-400">Nenhum depoimento cadastrado.</p>
                      <p className="text-xs text-neutral-500">Clique em "Adicionar Depoimento" para começar.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {testimonialsData.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-neutral-900/30 border border-white/5 rounded-3xl p-6 flex flex-col justify-between hover:border-lime-400/20 transition-all group"
                        >
                          <div className="space-y-4">
                            {/* Stars and rating */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-yellow-500">
                                {Array.from({ length: item.rating || 5 }).map((_, s) => (
                                  <svg key={s} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                  </svg>
                                ))}
                              </div>
                              {item.videoUrl && (
                                <span className="text-[9px] font-mono font-bold tracking-widest text-lime-400 bg-lime-400/10 px-2 py-0.5 rounded uppercase border border-lime-400/20">
                                  Vídeo Incluído
                                </span>
                              )}
                            </div>

                            {/* Quote highlight */}
                            {item.highlight && (
                              <p className="text-xs font-bold text-white line-clamp-1">
                                "{item.highlight}"
                              </p>
                            )}

                            {/* Quote body */}
                            <p className="text-xs text-neutral-400 leading-relaxed font-light line-clamp-4">
                              {item.quote}
                            </p>
                          </div>

                          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 animate-fadeIn">
                              <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden shrink-0 bg-neutral-950 flex items-center justify-center text-xs font-bold text-lime-400 uppercase font-mono">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-all"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  item.name ? item.name.substring(0, 2) : "D"
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-white truncate">{item.name}</p>
                                <p className="text-[10px] text-neutral-400 truncate font-light mt-0.5">{item.role}</p>
                              </div>
                            </div>

                            {/* Item action controls */}
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleEditTestimonialClick(item, idx)}
                                title="Editar Depoimento"
                                className="p-2 bg-neutral-800 hover:bg-lime-400 hover:text-neutral-950 text-neutral-300 rounded-lg transition-all cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteTestimonial(idx)}
                                title="Excluir Depoimento"
                                className="p-2 bg-neutral-800 hover:bg-red-500 text-neutral-300 hover:text-white rounded-lg transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "branding" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header of Section */}
            <div className="bg-neutral-900/30 border border-white/5 rounded-3xl p-6 md:p-8 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-lime-400 font-bold tracking-wider uppercase font-mono">Identidade Visual & Logo</span>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Configurações de Marca</h2>
                <p className="text-xs text-neutral-400 max-w-2xl font-light leading-relaxed">
                  Gerencie a logomarca exibida no topo e no rodapé do site institucional. Você pode optar por exibir a logo vetorial padrão (SVG) ou fazer o upload de uma imagem customizada (PNG/JPG/Base64), além de personalizar o nome principal do mentor e subtexto.
                </p>
              </div>
            </div>

            {/* Config Fields Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Form Fields */}
              <div className="lg:col-span-7 bg-neutral-900/40 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
                
                {/* Branding Text Fields */}
                <div className="space-y-4">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-lime-400 uppercase block">Texto e Nome da Marca</span>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase block">Nome Principal (Mentor / Empresa)</label>
                    <input 
                      type="text"
                      value={tempLogoText}
                      onChange={(e) => setTempLogoText(e.target.value)}
                      placeholder="Ex: ALEXANDRE MALTA"
                      className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-2xl py-3.5 px-4 text-xs text-white focus:outline-none transition-all font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase block">Subtítulo / Especialidade</label>
                    <input 
                      type="text"
                      value={tempLogoSubtext}
                      onChange={(e) => setTempLogoSubtext(e.target.value)}
                      placeholder="Ex: Processos Ágeis com IA"
                      className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-2xl py-3.5 px-4 text-xs text-white focus:outline-none transition-all font-sans"
                    />
                  </div>
                </div>

                <hr className="border-white/5" />

                {/* Logo Selection Section */}
                <div className="space-y-4">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-lime-400 uppercase block">Tipo de Logotipo</span>
                  
                  {/* Select Logo Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setTempLogoType("svg")}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        tempLogoType === "svg"
                          ? "bg-lime-400/5 border-lime-400 text-white"
                          : "bg-neutral-950 border-white/5 text-neutral-400 hover:text-white"
                      }`}
                    >
                      <span className="text-xs font-black block uppercase tracking-wider mb-1">Logo Padrão (SVG)</span>
                      <span className="text-[10px] font-light leading-relaxed block text-neutral-500">
                        Usa o logotipo oficial vetorial de alta resolução com as cores azul e dourada.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTempLogoType("image")}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        tempLogoType === "image"
                          ? "bg-lime-400/5 border-lime-400 text-white"
                          : "bg-neutral-950 border-white/5 text-neutral-400 hover:text-white"
                      }`}
                    >
                      <span className="text-xs font-black block uppercase tracking-wider mb-1">Imagem Customizada</span>
                      <span className="text-[10px] font-light leading-relaxed block text-neutral-500">
                        Permite que você envie sua própria imagem ou especifique a URL de uma logomarca própria.
                      </span>
                    </button>
                  </div>

                  {/* Logo Image Fields (visible if logoType is 'image') */}
                  {tempLogoType === "image" && (
                    <div className="p-4 bg-neutral-950/50 border border-white/5 rounded-2xl space-y-4 animate-fadeIn">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase block">Enviar Imagem do Logotipo</label>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 border border-white/10 hover:border-lime-400/40 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
                            <Upload className="w-4 h-4 text-lime-400" />
                            <span>{isUploadingLogoImage ? "Processando..." : "Selecionar Logo"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoImageUpload}
                              disabled={isUploadingLogoImage}
                              className="hidden"
                            />
                          </label>
                          {tempLogoUrl && (
                            <span className="text-[10px] text-neutral-500 truncate max-w-xs">Imagem carregada e pronta</span>
                          )}
                        </div>
                        {logoImageUploadError && (
                          <p className="text-[10px] text-red-400 mt-1">{logoImageUploadError}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase block">Ou informe a URL da Imagem</label>
                        <input 
                          type="text"
                          value={tempLogoUrl}
                          onChange={(e) => setTempLogoUrl(e.target.value)}
                          placeholder="https://sua-url-de-logo.com/logo.png"
                          className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none transition-all font-sans"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveBranding}
                    disabled={isSavingBranding || isUploadingLogoImage}
                    className="bg-gradient-to-r from-lime-400 to-cyan-500 text-neutral-950 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md shadow-lime-500/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    {isSavingBranding ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Salvando Configurações...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Salvar Alterações de Marca</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Right Column: Interactive Real-time Preview */}
              <div className="lg:col-span-5 bg-neutral-900/20 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-500 uppercase block">Visualização em Tempo Real</span>
                  
                  {/* Header/Navbar Preview Area */}
                  <div className="p-4 bg-neutral-950/60 border border-white/5 rounded-2xl space-y-2">
                    <span className="text-[9px] font-mono text-neutral-600 block">Pré-visualização do Topo (Navbar)</span>
                    <div className="h-16 flex items-center justify-between border-t border-b border-white/5 px-2 bg-neutral-900/20">
                      <div className="flex items-center gap-2">
                        {/* Logo rendering mockup */}
                        {tempLogoType === "image" && tempLogoUrl ? (
                          <img 
                            src={tempLogoUrl} 
                            className="w-8 h-8 rounded-lg object-contain bg-neutral-800 animate-fadeIn" 
                            alt="Logo preview" 
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <svg 
                            viewBox="0 0 100 100" 
                            className="w-8 h-8 rounded-lg overflow-hidden shadow-md" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="50" cy="50" r="48" fill="#FFFFFF" />
                            <g transform="translate(50, 50) scale(0.82) translate(-50, -50)">
                              <path d="M 50 6 C 25.7 6 6 25.7 6 50 C 6 65.5 14 79.1 26.2 87.2 C 14.5 65.5 25.2 40.5 47.8 20.2 C 48.5 19.6 49.3 19 50 18.4 C 50 14.3 50 10.1 50 6 Z" fill="#0F3F8C" />
                              <circle cx="54" cy="48" r="6.5" fill="#FFFFFF" />
                              <path d="M 6.5 42 C 15 41.5 27 46 39.5 51 C 46 53.6 51 56 53.5 58 C 48.5 57.5 39.5 52.5 25 47 C 14.5 43 6.5 42 6.5 42 Z" fill="#FFFFFF" />
                              <path d="M 52.5 57.5 C 49.5 54 41 49 28 44 C 33 46 40.5 50.5 47 55.5 C 50 58 52.5 61 52.5 61 Z" fill="#FFFFFF" />
                              <path d="M 75.5 30.5 C 84.5 41.5 87.5 56.5 82.5 69.5 C 80.5 74 77.5 78 74 81.5 C 68.5 75 64 67.5 62.5 59 C 61 50.5 68 38 75.5 30.5 Z" fill="#C59C27" />
                              <path d="M 44.5 87 C 47.5 88 53.5 88.5 58 85.5 C 62 83 65.5 79 68.5 74.5 C 63 77.5 55.5 79.5 49 81 C 46.5 81.8 45 84.5 44.5 87 Z" fill="#C59C27" />
                              <path d="M 21.5 91 C 23.5 89 29 82.5 36.5 73 C 48.5 57 60 41 72.5 31.5 C 74 30.5 75.5 31.5 74.5 32.5 C 62.5 43 50.5 60.5 39 76 C 31 87.5 24 92 21.5 91 Z" fill="#FFFFFF" />
                            </g>
                          </svg>
                        )}
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black tracking-wider text-white truncate max-w-[150px]">
                            {tempLogoText || "NOME DA MARCA"}
                          </span>
                          <span className="text-[8px] text-lime-400 font-bold tracking-wider uppercase font-mono truncate max-w-[150px]">
                            {tempLogoSubtext || "Subtítulo da Marca"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-10 h-4 bg-white/5 rounded" />
                        <div className="w-14 h-4 bg-lime-400/10 rounded" />
                      </div>
                    </div>
                  </div>

                  {/* Footer Preview Area */}
                  <div className="p-4 bg-neutral-950/60 border border-white/5 rounded-2xl space-y-2">
                    <span className="text-[9px] font-mono text-neutral-600 block">Pré-visualização do Rodapé</span>
                    <div className="p-4 bg-neutral-900/20 rounded-xl border border-white/5 space-y-2">
                      <div className="flex items-center gap-2">
                        {tempLogoType === "image" && tempLogoUrl ? (
                          <img 
                            src={tempLogoUrl} 
                            className="w-6 h-6 rounded object-contain bg-neutral-800" 
                            alt="Logo preview footer" 
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <svg 
                            viewBox="0 0 100 100" 
                            className="w-6 h-6 rounded overflow-hidden shadow-md" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="50" cy="50" r="48" fill="#FFFFFF" />
                            <g transform="translate(50, 50) scale(0.82) translate(-50, -50)">
                              <path d="M 50 6 C 25.7 6 6 25.7 6 50 C 6 65.5 14 79.1 26.2 87.2 C 14.5 65.5 25.2 40.5 47.8 20.2 C 48.5 19.6 49.3 19 50 18.4 C 50 14.3 50 10.1 50 6 Z" fill="#0F3F8C" />
                              <circle cx="54" cy="48" r="6.5" fill="#FFFFFF" />
                              <path d="M 6.5 42 C 15 41.5 27 46 39.5 51 C 46 53.6 51 56 53.5 58 C 48.5 57.5 39.5 52.5 25 47 C 14.5 43 6.5 42 6.5 42 Z" fill="#FFFFFF" />
                              <path d="M 52.5 57.5 C 49.5 54 41 49 28 44 C 33 46 40.5 50.5 47 55.5 C 50 58 52.5 61 52.5 61 Z" fill="#FFFFFF" />
                              <path d="M 75.5 30.5 C 84.5 41.5 87.5 56.5 82.5 69.5 C 80.5 74 77.5 78 74 81.5 C 68.5 75 64 67.5 62.5 59 C 61 50.5 68 38 75.5 30.5 Z" fill="#C59C27" />
                              <path d="M 44.5 87 C 47.5 88 53.5 88.5 58 85.5 C 62 83 65.5 79 68.5 74.5 C 63 77.5 55.5 79.5 49 81 C 46.5 81.8 45 84.5 44.5 87 Z" fill="#C59C27" />
                              <path d="M 21.5 91 C 23.5 89 29 82.5 36.5 73 C 48.5 57 60 41 72.5 31.5 C 74 30.5 75.5 31.5 74.5 32.5 C 62.5 43 50.5 60.5 39 76 C 31 87.5 24 92 21.5 91 Z" fill="#FFFFFF" />
                            </g>
                          </svg>
                        )}
                        <span className="text-[11px] font-black text-white uppercase tracking-wider">
                          {tempLogoText || "NOME DA MARCA"}
                        </span>
                      </div>
                      <p className="text-[8px] text-neutral-500 font-mono">CURSO PRESENCIAL • FRANCA/SP</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-lime-400/5 border border-lime-400/10 rounded-2xl">
                  <div className="flex gap-2 items-start text-[11px] text-neutral-400 leading-relaxed font-sans">
                    <Sparkles className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                    <span>
                      Dica: Para manter a consistência e a harmonia visual, prefira imagens de logotipo com fundo transparente (formato PNG) e que tenham boa legibilidade no tamanho de 32x32 pixels.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Testimonial Add/Edit Modal */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto py-10">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setEditingTestimonial(null)} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-neutral-900 border border-white/10 p-6 md:p-8 rounded-[2.5rem] max-w-xl w-full relative z-10 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setEditingTestimonial(null)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-lime-400" />
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                  {editingTestimonial.isNew ? "Adicionar Depoimento" : "Editar Depoimento"}
                </h3>
              </div>
              <p className="text-[11px] text-neutral-400 font-light">
                {editingTestimonial.isNew ? "Cadastre as informações do novo depoente." : "Modifique os detalhes do depoimento selecionado."}
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono font-bold tracking-widest text-neutral-500 uppercase block mb-1">
                    Nome do Aluno
                  </label>
                  <input
                    type="text"
                    value={tempTestimonialName}
                    onChange={(e) => setTempTestimonialName(e.target.value)}
                    placeholder="Ex: Alexandre Malta"
                    className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-3 px-4 text-xs text-white focus:outline-none transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold tracking-widest text-neutral-500 uppercase block mb-1">
                    Cargo / Atuação Profissional
                  </label>
                  <input
                    type="text"
                    value={tempTestimonialRole}
                    onChange={(e) => setTempTestimonialRole(e.target.value)}
                    placeholder="Ex: Diretor de Engenharia @ TechCorp"
                    className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-3 px-4 text-xs text-white focus:outline-none transition-all font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono font-bold tracking-widest text-neutral-500 uppercase block mb-1">
                    Avaliação (Estrelas)
                  </label>
                  <div className="flex items-center gap-1.5 py-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setTempTestimonialRating(star)}
                        className="p-1 text-yellow-500 hover:scale-115 transition-transform cursor-pointer"
                      >
                        <svg
                          className={`w-6 h-6 ${tempTestimonialRating >= star ? "fill-current" : "stroke-current fill-none"}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold tracking-widest text-neutral-500 uppercase block mb-1">
                    Frase de Destaque
                  </label>
                  <input
                    type="text"
                    value={tempTestimonialHighlight}
                    onChange={(e) => setTempTestimonialHighlight(e.target.value)}
                    placeholder="Ex: Curso transformador de carreira"
                    className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-3 px-4 text-xs text-white focus:outline-none transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold tracking-widest text-neutral-500 uppercase block mb-1">
                  Texto do Depoimento
                </label>
                <textarea
                  value={tempTestimonialQuote}
                  onChange={(e) => setTempTestimonialQuote(e.target.value)}
                  placeholder="Insira o texto completo do depoimento do aluno..."
                  rows={4}
                  className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-3 px-4 text-xs text-white focus:outline-none transition-all font-sans resize-none leading-relaxed"
                />
              </div>

              {/* Photo Upload Area */}
              <div className="border-t border-white/5 pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">
                    Foto do Aluno
                  </span>
                  {tempTestimonialImage && (
                    <button
                      type="button"
                      onClick={() => setTempTestimonialImage("")}
                      className="text-[10px] text-red-400 font-mono font-bold hover:underline cursor-pointer"
                    >
                      Remover Foto
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full border border-white/10 overflow-hidden bg-neutral-950 flex items-center justify-center text-neutral-600 font-mono text-lg shrink-0">
                    {tempTestimonialImage ? (
                      <img src={tempTestimonialImage} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      "?"
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={tempTestimonialImage}
                      onChange={(e) => setTempTestimonialImage(e.target.value)}
                      placeholder="Cole a URL de uma foto"
                      className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-2 px-3 text-xs text-white focus:outline-none transition-all font-mono"
                    />
                    <div className="relative border border-dashed border-white/10 hover:border-lime-400/40 rounded-xl p-3 transition-all bg-neutral-950/40 flex items-center justify-center gap-2 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleTestimonialImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <Upload className={`w-4 h-4 ${isUploadingTestimonialImage ? "animate-bounce text-lime-400" : "text-neutral-500"}`} />
                      <span className="text-[10px] text-neutral-400">
                        {isUploadingTestimonialImage ? "Processando imagem..." : "Ou faça upload do computador (Até 3MB)"}
                      </span>
                    </div>
                  </div>
                </div>
                {testimonialImageUploadError && (
                  <p className="text-[10px] text-red-400 font-mono">⚠️ {testimonialImageUploadError}</p>
                )}
              </div>

              {/* Video Configuration Area */}
              <div className="border-t border-white/5 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">
                    Vídeo do Depoimento (Opcional)
                  </span>
                  {tempTestimonialVideoUrl && (
                    <button
                      type="button"
                      onClick={() => setTempTestimonialVideoUrl("")}
                      className="text-[10px] text-red-400 font-mono font-bold hover:underline cursor-pointer"
                    >
                      Remover Vídeo
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={tempTestimonialVideoUrl}
                  onChange={(e) => setTempTestimonialVideoUrl(e.target.value)}
                  placeholder="Cole o link do vídeo (Ex: YouTube, Vimeo ou link direto .mp4)"
                  className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-3 px-4 text-xs text-white focus:outline-none transition-all font-sans"
                />

                <div className="relative border border-dashed border-white/10 hover:border-lime-400/40 rounded-xl p-3.5 transition-all bg-neutral-950/40 flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleTestimonialVideoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <Upload className={`w-4 h-4 ${isUploadingTestimonialVideo ? "animate-bounce text-lime-400" : "text-neutral-500"}`} />
                  <span className="text-[10px] text-neutral-400">
                    {isUploadingTestimonialVideo ? "Enviando arquivo de vídeo..." : "Ou carregue um vídeo curto do computador (Até 15MB)"}
                  </span>
                </div>
                {testimonialVideoUploadError && (
                  <p className="text-[10px] text-red-400 font-mono">⚠️ {testimonialVideoUploadError}</p>
                )}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex gap-3 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => setEditingTestimonial(null)}
                className="flex-1 px-4 py-3 rounded-xl border border-white/5 bg-neutral-850 hover:bg-neutral-800 text-xs font-bold text-white font-mono uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveTestimonialItem}
                disabled={isSavingTestimonials}
                className="flex-1 bg-gradient-to-r from-lime-400 to-lime-500 text-neutral-950 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 disabled:opacity-50 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSavingTestimonials ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Salvar Depoimento</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Learning Module Edit Modal */}
      {editingModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto py-10">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setEditingModule(null)} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-neutral-900 border border-white/10 p-6 md:p-8 rounded-[2.5rem] max-w-xl w-full relative z-10 shadow-2xl space-y-6"
          >
            <button
              onClick={() => setEditingModule(null)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-lime-400" />
              <h3 className="text-lg font-black font-sans uppercase tracking-wider text-white">
                Editar Card — {editingModule.badge}
              </h3>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
              {/* Badge Input */}
              <div>
                <label className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase block mb-1.5">
                  Etiqueta / Badge
                </label>
                <input
                  type="text"
                  value={tempBadge}
                  onChange={(e) => setTempBadge(e.target.value)}
                  placeholder="Ex: MÓDULO 1"
                  className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-3 px-4 text-xs text-white focus:outline-none transition-all font-sans"
                />
              </div>

              {/* Title Input */}
              <div>
                <label className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase block mb-1.5">
                  Título do Card
                </label>
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  placeholder="Digite o título do card"
                  className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-3 px-4 text-xs text-white focus:outline-none transition-all font-sans font-bold"
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase block mb-1.5">
                  Descrição / Conteúdo
                </label>
                <textarea
                  rows={4}
                  value={tempDesc}
                  onChange={(e) => setTempDesc(e.target.value)}
                  placeholder="Digite a descrição detalhada do módulo..."
                  className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-3 px-4 text-xs text-white focus:outline-none transition-all font-sans font-light leading-relaxed resize-none"
                />
              </div>

              {/* Image Section */}
              <div className="border-t border-white/5 pt-4 space-y-4">
                <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase block">
                  Gerenciamento da Imagem
                </span>

                {/* Preview */}
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-white/5 bg-neutral-950 flex items-center justify-center">
                  {tempImage ? (
                    <img
                      src={imageMap[tempImage] || tempImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-xs text-neutral-500 font-mono">Sem imagem selecionada</span>
                  )}
                </div>

                {/* URL Input */}
                <div>
                  <label className="text-[9px] font-mono font-bold tracking-widest text-neutral-500 uppercase block mb-1">
                    Opção 1: Endereço da Imagem (URL)
                  </label>
                  <input
                    type="text"
                    value={tempImage}
                    onChange={(e) => setTempImage(e.target.value)}
                    placeholder="Cole o link de uma imagem (Ex: Unsplash)"
                    className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-3 px-4 text-xs text-white focus:outline-none transition-all font-mono"
                  />
                </div>

                {/* Local Upload */}
                <div>
                  <label className="text-[9px] font-mono font-bold tracking-widest text-neutral-500 uppercase block mb-1">
                    Opção 2: Carregar imagem do Computador
                  </label>
                  <div className="relative border border-dashed border-white/10 hover:border-lime-400/40 rounded-xl p-4 transition-all bg-neutral-950/40 flex flex-col items-center justify-center gap-2 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <Upload className={`w-5 h-5 ${isUploadingImage ? 'animate-bounce text-lime-400' : 'text-neutral-500'}`} />
                    <span className="text-xs text-neutral-400">
                      {isUploadingImage ? "Processando imagem..." : "Clique ou arraste um arquivo aqui (Até 3MB)"}
                    </span>
                  </div>
                  {imageUploadError && (
                    <p className="text-[10px] text-red-400 mt-2 font-mono">⚠️ {imageUploadError}</p>
                  )}
                </div>

                {/* Preset Suggestions */}
                <div>
                  <span className="text-[9px] font-mono font-bold tracking-widest text-neutral-500 uppercase block mb-1.5">
                    Opção 3: Sugestões Premium de IA
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setTempImage(preset.url)}
                        title={preset.label}
                        className={`relative aspect-square rounded-xl overflow-hidden border transition-all ${
                          tempImage === preset.url ? 'border-lime-400 ring-1 ring-lime-400' : 'border-white/5 hover:border-white/20'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex gap-3 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => setEditingModule(null)}
                className="flex-1 px-4 py-3 rounded-xl border border-white/5 bg-neutral-850 hover:bg-neutral-800 text-xs font-bold text-white font-mono uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveModule}
                disabled={isSavingModules}
                className="flex-1 bg-gradient-to-r from-lime-400 to-lime-500 text-neutral-950 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 disabled:opacity-50 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSavingModules ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Salvar</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Location Edit Modal */}
      {editingLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto py-10">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setEditingLocation(null)} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-neutral-900 border border-white/10 p-6 md:p-8 rounded-[2.5rem] max-w-xl w-full relative z-10 shadow-2xl space-y-6"
          >
            <button
              onClick={() => setEditingLocation(null)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-lime-400" />
              <h3 className="text-lg font-black font-sans uppercase tracking-wider text-white">
                Editar Turma — {editingLocation.title}
              </h3>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
              {/* Badge & Title */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase block mb-1.5">
                    Etiqueta / Badge
                  </label>
                  <input
                    type="text"
                    value={tempLocBadge}
                    onChange={(e) => setTempLocBadge(e.target.value)}
                    placeholder="Ex: TURMA NOITE"
                    className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-3 px-4 text-xs text-white focus:outline-none transition-all font-sans"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase block mb-1.5">
                    Nome do Local
                  </label>
                  <input
                    type="text"
                    value={tempLocTitle}
                    onChange={(e) => setTempLocTitle(e.target.value)}
                    placeholder="Ex: Escola Sicchierolli"
                    className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-3 px-4 text-xs text-white focus:outline-none transition-all font-sans font-bold"
                  />
                </div>
              </div>

              {/* Dates section */}
              <div className="p-4 bg-neutral-950/40 rounded-2xl border border-white/5 space-y-3">
                <span className="text-[9px] font-mono font-bold text-lime-400 uppercase tracking-widest block">Seção de Datas</span>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="text-[9px] font-mono font-bold text-neutral-500 uppercase block mb-1">Título do Campo</label>
                    <input
                      type="text"
                      value={tempLocDatesTitle}
                      onChange={(e) => setTempLocDatesTitle(e.target.value)}
                      className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-2 px-3 text-[11px] text-white focus:outline-none transition-all font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[9px] font-mono font-bold text-neutral-500 uppercase block mb-1">Datas Ativas</label>
                    <input
                      type="text"
                      value={tempLocDates}
                      onChange={(e) => setTempLocDates(e.target.value)}
                      placeholder="Ex: De 13/07 à 05/08"
                      className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-2 px-3 text-[11px] text-white focus:outline-none transition-all font-sans"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-mono font-bold text-neutral-500 uppercase block mb-1">Frequência das Aulas (Subtítulo)</label>
                  <input
                    type="text"
                    value={tempLocDatesSub}
                    onChange={(e) => setTempLocDatesSub(e.target.value)}
                    placeholder="Ex: Aulas às Segundas, Terças e Quartas"
                    className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-2 px-3 text-[11px] text-white focus:outline-none transition-all font-sans"
                  />
                </div>
              </div>

              {/* Hours section */}
              <div className="p-4 bg-neutral-950/40 rounded-2xl border border-white/5 space-y-3">
                <span className="text-[9px] font-mono font-bold text-lime-400 uppercase tracking-widest block">Seção de Horários</span>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="text-[9px] font-mono font-bold text-neutral-500 uppercase block mb-1">Título do Campo</label>
                    <input
                      type="text"
                      value={tempLocHoursTitle}
                      onChange={(e) => setTempLocHoursTitle(e.target.value)}
                      className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-2 px-3 text-[11px] text-white focus:outline-none transition-all font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[9px] font-mono font-bold text-neutral-500 uppercase block mb-1">Horário das Aulas</label>
                    <input
                      type="text"
                      value={tempLocHours}
                      onChange={(e) => setTempLocHours(e.target.value)}
                      placeholder="Ex: 19h às 21h30"
                      className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-2 px-3 text-[11px] text-white focus:outline-none transition-all font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Address section */}
              <div className="p-4 bg-neutral-950/40 rounded-2xl border border-white/5 space-y-3">
                <span className="text-[9px] font-mono font-bold text-lime-400 uppercase tracking-widest block">Seção de Endereço</span>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="text-[9px] font-mono font-bold text-neutral-500 uppercase block mb-1">Título do Campo</label>
                    <input
                      type="text"
                      value={tempLocAddressTitle}
                      onChange={(e) => setTempLocAddressTitle(e.target.value)}
                      className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-2 px-3 text-[11px] text-white focus:outline-none transition-all font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[9px] font-mono font-bold text-neutral-500 uppercase block mb-1">Rua / Prédio (Principal)</label>
                    <input
                      type="text"
                      value={tempLocAddress}
                      onChange={(e) => setTempLocAddress(e.target.value)}
                      placeholder="Ex: Rua Prof. Laerte Barbosa Cintra, 929"
                      className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-2 px-3 text-[11px] text-white focus:outline-none transition-all font-sans"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-mono font-bold text-neutral-500 uppercase block mb-1">Bairro / Cidade (Subtítulo)</label>
                  <input
                    type="text"
                    value={tempLocAddressSub}
                    onChange={(e) => setTempLocAddressSub(e.target.value)}
                    placeholder="Ex: Residencial Baldassari — Franca/SP"
                    className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-2 px-3 text-[11px] text-white focus:outline-none transition-all font-sans"
                  />
                </div>
              </div>

              {/* Investment section */}
              <div className="p-4 bg-neutral-950/40 rounded-2xl border border-white/5 space-y-3">
                <span className="text-[9px] font-mono font-bold text-lime-400 uppercase tracking-widest block">Seção de Investimento</span>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="text-[9px] font-mono font-bold text-neutral-500 uppercase block mb-1">Título do Campo</label>
                    <input
                      type="text"
                      value={tempLocInvestmentTitle}
                      onChange={(e) => setTempLocInvestmentTitle(e.target.value)}
                      className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-2 px-3 text-[11px] text-white focus:outline-none transition-all font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[9px] font-mono font-bold text-neutral-500 uppercase block mb-1">Investimento</label>
                    <input
                      type="text"
                      value={tempLocInvestment}
                      onChange={(e) => setTempLocInvestment(e.target.value)}
                      placeholder="Ex: 100% Gratuito"
                      className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-2 px-3 text-[11px] text-white focus:outline-none transition-all font-sans"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-mono font-bold text-neutral-500 uppercase block mb-1">Vagas / Observação (Subtítulo)</label>
                  <input
                    type="text"
                    value={tempLocInvestmentSub}
                    onChange={(e) => setTempLocInvestmentSub(e.target.value)}
                    placeholder="Ex: Vagas estritamente limitadas!"
                    className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-2 px-3 text-[11px] text-white focus:outline-none transition-all font-sans"
                  />
                </div>
              </div>

              {/* Button Action text */}
              <div>
                <label className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase block mb-1.5">
                  Texto do Botão de Inscrição
                </label>
                <input
                  type="text"
                  value={tempLocButtonText}
                  onChange={(e) => setTempLocButtonText(e.target.value)}
                  placeholder="Ex: Selecionar & Inscrever nesta Turma"
                  className="w-full bg-neutral-950 border border-white/10 focus:border-lime-400 rounded-xl py-3 px-4 text-xs text-white focus:outline-none transition-all font-sans"
                />
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex gap-3 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => setEditingLocation(null)}
                className="flex-1 px-4 py-3 rounded-xl border border-white/5 bg-neutral-850 hover:bg-neutral-800 text-xs font-bold text-white font-mono uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveLocation}
                disabled={isSavingLocations}
                className="flex-1 bg-gradient-to-r from-lime-400 to-lime-500 text-neutral-950 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 disabled:opacity-50 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSavingLocations ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Salvar</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Deletion Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDeletingId(null)} />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-neutral-900 border border-red-500/30 p-8 rounded-[2.5rem] max-w-sm w-full relative z-10 text-center shadow-2xl shadow-red-500/5"
          >
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto mb-5">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-white mb-2">Excluir Inscrição?</h3>
            <p className="text-neutral-400 text-xs font-light leading-relaxed mb-6">
              Esta ação é irreversível. O cadastro desta pessoa será permanentemente apagado da base de dados.
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
                className="flex-1 border border-white/10 hover:bg-white/5 text-white py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDeleteRegistration}
                disabled={isDeleting}
                className="flex-1 bg-red-500 text-white hover:bg-red-600 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Excluindo...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Confirmar</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
