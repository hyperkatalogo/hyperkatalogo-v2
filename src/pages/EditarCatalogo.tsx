import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Upload, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function EditarCatalogo() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // SIMULAÇÃO DO PREMIUM (Mude para true para ver como fica após a compra)
  const [unlockedEditor] = useState(false);

  const [storeName, setStoreName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedColor, setSelectedColor] = useState('#007AFF'); 
  const presetColors = [
    { hex: '#007AFF' }, { hex: '#10B981' }, { hex: '#ef4444' }, { hex: '#f59e0b' },
    { hex: '#8b5cf6' }, { hex: '#ec4899' }, { hex: '#06b6d4' }, { hex: '#111827' }
  ];

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
        setLogoUrl(data.logo_url);
        setSelectedColor(data.theme_color || '#007AFF');

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

      // Só faz upload se tiver ficheiro E se o editor estiver desbloqueado
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

      // Prepara os dados. Acesso Livre: Apenas Nome e WhatsApp
      const updateData: any = {
        store_name: storeName,
        whatsapp: whatsapp,
      };

      // Se o editor estiver desbloqueado, salva o resto do formulário
      if (unlockedEditor) {
        updateData.instagram = instagram;
        updateData.tiktok = tiktok;
        updateData.logo_url = finalLogoUrl;
        updateData.theme_color = selectedColor;
      }

      const { error } = await supabase
        .from('catalogos')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert('Ocorreu um erro ao atualizar o catálogo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // OVERLAY COM A NOVA COPY
  const PremiumOverlay = () => (
    <div className="absolute inset-0 bg-[#090b11]/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-[32px] border border-[#f59e0b]/50 pointer-events-auto">
      <div className="w-14 h-14 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
        <Crown size={28} className="text-black" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Recurso Exclusivo PRO</h3>
      <p className="text-sm text-gray-300 mb-6 px-4 md:px-10 text-center leading-relaxed">
        Edite seu catálogo de forma ilimitada a qualquer momento! Troque <strong className="text-[#f59e0b]">cores, logo, redes sociais, categorias, ligas e muito mais</strong> com acesso vitalício ao editor.
      </p>
      <a href="LINK_DO_CHECKOUT_KIWIFY_AQUI" target="_blank" rel="noreferrer" className="bg-[#f59e0b] text-black font-black uppercase text-sm tracking-wider px-8 py-4 rounded-xl hover:bg-[#d97706] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-105 active:scale-95">
        Desbloquear Acesso Vitalício
      </a>
    </div>
  );

  if (loading) return <div className="min-h-screen bg-[#090b11] flex items-center justify-center"><Loader2 size={40} className="animate-spin text-[#007AFF]" /></div>;

  return (
    <div className="min-h-screen w-full bg-[#090b11] text-white antialiased flex flex-col items-center p-4 md:p-8 pb-24">
      
      <header className="w-full max-w-4xl flex items-center justify-between mb-8">
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white font-medium transition-colors">
          <ArrowLeft size={20} /> Voltar
        </Link>
        <h1 className="text-xl font-bold">Editar Catálogo</h1>
      </header>

      <form onSubmit={handleUpdate} className="w-full max-w-4xl flex flex-col gap-8">
        
        {/* BLOCO 1: Informações Básicas (Sempre Livre - APENAS NOME E WHATSAPP) */}
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

        {/* BLOCO 2: Premium (Logo, Cores, Redes Sociais extras) */}
        <div className="relative rounded-[32px]">
          {/* MÁSCARA SUPERIOR */}
          {!unlockedEditor && <PremiumOverlay />}
          
          {/* CONTEÚDO PREMIUM */}
          <div className={`bg-[#161b26] rounded-[32px] p-8 md:p-10 border border-white/5 shadow-xl flex flex-col gap-10 transition-all ${!unlockedEditor ? 'pointer-events-none select-none opacity-40 blur-sm' : ''}`}>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Logo */}
              <div>
                <h2 className="text-xl font-semibold mb-6">Logotipo da Loja</h2>
                <div onClick={() => unlockedEditor && fileInputRef.current?.click()} className="w-full h-40 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 bg-[#0d1117] transition-all p-4 text-center cursor-pointer hover:border-[#f59e0b]/50">
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg, image/jpg" className="hidden" disabled={!unlockedEditor} />
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center"><Upload size={24} className="text-gray-400" /></div>
                  <div>
                    <p className="text-sm font-medium text-gray-300">Clique para enviar a logo</p>
                    {logoFile ? (
                      <p className="text-xs font-semibold text-[#f59e0b] mt-2 truncate">{logoFile.name}</p>
                    ) : logoUrl ? (
                      <p className="text-xs font-semibold text-green-400 mt-2">Logo atual salva</p>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Cores */}
              <div>
                <h2 className="text-xl font-semibold mb-6">Cor de Destaque</h2>
                <div className="grid grid-cols-4 gap-4">
                  {presetColors.map((c) => (
                    <button key={c.hex} type="button" disabled={!unlockedEditor} onClick={() => setSelectedColor(c.hex)} style={{ backgroundColor: c.hex }} className={`w-12 h-12 rounded-full border-2 transition-all ${selectedColor === c.hex ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`} />
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full h-[1px] bg-white/5"></div>

            {/* Redes Sociais Extras */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Redes Sociais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">Instagram</label>
                  <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} disabled={!unlockedEditor} className="w-full h-14 bg-[#0d1117] border border-white/10 rounded-2xl px-5 text-white focus:border-[#f59e0b] outline-none disabled:opacity-50" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">TikTok</label>
                  <input type="text" value={tiktok} onChange={(e) => setTiktok(e.target.value)} disabled={!unlockedEditor} className="w-full h-14 bg-[#0d1117] border border-white/10 rounded-2xl px-5 text-white focus:border-[#f59e0b] outline-none disabled:opacity-50" />
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="flex justify-end sticky bottom-6 z-50 mt-4">
          <button type="submit" disabled={isSubmitting} className="h-14 px-10 rounded-2xl bg-[#007AFF] text-white font-bold flex items-center gap-2 hover:bg-[#0066D6] transition-all shadow-[0_4px_25px_rgba(0,122,255,0.4)] disabled:opacity-70">
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />} 
            {isSubmitting ? 'A Guardar...' : 'Salvar Alterações'}
          </button>
        </div>

      </form>
    </div>
  );
}