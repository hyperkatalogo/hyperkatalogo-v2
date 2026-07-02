import { useState, useRef, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Upload, LogOut, Check, Wallet, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Formulario() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [storeName, setStoreName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedColor, setSelectedColor] = useState('#007AFF'); 
  const [customHex, setCustomHex] = useState('#007AFF');
  const presetColors = [
    { hex: '#007AFF' }, { hex: '#10B981' }, { hex: '#ef4444' }, { hex: '#f59e0b' },
    { hex: '#8b5cf6' }, { hex: '#ec4899' }, { hex: '#06b6d4' }, { hex: '#111827' }
  ];

  const [categorias, setCategorias] = useState({
    mangaLonga: true, jogador: true, retro: true, infantil: true,
    feminino: true, abrigo: true, treino: true, cortaVento: true,
  });

  const [ligas, setLigas] = useState({
    selecoes: true, brasileirao: false, laliga: false, premier: false,
    seriea: false, ligue1: false, bundesliga: false, resto: false,
  });

  const [moeda, setMoeda] = useState('R$');
  const [precos, setPrecos] = useState({
    mangaLonga: '', jogador: '', retro: '', infantil: '',
    feminino: '', abrigo: '', treino: '', cortaVento: '', personalizacao: ''
  });

  const defaultThemeColor = '#007AFF';

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
      } else {
        setCurrentUser(user);
      }
    }
    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleNextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (step === 1 && (!storeName.trim() || !whatsapp.trim())) {
      alert('Preencha os campos obrigatórios: Nome da loja e WhatsApp.');
      return;
    }
    setStep(prev => Math.min(prev + 1, 5));
  };

  const handlePrevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleColorChange = (hex: string) => {
    setSelectedColor(hex);
    setCustomHex(hex);
  };

  const handleCustomHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomHex(val);
    if (val.startsWith('#') && (val.length === 4 || val.length === 7)) {
      setSelectedColor(val);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const toggleCategoria = (key: keyof typeof categorias) => setCategorias(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleLiga = (key: keyof typeof ligas) => setLigas(prev => ({ ...prev, [key]: !prev[key] }));

  const handleCriarCatalogo = async () => {
    if (!currentUser) {
      alert('Sessão expirada. Por favor, faça login novamente.');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    
    try {
      let finalLogoUrl = null;

      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('logos')
          .upload(fileName, logoFile);

        if (uploadError) {
          console.error('Erro no upload:', uploadError);
          alert('Erro ao fazer upload da logo. O catálogo será salvo sem ela.');
        } else {
          const { data } = supabase.storage.from('logos').getPublicUrl(fileName);
          finalLogoUrl = data.publicUrl;
        }
      }

      // --- CRIAÇÃO DO LINK (SLUG) ---
      const slugBase = storeName
        .toLowerCase()
        .normalize("NFD") 
        .replace(/[\u0300-\u036f]/g, "") 
        .replace(/[^a-z0-9]+/g, '-') 
        .replace(/(^-|-$)+/g, ''); 
      
      const linkSlug = `${slugBase}-${Math.floor(1000 + Math.random() * 9000)}`;

      const { data, error } = await supabase
        .from('catalogos')
        .insert([{
          user_id: currentUser.id,
          slug: linkSlug, // Salvando o slug
          store_name: storeName,
          whatsapp: whatsapp,
          instagram: instagram,
          facebook: facebook,
          tiktok: tiktok,
          logo_url: finalLogoUrl,
          theme_color: selectedColor,
          categorias: categorias,
          ligas: ligas,
          moeda: moeda,
          precos: precos
        }])
        .select();

      if (error) throw error;

      if (data && data[0]) navigate(`/catalogo/${data[0].slug}`); 
      
    } catch (error: any) {
      console.error('Erro ao guardar catálogo:', error);
      alert('Ocorreu um erro ao criar o catálogo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#090b11] text-white antialiased flex flex-col items-center p-4 md:p-8">
      
      <header className="w-full max-w-5xl flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-white/10 bg-black p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-full scale-110" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
          <h1 className="text-xl font-medium">HyperKatalogo</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Voltar ao Painel</Link>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 transition-all text-sm">
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      <div className="w-full max-w-md flex items-center justify-between mb-12 mt-4 relative px-4">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 h-[2px] bg-white/10 w-full -z-10" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 h-[2px] transition-all duration-500" style={{ width: `${((step - 1) / 4) * 100}%`, backgroundColor: defaultThemeColor }} />
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold border-2 z-10 bg-[#090b11] transition-all duration-300 ${step >= s ? 'scale-110' : 'border-white/10 text-gray-500'}`} style={{ borderColor: step >= s ? defaultThemeColor : '', color: step >= s ? defaultThemeColor : '' }}>
            {step > s ? <Check size={20} /> : s}
          </div>
        ))}
      </div>

      <main className="w-full max-w-4xl pb-20">
        
        {step === 1 && (
          <div className="max-w-md mx-auto bg-[#161b26] rounded-[32px] p-8 md:p-10 border border-white/5 shadow-2xl animate-in fade-in zoom-in duration-300">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1.5">Passo 1 de 5 · identidade</p>
            <form onSubmit={handleNextStep} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-base font-medium text-gray-200">Nome da loja *</label>
                <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="Ex.: HyperKatalogo Sports" className="w-full h-14 bg-[#0d1117] border border-white/10 rounded-2xl px-5 text-white focus:border-[#007AFF] outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-base font-medium text-gray-200">WhatsApp (com DDD) *</label>
                <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="(11) 99999-9999" className="w-full h-14 bg-[#0d1117] border border-white/10 rounded-2xl px-5 text-white focus:border-[#007AFF] outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-base font-medium text-gray-200">Logo da loja</label>
                <div onClick={() => fileInputRef.current?.click()} className="w-full h-40 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer bg-[#0d1117] hover:border-[#007AFF]/50 transition-all p-2 text-center">
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg, image/jpg" className="hidden" />
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center"><Upload size={24} className="text-gray-400" /></div>
                  <div>
                    <p className="text-sm font-medium text-gray-300">Clique para enviar a logo</p>
                    {logoFile && <p className="text-xs font-semibold text-[#007AFF] mt-2 truncate">Arquivo: {logoFile.name}</p>}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-base font-medium text-gray-200">Instagram</label>
                <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="https://instagram.com/..." className="w-full h-14 bg-[#0d1117] border border-white/10 rounded-2xl px-5 text-white focus:border-[#007AFF] outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-base font-medium text-gray-200">TikTok</label>
                <input type="text" value={tiktok} onChange={(e) => setTiktok(e.target.value)} placeholder="https://tiktok.com/@..." className="w-full h-14 bg-[#0d1117] border border-white/10 rounded-2xl px-5 text-white focus:border-[#007AFF] outline-none" />
              </div>
              <button type="submit" className="w-full h-14 mt-4 bg-[#007AFF] text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#0066D6] transition-all">Próximo <ArrowRight size={20} /></button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#161b26] rounded-[40px] p-8 md:p-12 border border-white/5 animate-in fade-in zoom-in duration-300">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1.5">Passo 2 de 5 · Visual</p>
              <h2 className="text-2xl font-semibold mb-8">Cor de destaque</h2>
              <div className="grid grid-cols-4 gap-4 mb-10">
                {presetColors.map((c) => (
                  <button key={c.hex} onClick={() => handleColorChange(c.hex)} style={{ backgroundColor: c.hex }} className={`w-12 h-12 rounded-full border-2 transition-all ${selectedColor === c.hex ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`}>
                    {selectedColor === c.hex && <Check className="text-white mx-auto" size={20} />}
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-300">Código Hexadecimal</label>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl border border-white/10" style={{ backgroundColor: selectedColor }} />
                  <input type="text" value={customHex} onChange={handleCustomHexChange} className="w-full h-14 bg-[#0d1117] border border-white/10 rounded-2xl px-5 font-mono uppercase focus:border-[#007AFF] outline-none" />
                </div>
              </div>
            </div>
            
            <div className="bg-[#050505] rounded-[32px] p-8 border border-white/10 flex flex-col items-center relative overflow-hidden shadow-inner min-h-[400px]">
              <div className="absolute top-4 right-4 bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-white/5">Preview</div>
              <div className="w-20 h-20 rounded-full border-2 flex items-center justify-center mb-4 mt-6 bg-black" style={{ borderColor: selectedColor, boxShadow: `0 0 15px ${selectedColor}50` }}>
                <span className="text-xl font-black italic" style={{ color: selectedColor }}>{storeName ? storeName.substring(0, 2).toUpperCase() : 'HK'}</span>
              </div>
              <h3 className="text-lg font-black uppercase mb-6 tracking-tight text-center">{storeName || 'Nome da loja'}</h3>
              <div className="w-full space-y-3">
                <div className="w-full h-12 rounded-full flex items-center justify-center gap-2 font-bold text-sm text-white" style={{ backgroundColor: selectedColor }}>👕 Tabela de medidas</div>
                <div className="w-full h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center gap-2 font-bold text-sm"><Wallet size={16} style={{ color: selectedColor }} /> Rastreie o pedido</div>
              </div>
            </div>
            <div className="md:col-span-2 flex justify-between mt-8 pt-4">
              <button onClick={handlePrevStep} className="text-gray-400 font-bold flex items-center gap-2 hover:text-white transition-all"><ArrowLeft size={18} /> Voltar</button>
              <button onClick={handleNextStep} className="bg-[#007AFF] text-white font-bold h-14 px-10 rounded-2xl flex items-center gap-2 hover:bg-[#0066D6] transition-all">Próximo <ArrowRight size={18} /></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-md mx-auto bg-[#161b26] rounded-[32px] p-8 md:p-10 border border-white/5 shadow-2xl animate-in fade-in zoom-in duration-300">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1.5">Passo 3 de 5 · Módulos</p>
            <h2 className="text-2xl font-semibold mb-2">Categorias</h2>
            <p className="text-sm text-gray-400 mb-8">Escolha os conteúdos do seu catálogo</p>
            
            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
              {[
                { id: 'mangaLonga', label: 'Manga-longa' }, { id: 'jogador', label: 'Versão Jogador' },
                { id: 'retro', label: 'Retrô' }, { id: 'infantil', label: 'Kit Infantil' },
                { id: 'feminino', label: 'Modelo Feminino' }, { id: 'abrigo', label: 'Kit de Abrigo' },
                { id: 'treino', label: 'Kit de Treino' }, { id: 'cortaVento', label: 'Corta-vento' },
              ].map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-4 bg-[#0d1117] border border-white/5 rounded-2xl">
                  <span className="text-[15px] font-normal text-gray-200">{cat.label}</span>
                  <button type="button" onClick={() => toggleCategoria(cat.id as keyof typeof categorias)} className={`w-12 h-6 rounded-full relative transition-all duration-300 ${categorias[cat.id as keyof typeof categorias] ? '' : 'bg-[#1f2937]'}`} style={{ backgroundColor: categorias[cat.id as keyof typeof categorias] ? defaultThemeColor : '' }}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${categorias[cat.id as keyof typeof categorias] ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-8">
              <button onClick={handlePrevStep} className="h-12 px-6 rounded-xl border border-white/10 bg-transparent text-gray-300 font-medium flex items-center gap-2 hover:bg-white/5 transition-all"><ArrowLeft size={18} /> Voltar</button>
              <button onClick={() => handleNextStep()} className="h-12 px-8 rounded-xl bg-[#007AFF] text-white font-medium flex items-center gap-2 transition-all shadow-lg">Próximo <ArrowRight size={18} /></button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="max-w-md mx-auto bg-[#161b26] rounded-[32px] p-8 md:p-10 border border-white/5 shadow-2xl animate-in fade-in zoom-in duration-300">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1.5">Passo 4 de 5 · Ligas</p>
            <h2 className="text-base font-semibold mb-6">Ligas disponíveis</h2>
            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
              {[
                { id: 'selecoes', label: 'Seleções Mundiais' }, { id: 'brasileirao', label: 'Brasileirão' },
                { id: 'laliga', label: 'La Liga' }, { id: 'premier', label: 'Premier League' },
                { id: 'seriea', label: 'Serie A' }, { id: 'ligue1', label: 'Ligue 1' },
                { id: 'bundesliga', label: 'Bundesliga' }, { id: 'resto', label: 'Resto do Mundo' }
              ].map((liga) => (
                <div key={liga.id} className="flex items-center justify-between p-4 bg-[#0d1117] border border-white/5 rounded-2xl">
                  <span className="text-[15px] font-normal text-gray-200">{liga.label}</span>
                  <button type="button" onClick={() => toggleLiga(liga.id as keyof typeof ligas)} className={`w-12 h-6 rounded-full relative transition-all duration-300 ${ligas[liga.id as keyof typeof ligas] ? '' : 'bg-[#1f2937]'}`} style={{ backgroundColor: ligas[liga.id as keyof typeof ligas] ? defaultThemeColor : '' }}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${ligas[liga.id as keyof typeof ligas] ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-8">
              <button onClick={handlePrevStep} className="h-12 px-6 rounded-xl border border-white/10 bg-transparent text-gray-300 font-medium flex items-center gap-2 hover:bg-white/5 transition-all"><ArrowLeft size={18} /> Voltar</button>
              <button onClick={() => handleNextStep()} className="h-12 px-8 rounded-xl bg-[#007AFF] text-white font-medium flex items-center gap-2 transition-all shadow-lg">Próximo <ArrowRight size={18} /></button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="max-w-md mx-auto bg-[#161b26] rounded-[32px] p-8 md:p-10 border border-white/5 shadow-2xl animate-in fade-in zoom-in duration-300">
            <p className="text-xs text-gray-400 font-medium mb-8">Preencha apenas as categorias que deseja exibir</p>
            <div className="flex items-center gap-3 mb-8 flex-wrap">
              {['R$', '$', '€'].map((m) => (
                <button key={m} type="button" onClick={() => setMoeda(m)} className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all ${moeda === m ? 'border-transparent text-white' : 'border-white/10 text-gray-400 bg-transparent hover:bg-white/5'}`} style={{ backgroundColor: moeda === m ? defaultThemeColor : '' }}>{m}</button>
              ))}
            </div>
            <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-1">
              {[
                { id: 'mangaLonga', label: 'Manga-longa' }, { id: 'jogador', label: 'Versão Jogador' },
                { id: 'retro', label: 'Retrô' }, { id: 'infantil', label: 'Kit Infantil' },
                { id: 'feminino', label: 'Modelo Feminino' }, { id: 'abrigo', label: 'Kit de Abrigo' },
                { id: 'treino', label: 'Kit de Treino' }, { id: 'cortaVento', label: 'Corta-vento' },
                { id: 'personalizacao', label: 'Personalização' }
              ].map((p) => (
                <div key={p.id} className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-400">{p.label}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-gray-400 font-medium">{moeda}</span>
                    <input type="text" value={precos[p.id as keyof typeof precos]} onChange={(e) => setPrecos(v => ({ ...v, [p.id]: e.target.value }))} placeholder="0,00" className="w-full h-12 bg-[#0d1117] border border-white/10 rounded-xl pl-12 pr-4 focus:border-[#007AFF] outline-none text-white font-mono text-[15px]" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-8">
              <button onClick={handlePrevStep} className="h-12 px-6 rounded-xl border border-white/10 bg-transparent text-gray-300 font-medium flex items-center gap-2 hover:bg-white/5 transition-all" disabled={isSubmitting}><ArrowLeft size={18} /> Voltar</button>
              <button onClick={handleCriarCatalogo} disabled={isSubmitting} className="h-12 px-8 rounded-xl bg-[#007AFF] text-white font-medium flex items-center gap-2 hover:bg-[#0066D6] transition-all shadow-lg disabled:opacity-50">
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} {isSubmitting ? 'A Guardar...' : 'Criar Catálogo'}
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}