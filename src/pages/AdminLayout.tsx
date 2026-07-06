import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  LayoutDashboard, Users, Store, Activity, 
  Settings, LogOut, ShieldAlert, Search, 
  Bell, ChevronLeft, ChevronRight, Loader2
} from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Verificação de Segurança de Nível Super Admin
  useEffect(() => {
    async function checkAdminAccess() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      // Verifica na tabela user_roles se é super_admin
      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error || !roleData || roleData.role !== 'super_admin') {
        alert('Acesso Negado: Área restrita a Administradores.');
        navigate('/dashboard'); // Manda de volta pra área de cliente
        return;
      }

      setLoading(false);
    }
    
    checkAdminAccess();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Catálogos', path: '/admin/catalogos', icon: Store },
    { name: 'Usuários', path: '/admin/usuarios', icon: Users },
    { name: 'Logs e Atividade', path: '/admin/logs', icon: Activity },
    { name: 'Configurações', path: '/admin/config', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#007AFF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex overflow-hidden font-sans selection:bg-[#007AFF] selection:text-white">
      
      {/* Background Effects (Premium Glow) */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#007AFF]/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* SIDEBAR */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} flex-shrink-0 bg-[#0d1117]/80 backdrop-blur-xl border-r border-white/5 transition-all duration-300 flex flex-col relative z-20`}
      >
        <div className="h-16 flex items-center px-4 border-b border-white/5 justify-between">
          {isSidebarOpen && (
            <div className="flex items-center gap-2 overflow-hidden">
              <ShieldAlert className="w-5 h-5 text-[#007AFF]" />
              <span className="font-bold tracking-tight text-sm uppercase text-gray-200">Super Admin</span>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 transition-colors mx-auto"
          >
            {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-[#007AFF]/10 text-[#007AFF] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#007AFF] rounded-r-full" />}
                <Icon size={18} className={`flex-shrink-0 ${isActive ? 'text-[#007AFF]' : 'group-hover:text-gray-200'}`} />
                {isSidebarOpen && <span className="font-medium text-[13px]">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center ${isSidebarOpen ? 'justify-start px-3' : 'justify-center'} gap-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors`}
          >
            <LogOut size={18} />
            {isSidebarOpen && <span className="font-medium text-[13px]">Sair do Sistema</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* TOPBAR */}
        <header className="h-16 flex-shrink-0 bg-[#0d1117]/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Busca global (Catálogos, Usuários, Slugs)..." 
                className="w-full bg-[#161b22] border border-white/5 rounded-full pl-10 pr-4 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-[#007AFF]/50 focus:bg-[#0d1117] transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.6)]"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#007AFF] to-[#00f2fe] flex items-center justify-center font-bold text-[11px] shadow-lg border border-white/20">
              AD
            </div>
          </div>
        </header>

        {/* PAGE CONTENT (Dashboard) */}
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent">
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-100">Overview</h1>
            <p className="text-sm text-gray-400 mt-1">Métricas em tempo real da plataforma HyperKatalogo.</p>
          </div>

          {/* METRIC CARDS (Estilo Vercel/Linear) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard title="Catálogos Ativos" value="1,248" trend="+12% este mês" isPositive={true} icon={Store} color="#10B981" />
            <MetricCard title="Total de Usuários" value="842" trend="+5 hoje" isPositive={true} icon={Users} color="#007AFF" />
            <MetricCard title="Catálogos em Teste" value="45" trend="-2 expirando hoje" isPositive={false} icon={Activity} color="#f59e0b" />
            <MetricCard title="Receita Prevista (MRR)" value="R$ 0,00" trend="Sistema de pagamentos offline" isPositive={true} icon={LayoutDashboard} color="#8b5cf6" />
          </div>

          {/* ÁREA FUTURA PARA GRÁFICOS E TABELAS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 rounded-2xl bg-[#0d1117]/80 border border-white/5 p-6 flex flex-col">
              <h3 className="text-sm font-semibold text-gray-300 mb-4">Crescimento de Assinaturas</h3>
              <div className="flex-1 border border-dashed border-white/5 rounded-xl flex items-center justify-center">
                <span className="text-xs text-gray-500 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Carregando Gráfico...</span>
              </div>
            </div>
            
            <div className="h-96 rounded-2xl bg-[#0d1117]/80 border border-white/5 p-6 flex flex-col">
              <h3 className="text-sm font-semibold text-gray-300 mb-4">Últimas Atividades</h3>
              <div className="flex-1 overflow-hidden flex flex-col gap-4">
                 <ActivityItem text="Novo catálogo criado: Store Imports" time="Há 2 min" />
                 <ActivityItem text="Usuário João resetou a senha" time="Há 15 min" />
                 <ActivityItem text="Catálogo 'Tênis BR' bloqueado por inatividade" time="Há 1 hora" />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// Componentes Auxiliares
function MetricCard({ title, value, trend, isPositive, icon: Icon, color }: any) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0d1117]/60 backdrop-blur-sm border border-white/5 p-5 group hover:bg-[#0d1117] hover:border-white/10 transition-all duration-300">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: color }}></div>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</h3>
        <div className="p-2 rounded-lg bg-white/5 border border-white/5">
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black text-white tracking-tight">{value}</span>
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-xs font-medium">
        <span className={isPositive ? 'text-emerald-400' : 'text-amber-400'}>{trend}</span>
      </div>
    </div>
  );
}

function ActivityItem({ text, time }: { text: string, time: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-2 h-2 mt-1.5 rounded-full bg-[#007AFF] shadow-[0_0_8px_#007AFF]"></div>
      <div>
        <p className="text-sm text-gray-300">{text}</p>
        <span className="text-[11px] text-gray-500 font-medium">{time}</span>
      </div>
    </div>
  );
}