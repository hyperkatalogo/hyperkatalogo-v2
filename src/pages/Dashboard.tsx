import { useState, useRef, useEffect } from 'react';
import { Lock, CheckCircle2, Edit, ExternalLink, Store, Loader2, LogOut, Plus, Crown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const navigate = useNavigate();
  const [catalogos, setCatalogos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // SIMULAÇÃO DE COMPRAS
  const [unlockedEditor] = useState(false);
const [unlockedVideos] = useState(false);
const [unlockedArts] = useState(false);

  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function fetchCatalogos() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }
        const { data, error } = await supabase
          .from('catalogos')
          .select('*')
          .eq('user_id', user.id) 
          .order('id', { ascending: false });

        if (error) throw error;
        setCatalogos(data || []);
      } catch (error) {
        console.error("Erro ao carregar catálogos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCatalogos();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full bg-[#090b11] text-white antialiased p-4 md:p-8 flex flex-col items-center pb-20">
      
      <div className="w-full max-w-2xl flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-white/10 bg-black p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-full scale-110" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
          <h1 className="text-xl font-medium">HyperKatalogo</h1>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 transition-all text-sm">
          <LogOut size={16} /> Sair
        </button>
      </div>

      <div className="w-full max-w-2xl mx-auto mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Painel do Revendedor</h1>
        <p className="text-gray-400">Gerencie o seu catálogo e liberte materiais de alta conversão</p>
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-8">
        
        {/* A MINHA LOJA */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xl font-medium">A Minha Loja</h2>
          </div>

          {loading ? (
            <div className="bg-[#161b26] rounded-3xl p-10 border border-white/5 shadow-xl flex flex-col items-center justify-center gap-4">
              <Loader2 size={32} className="animate-spin text-[#007AFF]" />
              <p className="text-gray-400">A procurar o seu catálogo...</p>
            </div>
          ) : catalogos.length === 0 ? (
            <div className="bg-[#161b26] rounded-3xl p-8 border border-white/5 shadow-xl flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-20 h-20 rounded-full bg-[#0d1117] border border-white/10 flex items-center justify-center text-gray-500 mb-2">
                <Store size={36} />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Nenhum catálogo encontrado</h3>
                <p className="text-gray-400 text-sm max-w-sm mx-auto">Você ainda não criou a sua vitrine de produtos. Comece agora mesmo e venda mais!</p>
              </div>
              <Link to="/formulario" className="h-14 bg-[#007AFF] text-white font-semibold px-8 rounded-2xl flex items-center justify-center transition-all hover:bg-[#0066D6] hover:scale-105 active:scale-95 mt-4 gap-2 shadow-[0_0_20px_rgba(0,122,255,0.3)]">
                <Plus size={20} /> Criar Meu Catálogo Agora
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {catalogos.map(cat => (
                <div key={cat.id} className="bg-[#161b26] rounded-3xl p-5 md:p-6 border border-white/5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 hover:border-white/10 transition-all">
                  
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-16 h-16 rounded-full border-2 bg-[#0d1117] flex items-center justify-center overflow-hidden flex-shrink-0" style={{ borderColor: cat.theme_color || '#007AFF' }}>
                      {cat.logo_url ? (
                        <img src={cat.logo_url} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl font-black italic" style={{ color: cat.theme_color || '#007AFF' }}>
                          {cat.store_name?.substring(0, 2).toUpperCase() || 'HK'}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{cat.store_name || 'Loja Sem Nome'}</h3>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: cat.theme_color || '#007AFF' }}></span>
                        <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Tema Ativo</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link to={`/editar/${cat.id}`} className="flex-1 md:flex-none h-12 bg-[#0d1117] border border-white/10 hover:border-white/30 text-white font-medium px-5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                      <Edit size={18} /> Editar
                    </Link>
                    <a href={`/catalogo/${cat.slug || cat.id}`} target="_blank" rel="noreferrer" className="flex-1 md:flex-none h-12 bg-[#007AFF] text-white font-medium px-5 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-[#0066D6] shadow-[0_4px_15px_rgba(0,122,255,0.3)] active:scale-95">
                      <ExternalLink size={18} /> Ver Loja
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ========================================== */}
        {/*           ÁREA DE UPSELLS                  */}
        {/* ========================================== */}

        {/* UPSELL 1: EDITOR PRO (COPY NOVA) */}
        {!unlockedEditor && (
          <div className="bg-gradient-to-r from-[#1a150b] to-[#110e06] rounded-3xl p-6 md:p-8 border border-[#f59e0b]/40 shadow-[0_10px_30px_rgba(245,158,11,0.1)] flex flex-col gap-6 relative overflow-hidden mt-4 transition-transform hover:scale-[1.01]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#f59e0b] rounded-full blur-[100px] opacity-15 pointer-events-none"></div>
            
            <div className="flex items-start justify-between relative z-10">
              <div className="flex gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] flex-shrink-0">
                  <Crown size={32} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold mb-2 text-white">Editor PRO <span className="text-[#f59e0b]">(Acesso Vitalício)</span></h2>
                  <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                    Edite o seu catálogo de forma ilimitada a qualquer momento! Troque cores, logotipo, redes sociais, categorias, ligas e muito mais com acesso vitalício ao editor.
                  </p>
                </div>
              </div>
            </div>

            <a href="LINK_DO_CHECKOUT_KIWIFY_AQUI" target="_blank" rel="noreferrer" className="w-full h-14 bg-[#f59e0b] text-black font-black uppercase tracking-wider text-sm rounded-xl flex items-center justify-center transition-all hover:bg-[#d97706] active:scale-[0.98] shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              Desbloquear Editor PRO
            </a>
          </div>
        )}

        {/* UPSELL 2: Pack Premium de Vídeos */}
        <div className="bg-[#161b26] rounded-3xl p-6 border border-white/5 shadow-xl flex flex-col gap-5 mt-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#0d1117] border border-white/10 flex items-center justify-center text-gray-400">
                <Lock size={32} />
              </div>
              <div>
                <h2 className="text-xl font-medium mb-1">Pack Premium: Vídeos de Camisas</h2>
                <p className="text-gray-400 text-sm">Acesso a vídeos em alta conversão para Reels e TikTok.</p>
              </div>
            </div>
            {unlockedVideos && (
              <span className="flex items-center gap-1.5 text-xs font-semibold bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full border border-green-500/20">
                <CheckCircle2 size={14} /> Liberado
              </span>
            )}
          </div>
          <div className="w-full bg-[#0d1117] rounded-2xl overflow-hidden border border-white/5 aspect-[9/16] max-h-[360px] mx-auto flex justify-center">
            <video ref={videoRef1} src="https://tupdrlkgcvcoihdzvefj.supabase.co/storage/v1/object/public/video%20pack%20de%20videos/WhatsApp%20Video%202026-06-04%20at%2013.12.23%20(1).mp4" controls playsInline loop autoPlay muted className="h-full w-auto object-contain" />
          </div>
          {!unlockedVideos && (
            <a href="LINK_DO_CHECKOUT_KIWIFY_AQUI" target="_blank" rel="noreferrer" className="w-full h-14 bg-[#4c82f7] text-white font-semibold rounded-xl flex items-center justify-center transition-all hover:bg-[#3b6edb] active:scale-[0.98]">
              Desbloquear Acesso
            </a>
          )}
        </div>

        {/* UPSELL 3: Artes Editáveis */}
        <div className="bg-[#161b26] rounded-3xl p-6 border border-white/5 shadow-xl flex flex-col gap-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#0d1117] border border-white/10 flex items-center justify-center text-gray-400">
                <Lock size={32} />
              </div>
              <div>
                <h2 className="text-xl font-medium mb-1">Artes Editáveis (Canva/Photoshop)</h2>
                <p className="text-gray-400 text-sm">Templates de alta conversão para os seus anúncios.</p>
              </div>
            </div>
            {unlockedArts && (
              <span className="flex items-center gap-1.5 text-xs font-semibold bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full border border-green-500/20">
                <CheckCircle2 size={14} /> Liberado
              </span>
            )}
          </div>
          <div className="w-full bg-[#0d1117] rounded-2xl overflow-hidden border border-white/5 aspect-[9/16] max-h-[360px] mx-auto flex justify-center">
            <video ref={videoRef2} src="https://tupdrlkgcvcoihdzvefj.supabase.co/storage/v1/object/public/video%20artes/WhatsApp%20Video%202026-06-04%20at%2013.12.14%20(1).mp4" controls playsInline loop autoPlay muted className="h-full w-auto object-contain" />
          </div>
          {!unlockedArts && (
            <a href="LINK_DO_CHECKOUT_KIWIFY_AQUI" target="_blank" rel="noreferrer" className="w-full h-14 bg-[#4c82f7] text-white font-semibold rounded-xl flex items-center justify-center transition-all hover:bg-[#3b6edb] active:scale-[0.98]">
              Desbloquear Acesso
            </a>
          )}
        </div>

      </div>
    </div>
  );
}