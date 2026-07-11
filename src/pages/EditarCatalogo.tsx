import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Upload, Crown, LayoutDashboard, Settings2, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function EditarCatalogo() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status PRO
  const [unlockedEditor, setUnlockedEditor] = useState(false);

  // DADOS GERAIS
  const [storeName, setStoreName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [facebook, setFacebook] = useState('');
  
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedColor, setSelectedColor] = useState('#007AFF'); 
  const presetColors = [
    { hex: '#007AFF' }, { hex: '#10B981' }, { hex: '#ef4444' }, { hex: '#f59e0b' },
    { hex: '#8b5cf6' }, { hex: '#ec4899' }, { hex: '#06b6d4' }, { hex: '#111827' }
  ];

  // MOEDA E PREÇOS
  const [moeda, setMoeda] = useState('R$');
  const [precos, setPrecos] = useState({
    cortaVento: '', abrigo: '', treino: '', infantil: '',
    jogador: '', mangaLonga: '', feminino: '', retro: '', personalizacao: ''
  });

  // LIGA/DESLIGA CATEGORIAS
  const [categorias, setCategorias] = useState({
    abrigo: true, infantil: true, treino: true, jogador: true,
    feminino: true, mangaLonga: true, retro: true, cortaVento: true
  });

  // LIGA/DESLIGA LIGAS
  const [ligas, setLigas] = useState({
    selecoes: true, brasileirao: true, laliga: true, premier: true,
    seriea: true, ligue1: true, bundesliga: true, resto: true
  });

  useEffect(() => {
    async function fetchCatalogo() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        const { data, error } = await supabase
          .from('catalogos')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error || !data) {
          navigate('/dashboard');
          return;
        }

        setStoreName(data.store_name || '');
        setWhatsapp(data.whatsapp || '');
        setInstagram(data.instagram || '');
        setTiktok(data.tiktok || '');
        setFacebook(data.facebook || '');
        setLogoUrl(data.logo_url);
        setSelectedColor(data.theme_color || '#007AFF');
        setUnlockedEditor(data.is_pro === true);

        if (data.moeda) setMoeda(data.moeda);
        if (data.precos) setPrecos(data.precos);
        if (data.categorias) setCategorias(data.categorias);
        if (data.ligas) setLigas(data.ligas);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCatalogo();
  }, [id, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let finalLogoUrl = logoUrl;

      if (logoFile && unlockedEditor) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('logos')
          .upload(fileName, logoFile, { upsert: true });

        if (!uploadError) {
          const { data } = supabase.storage.from('logos').getPublicUrl(fileName);
          finalLogoUrl = data.publicUrl;
        }
      }

      const updateData: any = {
        store_name: storeName,
        whatsapp: whatsapp,
      };

      if (unlockedEditor) {
        updateData.instagram = instagram;
        updateData.tiktok = tiktok;
        updateData.facebook = facebook;
        updateData.logo_url = finalLogoUrl;
        updateData.theme_color = selectedColor;
        updateData.moeda = moeda;
        updateData.precos = precos;
        updateData.categorias = categorias;
        updateData.ligas = ligas;
      }

      const { error } = await supabase
        .from('catalogos')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      alert("Catálogo atualizado com sucesso!");
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert('Ocorreu um erro ao salvar as configurações.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCategoria = (key: keyof typeof categorias) => setCategorias(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleLiga = (key: keyof typeof ligas) => setLigas(prev => ({ ...prev, [key]: !prev[key] }));

  const PremiumOverlay = () => (
    <div className="absolute inset-0 bg-[#090b11]/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-[32px] border border-[#f59e0b]/50 pointer-events-auto">
      <div className="w-14 h-14 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
        <Crown size={28} className="text-black" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Recurso Exclusivo PRO</h3>
      <p className="text-sm text-gray-300 mb-6 px-4 md:px-10 text-center leading-relaxed">
        Edite o seu catálogo de forma ilimitada! Altere <strong className="text-[#f59e0b]">cores, logo, oculte ligas e edite a tabela de preços</strong> com acesso vitalício ao editor avançado.
      </p>
      <a href="LINK_DO_CHECKOUT_KIWIFY_AQUI" target="_blank" rel="noreferrer" className="bg-[#f59e0b] text-black font-black uppercase text-sm tracking-wider px-8 py-4 rounded-xl hover:bg-[#d97706] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-105 active:scale-95">
        Desbloquear Acesso Vitalício
      </a>
    </div>
  );

  if (loading) return <div className="min-h-screen bg-[#090b11] flex items-center justify-center"><Loader2 size={40} className="animate-spin text-[#007AFF]" /></div>;

  return (
    <div className="min-h-screen w-full bg-[#090b11] text-white antialiased flex flex-col items-center p-4 md:p-8 pb-32">
      
      <header className="w-full max-w-4xl flex items-center justify-between mb-8">
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white font-medium transition-colors">
          <ArrowLeft size={20} /> Painel
        </Link>
        <h1 className="text-xl font-bold">Editor de Catálogo</h1>
      </header>

      <form onSubmit={handleUpdate} className="w-full max-w-4xl flex flex-col gap-8">
        
        {/* ================= INFORMAÇÕES BÁSICAS ================= */}
        <div className="bg-[#161b26] rounded-[32px] p-8 md:p-10 border border-white/5 shadow-xl relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Acesso Gratuito</span>
            <h2 className="text-2xl font-semibold">Contato Básico</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Nome da loja</label>
              <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} required className="w-full h-14 bg-[#0d1117] border border-white/10 rounded-2xl px-5 text-white focus:border-[#007AFF] outline-none" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">WhatsApp</label>
              <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required className="w-full h-14 bg-[#0d1117] border border-white/10 rounded-2xl px-5 text-white focus:border-[#007AFF] outline-none" />
            </div>
          </div>
        </div>

        {/* ================= ÁREA PREMIUM ================= */}
        <div className="relative rounded-[32px]">
          {!unlockedEditor && <PremiumOverlay />}
          
          <div className={`flex flex-col gap-8 transition-all ${!unlockedEditor ? 'pointer-events-none select-none opacity-40 blur-[2px]' : ''}`}>
            
            {/* SEÇÃO 1: VISUAL E REDES SOCIAIS */}
            <div className="bg-[#161b26] rounded-[32px] p-8 md:p-10 border border-white/5 shadow-xl flex flex-col gap-10">
              <div className="flex items-center gap-3 mb-2">
                <Settings2 className="text-[#007AFF]" />
                <h2 className="text-2xl font-semibold">Visual e Redes Sociais</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-4">Logotipo da Loja</h3>
                  <div onClick={() => unlockedEditor && fileInputRef.current?.click()} className="w-full h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 bg-[#0d1117] transition-all p-4 text-center cursor-pointer hover:border-[#f59e0b]/50">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg, image/jpg" className="hidden" disabled={!unlockedEditor} />
                    <Upload size={24} className="text-gray-400" />
                    <div>
                      {logoFile ? <p className="text-xs font-semibold text-[#f59e0b] truncate">{logoFile.name}</p> : logoUrl ? <p className="text-xs font-semibold text-green-400">Logo salva (clique para trocar)</p> : <p className="text-xs text-gray-400">Nenhuma logo enviada</p>}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-4">Cor de Destaque</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {presetColors.map((c) => (
                      <button key={c.hex} type="button" disabled={!unlockedEditor} onClick={() => setSelectedColor(c.hex)} style={{ backgroundColor: c.hex }} className={`w-12 h-12 rounded-full border-2 transition-all ${selectedColor === c.hex ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full h-[1px] bg-white/5"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">Instagram</label>
                  <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} disabled={!unlockedEditor} className="w-full h-12 bg-[#0d1117] border border-white/10 rounded-xl px-4 text-sm text-white focus:border-[#007AFF] outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">TikTok</label>
                  <input type="text" value={tiktok} onChange={(e) => setTiktok(e.target.value)} disabled={!unlockedEditor} className="w-full h-12 bg-[#0d1117] border border-white/10 rounded-xl px-4 text-sm text-white focus:border-[#007AFF] outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">Facebook</label>
                  <input type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)} disabled={!unlockedEditor} className="w-full h-12 bg-[#0d1117] border border-white/10 rounded-xl px-4 text-sm text-white focus:border-[#007AFF] outline-none" />
                </div>
              </div>
            </div>

            {/* SEÇÃO 2: LIGA/DESLIGA MÓDULOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#161b26] rounded-[32px] p-8 border border-white/5 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <LayoutDashboard className="text-[#007AFF]" />
                  <h2 className="text-xl font-semibold">Exibir Categorias</h2>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'mangaLonga', label: 'Manga-longa' }, { id: 'jogador', label: 'Versão Jogador' },
                    { id: 'retro', label: 'Retrô' }, { id: 'infantil', label: 'Kit Infantil' },
                    { id: 'feminino', label: 'Modelo Feminino' }, { id: 'abrigo', label: 'Kit de Abrigo' },
                    { id: 'treino', label: 'Kit de Treino' }, { id: 'cortaVento', label: 'Corta-vento' },
                  ].map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-3 bg-[#0d1117] rounded-xl border border-white/5">
                      <span className="text-sm text-gray-200">{cat.label}</span>
                      <button type="button" onClick={() => toggleCategoria(cat.id as keyof typeof categorias)} className={`w-11 h-6 rounded-full relative transition-all duration-300 ${categorias[cat.id as keyof typeof categorias] ? 'bg-[#007AFF]' : 'bg-[#1f2937]'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${categorias[cat.id as keyof typeof categorias] ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#161b26] rounded-[32px] p-8 border border-white/5 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <LayoutDashboard className="text-[#007AFF]" />
                  <h2 className="text-xl font-semibold">Exibir Ligas</h2>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'selecoes', label: 'Seleções Mundiais' }, { id: 'brasileirao', label: 'Brasileirão' },
                    { id: 'laliga', label: 'La Liga' }, { id: 'premier', label: 'Premier League' },
                    { id: 'seriea', label: 'Serie A' }, { id: 'ligue1', label: 'Ligue 1' },
                    { id: 'bundesliga', label: 'Bundesliga' }
                  ].map((liga) => (
                    <div key={liga.id} className="flex items-center justify-between p-3 bg-[#0d1117] rounded-xl border border-white/5">
                      <span className="text-sm text-gray-200">{liga.label}</span>
                      <button type="button" onClick={() => toggleLiga(liga.id as keyof typeof ligas)} className={`w-11 h-6 rounded-full relative transition-all duration-300 ${ligas[liga.id as keyof typeof ligas] ? 'bg-[#007AFF]' : 'bg-[#1f2937]'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${ligas[liga.id as keyof typeof ligas] ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SEÇÃO 3: PREÇOS */}
            <div className="bg-[#161b26] rounded-[32px] p-8 md:p-10 border border-white/5 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Tag className="text-[#007AFF]" />
                <h2 className="text-2xl font-semibold">Tabela de Preços</h2>
              </div>
              <div className="flex items-center gap-3 mb-6">
                {['R$', '$', '€'].map((m) => (
                  <button key={m} type="button" disabled={!unlockedEditor} onClick={() => setMoeda(m)} className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all ${moeda === m ? 'border-[#007AFF] bg-[#007AFF] text-white' : 'border-white/10 text-gray-400 bg-transparent'}`}>{m}</button>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { id: 'cortaVento', label: 'Corta-vento' }, { id: 'abrigo', label: 'Kit de Abrigo' },
                  { id: 'treino', label: 'Kit de Treino' }, { id: 'infantil', label: 'Kit Infantil' },
                  { id: 'jogador', label: 'Versão Jogador' }, { id: 'mangaLonga', label: 'Manga Longa' },
                  { id: 'feminino', label: 'Feminino' }, { id: 'retro', label: 'Retrô' },
                  { id: 'personalizacao', label: 'Personalização' }
                ].map((p) => (
                  <div key={p.id} className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-400">{p.label}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">{moeda}</span>
                      <input type="text" value={precos[p.id as keyof typeof precos]} onChange={(e) => setPrecos(v => ({ ...v, [p.id]: e.target.value }))} disabled={!unlockedEditor} placeholder="Ex: 149,90" className="w-full h-12 bg-[#0d1117] border border-white/10 rounded-xl pl-9 pr-3 focus:border-[#007AFF] outline-none text-white text-sm font-mono" />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">* Deixe em branco os itens que não quiser exibir na tabela de preços.</p>
            </div>

          </div>
        </div>

        {/* BARRA DE SALVAR FLUTUANTE */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
          <button type="submit" disabled={isSubmitting} className="w-full h-14 rounded-2xl bg-[#007AFF] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#0066D6] transition-all shadow-[0_10px_30px_rgba(0,122,255,0.4)] disabled:opacity-70 disabled:shadow-none">
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />} 
            {isSubmitting ? 'A Guardar...' : 'Salvar Alterações'}
          </button>
        </div>

      </form>
    </div>
  );
}