import { useRef, useState, useEffect } from 'react';
import { Shirt, Truck, ChevronLeft, ChevronRight, Loader2, Search, MousePointerClick, X } from "lucide-react";
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Catalogo() {
  const { id } = useParams(); 
  const [catalogo, setCatalogo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ESTADO DA BARRA DE PESQUISA
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const isSearching = termoPesquisa.length > 0;

  const menuRef = useRef<HTMLDivElement>(null);
  const selecoesRef = useRef<HTMLDivElement>(null);

  const [showMenuLeft, setShowMenuLeft] = useState(false);
  const [showMenuRight, setShowMenuRight] = useState(true);
  const [showSelLeft, setShowSelLeft] = useState(false);
  const [showSelRight, setShowSelRight] = useState(true);

  useEffect(() => {
    async function fetchCatalogo() {
      try {
        let { data, error } = await supabase
          .from('catalogos')
          .select('*')
          .eq('slug', id)
          .single();

        if (error || !data) {
          const { data: fallbackData } = await supabase
            .from('catalogos')
            .select('*')
            .eq('id', id)
            .single();
          data = fallbackData;
        }

        if (data) setCatalogo(data);
      } catch (err) {
        console.error("Erro ao carregar loja:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchCatalogo();
  }, [id]);

  useEffect(() => {
    if (catalogo) {
      // Força o título a ser APENAS o nome da loja, removendo qualquer sujeira
      document.title = catalogo.store_name || 'HyperKatalogo';
      let favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        document.head.appendChild(favicon);
      }
      favicon.href = catalogo.logo_url || '/logo.jpg';
    }
  }, [catalogo]);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) ref.current.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  const updateArrows = (ref: React.RefObject<HTMLDivElement | null>, setLeft: Function, setRight: Function) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      setLeft(scrollLeft > 15);
      setRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 15);
    }
  };

  useEffect(() => {
    if (!isSearching) {
      updateArrows(menuRef, setShowMenuLeft, setShowMenuRight);
      updateArrows(selecoesRef, setShowSelLeft, setShowSelRight);
    }
    const handleResize = () => {
      if (!isSearching) {
        updateArrows(menuRef, setShowMenuLeft, setShowMenuRight);
        updateArrows(selecoesRef, setShowSelLeft, setShowSelRight);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [catalogo, termoPesquisa]); 

  // CATEGORIAS - MENU RÁPIDO
  const categorias = [
    { id: 1, titulo: "KIT DE ABRIGO", img: "/kit-de-abrigo.png", link: "https://photos.app.goo.gl/AcVbrSbL4imDJSgD8" },
    { id: 2, titulo: "KIT INFANTIL", img: "/kit-infantil.png", link: "https://photos.app.goo.gl/68EPCNHGSeDPPsv97" },
    { id: 3, titulo: "KIT DE TREINO", img: "/kit-de-treino.png", link: "https://photos.app.goo.gl/qyoKSK9B4Z5aWB5K8" },
    { id: 4, titulo: "VERSÃO JOGADOR", img: "/modelo-jogador.png", link: "https://photos.app.goo.gl/ixfk8k5dbZWdudzKA" },
    { id: 5, titulo: "MODELO FEMININO", img: "/modelo-feminino.jpg", link: "https://photos.app.goo.gl/2fuyRew8Yaqp5ZCn7" },
    { id: 6, titulo: "MANGA LONGA", img: "/manga-longa.png", link: "https://photos.app.goo.gl/jWiGyHsfcfosweQ8A" },
  ];

  // TODAS AS 57 SELEÇÕES
  const selecoesItems = [
    { id: 1, img: "/ALEMANHA.png", name: "ALEMANHA", link: "https://photos.app.goo.gl/iU92iRfttVxHjzV67" },
    { id: 2, img: "/ARABIA.png", name: "ARÁBIA S.", link: "https://photos.app.goo.gl/UCfdhPH5APQHeQQu6" },
    { id: 3, img: "/ARGELIA.png", name: "ARGÉLIA", link: "https://photos.app.goo.gl/5s2QC8ZezgeiKfgo9" },
    { id: 4, img: "/ARGENTINA.png", name: "ARGENTINA", link: "https://photos.app.goo.gl/eAmjsAuosWDhkDHd8" },
    { id: 5, img: "/AUSTRALIA.png", name: "AUSTRÁLIA", link: "https://photos.app.goo.gl/8PctJ9u4NJMdkeq37" },
    { id: 6, img: "/AUSTRIA.png", name: "ÁUSTRIA", link: "https://photos.app.goo.gl/wZdXYHEyn1KcNMK3A" },
    { id: 7, img: "/BELGICA.png", name: "BÉLGICA", link: "https://photos.app.goo.gl/jMcYp2L9gxrCYWQM6" },
    { id: 8, img: "/BOLIVIA.png", name: "BOLÍVIA", link: "https://photos.app.goo.gl/b2phKyfQzCEy6DDf8" },
    { id: 9, img: "/BRASIL.png", name: "BRASIL", link: "https://photos.app.goo.gl/caB7TJKQgLvpZLwk6" },
    { id: 10, img: "/BURKINA-FASO.png", name: "BURKINA\nFASO", link: "https://photos.app.goo.gl/h9Kkgmt5BC8mUco27" },
    { id: 11, img: "/CAMAROES.png", name: "CAMARÕES", link: "https://photos.app.goo.gl/vv4juW4J5q8MG6RV7" },
    { id: 12, img: "/CANADA.png", name: "CANADÁ", link: "https://photos.app.goo.gl/uEWm3pgSkzuqtacK9" },
    { id: 13, img: "/CATAR.png", name: "CATAR", link: "https://photos.app.goo.gl/Cqeo8ecH2wjXtJKCA" },
    { id: 14, img: "/CHILE.png", name: "CHILE", link: "https://photos.app.goo.gl/aaJFm83DEdtXK7hs7" },
    { id: 15, img: "/COLOMBIA.png", name: "COLÔMBIA", link: "https://photos.app.goo.gl/uPztD5iwwAWKEBFy6" },
    { id: 16, img: "/COREIA.png", name: "CORÉIA", link: "https://photos.app.goo.gl/Ea6v5JcUFt8xoaWE9" },
    { id: 17, img: "/COSTA-DO-MARFIM.png", name: "COSTA DO\nMARFIM", link: "https://photos.app.goo.gl/TpRSsg8JMKLToPip8" },
    { id: 18, img: "/COSTA-RICA.png", name: "COSTA RICA", link: "https://photos.app.goo.gl/kwLuDebd3WPet8XA9" },
    { id: 19, img: "/CROACIA.png", name: "CROÁCIA", link: "https://photos.app.goo.gl/cvUMVN31mJ2GQ7d69" },
    { id: 20, img: "/DINAMARCA.png", name: "DINAMARCA", link: "https://photos.app.goo.gl/DsAgEcggfDEd2mTt6" },
    { id: 21, img: "/EGITO.png", name: "EGITO", link: "https://photos.app.goo.gl/GGZKhJG6vesJBdhg9" },
    { id: 22, img: "/EL-SALVADOR.png", name: "EL SALVADOR", link: "https://photos.app.goo.gl/UUg35ZUe8rLeabbCA" },
    { id: 23, img: "/EQUADOR.png", name: "EQUADOR", link: "https://photos.app.goo.gl/S5Nbtv92dmEXK9ZL8" },
    { id: 24, img: "/ESCOCIA.png", name: "ESCÓCIA", link: "https://photos.app.goo.gl/weDGJ4LtMrmC4EFBA" },
    { id: 25, img: "/espanha.png", name: "ESPANHA", link: "https://photos.app.goo.gl/vZjX6KtWDF4Lr4yP8" },
    { id: 26, img: "/USA.png", name: "EUA", link: "https://photos.app.goo.gl/r3j6fkkfFNBzGr7UA" },
    { id: 27, img: "/FRANÇA.png", name: "FRANÇA", link: "https://photos.app.goo.gl/LxP2avYb8EEvxevWA" },
    { id: 28, img: "/GALES.png", name: "GALES", link: "https://photos.app.goo.gl/ZyXceLyCE4DQztC26" },
    { id: 29, img: "/GANA.png", name: "GANA", link: "https://photos.app.goo.gl/T6qZr9fygzPXDWwo7" },
    { id: 30, img: "/GUATEMALA.png", name: "GUATEMALA", link: "https://photos.app.goo.gl/o5Q5EcAcn91Hn7L7A" },
    { id: 31, img: "/HOLANDA.png", name: "HOLANDA", link: "https://photos.app.goo.gl/jPe1UkBAArPJdTHK8" },
    { id: 32, img: "/HONDURAS.png", name: "HONDURAS", link: "https://photos.app.goo.gl/aNDPtRiBjY4gXcLP9" },
    { id: 33, img: "/HUNGRIA.png", name: "HUNGRIA", link: "https://photos.app.goo.gl/jkziQ5ke6rhYYFwQ8" },
    { id: 34, img: "/inglaterra.png", name: "INGLATERRA", link: "https://photos.app.goo.gl/5ACbDwoS4tEiZPSa6" },
    { id: 35, img: "/IRLANDA.png", name: "IRLANDA", link: "https://photos.app.goo.gl/zZbCuRrpUAJQLo4K9" },
    { id: 36, img: "/ISLANDIA.png", name: "ISLÂNDIA", link: "https://photos.app.goo.gl/zSdPuFwQPYkn2PNR6" },
    { id: 37, img: "/ISRAEL.png", name: "ISRAEL", link: "https://photos.app.goo.gl/crmyrK9C4P824HX36" },
    { id: 38, img: "/italia.png", name: "ITÁLIA", link: "https://photos.app.goo.gl/ES5kUGDfk29D2iWm7" },
    { id: 39, img: "/JAMAICA.png", name: "JAMAICA", link: "https://photos.app.goo.gl/vpgwpEhGAoqjWpNN6" },
    { id: 40, img: "/JAPAO.png", name: "JAPÃO", link: "https://photos.app.goo.gl/2AjcmpuiQP5k9MCw5" },
    { id: 41, img: "/MALI.png", name: "MALI", link: "https://photos.app.goo.gl/LmuHW5tq3imrQMPn6" },
    { id: 42, img: "/MARROCOS.png", name: "MARROCOS", link: "https://photos.app.goo.gl/9Tv8RAy24FFwxHpG7" },
    { id: 43, img: "/MEXICO.png", name: "MÉXICO", link: "https://photos.app.goo.gl/hddwr1amtDuoAiF76" },
    { id: 44, img: "/NIGERIA.png", name: "NIGÉRIA", link: "https://photos.app.goo.gl/Fgw2Ff6XFTXAQH2j6" },
    { id: 45, img: "/PARAGUAI.png", name: "PARAGUAI", link: "https://photos.app.goo.gl/Q8QZYJunLRd3eJma6" },
    { id: 46, img: "/PERU.png", name: "PERU", link: "https://photos.app.goo.gl/qyNY5YjWgXMiSyhr8" },
    { id: 47, img: "/POLONIA.png", name: "POLÔNIA", link: "https://photos.app.goo.gl/KPVSHwS1CCReQjrs5" },
    { id: 48, img: "/portugal.png", name: "PORTUGAL", link: "https://photos.app.goo.gl/6nkjpM6pMWgsgnQY6" },
    { id: 49, img: "/REPUBLICA-TCHECA.png", name: "REPÚBLICA\nT.", link: "https://photos.app.goo.gl/hTPMwB6FZiS9XTJR8" },
    { id: 50, img: "/ROMENIA.png", name: "ROMÊNIA", link: "https://photos.app.goo.gl/3khrVopsB5hUvzDT8" },
    { id: 51, img: "/SENEGAL.png", name: "SENEGAL", link: "https://photos.app.goo.gl/NT49ebZwkDxnkk6P6" },
    { id: 52, img: "/SERVIA.png", name: "SÉRVIA", link: "https://photos.app.goo.gl/STchj4C6vG4DEpZy7" },
    { id: 53, img: "/SUECIA.png", name: "SUÉCIA", link: "https://photos.app.goo.gl/9HZsDsc1HzM9z1AZ8" },
    { id: 54, img: "/SUICA.png", name: "SUÍÇA", link: "https://photos.app.goo.gl/vWMFqYnWmAdvJmRg8" },
    { id: 55, img: "/TURQUIA.png", name: "TURQUIA", link: "https://photos.app.goo.gl/BnJ86rgQqd6EJW4J7" },
    { id: 56, img: "/URUGUAI.png", name: "URUGUAI", link: "https://photos.app.goo.gl/M35zXFDmM6drbnb8A" },
    { id: 57, img: "/VENEZUELA.png", name: "VENEZUELA", link: "https://photos.app.goo.gl/VFmSGpo4tL22bbP97" },
  ];

  // LÓGICA DE FILTRAGEM (Pesquisa Ignorando Acentos e Maiúsculas/Minúsculas)
  const selecoesFiltradas = selecoesItems.filter(item => {
    const nomeNormalizado = item.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const pesquisaNormalizada = termoPesquisa.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return nomeNormalizado.includes(pesquisaNormalizada);
  });

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 size={40} className="animate-spin text-[#007AFF]" /></div>;

  const whatsAppNumber = catalogo?.whatsapp?.replace(/\D/g, '') || '556793053894';
  const whatsAppLink = `https://wa.me/${whatsAppNumber}`;
  const temaCor = catalogo?.theme_color || '#007AFF';

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-sans relative overflow-x-hidden antialiased" style={{ '--theme': temaCor } as React.CSSProperties}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 blur-[120px] w-full max-w-lg h-80 rounded-full pointer-events-none opacity-20" style={{ backgroundColor: temaCor }} />

      <div className="w-full max-w-sm mx-auto flex flex-col items-center pt-8 px-4 pb-24">
        
        {/* ====== TOPO: SELO ONLINE E AVISO ====== */}
        <div className="flex items-center gap-2.5 bg-white/10 border border-white/20 px-4 py-2 rounded-full mb-6 shadow-md backdrop-blur-sm">
          <div className="w-2.5 h-2.5 bg-[#25D366] rounded-full animate-pulse shadow-[0_0_12px_2px_#25D366]"></div>
          <span className="text-xs font-black text-white tracking-[0.2em]">ONLINE</span>
        </div>
        
        <h2 className="text-[10px] font-bold text-gray-400 tracking-[0.2em] mb-4 uppercase">
          Catálogo Oficial
        </h2>

        {/* LOGO */}
        <div className="w-28 h-28 rounded-full border-2 bg-black p-1 flex items-center justify-center overflow-hidden" style={{ borderColor: temaCor, boxShadow: `0 0 35px ${temaCor}50` }}>
          {catalogo?.logo_url ? <img src={catalogo.logo_url} className="w-full h-full object-cover rounded-full" /> : <img src="/logo.jpg" className="w-full h-full object-contain rounded-full" />}
        </div>
        
        {/* NOME DA LOJA */}
        <h1 className="text-[28px] font-black tracking-tight text-white uppercase mt-5 mb-4 text-center">{catalogo?.store_name || "HYPERKATÁLOGO"}</h1>

        {/* ====== MENSAGEM DE INTERAÇÃO ====== */}
        <div className="flex items-center gap-2 mb-8 bg-white/5 px-4 py-2 rounded-full border border-white/10">
          <MousePointerClick size={16} className="text-[#007AFF] animate-bounce" style={{ color: temaCor }} />
          <span className="text-[10px] font-black text-gray-200 tracking-[0.1em] uppercase">Clique para interagir com a página</span>
        </div>

        {/* ====== FALE CONOSCO E REDES SOCIAIS ====== */}
        <h3 className="text-[11px] font-black tracking-widest text-white uppercase mb-4">FALE CONOSCO:</h3>
        
        <div className="flex items-center gap-4 mb-8">
          {/* INSTAGRAM */}
          {catalogo?.instagram && (
            <a href={catalogo.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/10 bg-[#0d1117] flex items-center justify-center hover:bg-white/10 hover:border-white/30 transition-all shadow-lg text-gray-300 hover:text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
          )}
          
          {/* WHATSAPP */}
          <a href={whatsAppLink} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/10 bg-[#0d1117] flex items-center justify-center hover:bg-white/10 hover:border-white/30 transition-all shadow-lg text-gray-300 hover:text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
          </a>

          {/* TIKTOK SIMPLES */}
          {catalogo?.tiktok && (
            <a href={catalogo.tiktok} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/10 bg-[#0d1117] flex items-center justify-center hover:bg-white/10 hover:border-white/30 transition-all shadow-lg text-gray-300 hover:text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
            </a>
          )}
        </div>

        {/* LINHA DE SEPARAÇÃO COM A COR DO TEMA */}
        <div className="w-24 h-[1px] mb-10" style={{ backgroundImage: `linear-gradient(to right, transparent, ${temaCor}, transparent)` }}></div>

        {/* ====== BOTÕES PRINCIPAIS ====== */}
        <div className="w-full flex flex-col gap-4 px-2 mb-12">
          <button className="w-full h-14 text-white font-bold text-sm rounded-full flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]" style={{ backgroundColor: temaCor, boxShadow: `0 4px 20px ${temaCor}40` }}>
            <Shirt className="w-5 h-5" /> Clique aqui e veja a tabela de medidas
          </button>
          
          <button className="w-full h-14 bg-[#0d1117] border-2 text-white font-bold text-sm rounded-full flex items-center justify-center gap-3 transition-all hover:bg-white/5" style={{ borderColor: `${temaCor}60` }}>
            <Truck className="w-5 h-5" style={{ color: temaCor }} /> Rastreie o seu pedido clicando aqui
          </button>
        </div>

        {/* ====== MENU RÁPIDO ====== */}
        <div className="w-full mb-10 px-2">
          <div className="flex items-center gap-2 mb-5">
            <h3 className="text-xs font-black tracking-widest text-white uppercase leading-[1.3]">MENU RÁPIDO:</h3>
            <div className="h-[1px] flex-grow bg-gradient-to-r to-transparent" style={{ backgroundImage: `linear-gradient(to right, ${temaCor}80, transparent)` }}></div>
          </div>
          
          <div className="relative flex items-center w-full">
            {showMenuLeft && (
              <button onClick={() => scroll(menuRef, 'left')} className="absolute -left-2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-black/80 border border-white/10 text-white backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all cursor-pointer hover:bg-white/20 hover:scale-110 active:scale-95">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <div ref={menuRef} onScroll={() => updateArrows(menuRef, setShowMenuLeft, setShowMenuRight)} className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {categorias.map((cat) => (
                <a key={cat.id} href={cat.link} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 flex-shrink-0 snap-center group">
                  <div className="w-32 h-48 rounded-2xl border-2 overflow-hidden bg-[#0d1117] transition-transform duration-300 group-hover:scale-105 shadow-lg relative" style={{ borderColor: `${temaCor}40` }}>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                    <img src={cat.img} alt={cat.titulo} loading="lazy" className="w-full h-full object-cover relative z-0" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  </div>
                  <span className="text-[9px] font-black uppercase text-center text-gray-400 group-hover:text-white transition-colors tracking-wider mt-1 whitespace-pre-line">
                    {cat.titulo}
                  </span>
                </a>
              ))}
            </div>

            {showMenuRight && (
              <button onClick={() => scroll(menuRef, 'right')} className="absolute -right-2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-black/80 border border-white/10 text-white backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all cursor-pointer hover:bg-white/20 hover:scale-110 active:scale-95">
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* ====== BANNERS GIGANTES ====== */}
        <div className="w-full mb-8 px-2 flex flex-col gap-6">
            
            <a href="https://photos.app.goo.gl/JwKbbiyrnrAv4V9LA" target="_blank" rel="noopener noreferrer" className="w-full rounded-3xl overflow-hidden border-2 transition-transform hover:scale-[1.02] active:scale-[0.98]" style={{ borderColor: `${temaCor}40` }}>
              <img src="/corta-vento.jpg" className="w-full h-auto block" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </a>
            
            <a href="https://photos.app.goo.gl/xHESUJ4F7zd6LjEZ8" target="_blank" rel="noopener noreferrer" className="w-full rounded-3xl overflow-hidden border-2 transition-transform hover:scale-[1.02] active:scale-[0.98]" style={{ borderColor: `${temaCor}40` }}>
              <img src="/retro.jpg" className="w-full h-auto block" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </a>

            {/* NOVO BANNER: ENTREGA RÁPIDA DESCEU PARA CÁ */}
            <div className="w-full rounded-3xl overflow-hidden border-2 transition-transform hover:scale-[1.02] active:scale-[0.98]" style={{ borderColor: `${temaCor}40` }}>
              <img src="/entrega_02.jpg" alt="Entrega Rápida" className="w-full h-auto block" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
        </div>

        {/* ====== BARRA DE PESQUISA (EM CIMA DO BANNER FIFA) ====== */}
        <div className="w-full mb-6 px-2 relative z-20">
          <div className="relative flex items-center w-full h-14 rounded-2xl bg-[#0d1117] border-2 transition-all duration-300 overflow-hidden shadow-lg group focus-within:shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
               style={{ borderColor: isSearching ? temaCor : 'rgba(255,255,255,0.1)' }}>
            <div className="pl-4 pr-3 text-gray-400 group-focus-within:text-white transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Buscar time ou seleção..."
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
              className="flex-grow h-full bg-transparent text-white text-sm font-medium outline-none placeholder:text-gray-500"
            />
            {isSearching && (
              <button onClick={() => setTermoPesquisa('')} className="pr-4 text-gray-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* ====== CONDICIONAL: SE ESTIVER PESQUISANDO, MOSTRA A GRADE (GRID) ====== */}
        {isSearching ? (
          <div className="w-full px-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-sm font-black tracking-widest text-white uppercase mb-6 pl-1">Busca Rápida</h3>
            
            <div className="grid grid-cols-3 gap-y-8 gap-x-3">
              {selecoesFiltradas.length > 0 ? (
                selecoesFiltradas.map((item) => {
                  const urlDestino = item.link || `https://wa.me/${whatsAppNumber}?text=Olá! Gostaria de ver a seleção de ${item.name.replace('\n', ' ')}`;
                  return (
                    <a key={item.id} href={urlDestino} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 group">
                      <div className="w-[72px] h-[72px] rounded-full border-2 bg-[#151515] flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-110 shadow-md" style={{ borderColor: temaCor }}>
                        <img src={item.img} alt={item.name.replace('\n', ' ')} className="w-full h-full object-contain p-[10px]" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      </div>
                      <span className="text-[10px] font-bold text-center text-gray-300 group-hover:text-white transition-colors whitespace-pre-line leading-tight">{item.name}</span>
                    </a>
                  );
                })
              ) : (
                <div className="col-span-3 text-center py-10 text-gray-500 text-sm font-medium bg-[#0d1117] rounded-2xl border border-white/5">
                  Nenhum time ou seleção encontrado.
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ====== LAYOUT NORMAL (APARECE QUANDO A PESQUISA ESTÁ VAZIA) ====== */
          <>
            {/* BANNER FIFA COM ZOOM (scale-110) E BORDAS ARREDONDADAS PERFEITAS */}
            <div className="w-full px-2 mb-10">
              <div className="w-full rounded-3xl overflow-hidden border-2 shadow-lg bg-[#0d1117] flex items-center justify-center relative" style={{ borderColor: `${temaCor}60` }}>
                <img src="/fifa.jpg" alt="FIFA Banner" loading="lazy" className="w-full h-auto block scale-110 origin-center" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
            </div>

            {/* SELEÇÕES HORIZONTAIS */}
            <div className="w-full px-2">
                <div className="flex items-center gap-2 mb-5">
                  <h3 className="text-xs font-black tracking-widest text-white uppercase leading-[1.3]">SELEÇÕES:</h3>
                  <div className="h-[1px] flex-grow bg-gradient-to-r to-transparent" style={{ backgroundImage: `linear-gradient(to right, ${temaCor}80, transparent)` }}></div>
                </div>

                <div className="relative flex items-center w-full">
                  {showSelLeft && (
                    <button onClick={() => scroll(selecoesRef, 'left')} className="absolute -left-2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-black/80 border border-white/10 text-white backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all cursor-pointer hover:bg-white/20 hover:scale-110 active:scale-95">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}

                  <div className="flex overflow-x-auto gap-4 pb-4 w-full [&::-webkit-scrollbar]:hidden snap-x snap-mandatory min-h-[120px]" ref={selecoesRef} onScroll={() => updateArrows(selecoesRef, setShowSelLeft, setShowSelRight)}>
                    {selecoesItems.map((item) => {
                      const urlDestino = item.link || `https://wa.me/${whatsAppNumber}?text=Olá! Gostaria de ver a seleção de ${item.name.replace('\n', ' ')}`;
                      return (
                        <a key={item.id} href={urlDestino} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2.5 min-w-[80px] snap-center group">
                          <div className="w-20 h-20 rounded-full border-2 bg-[#151515] flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 shadow-md" style={{ borderColor: temaCor }}>
                            <img src={item.img} alt={item.name.replace('\n', ' ')} className="w-full h-full object-contain p-2" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          </div>
                          <span className="text-[9px] font-black uppercase text-center text-gray-400 group-hover:text-white transition-colors whitespace-pre-line">{item.name}</span>
                        </a>
                      );
                    })}
                  </div>

                  {showSelRight && (
                    <button onClick={() => scroll(selecoesRef, 'right')} className="absolute -right-2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/80 border border-white/10 text-white backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all cursor-pointer hover:bg-white/20 hover:scale-110 active:scale-95">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
            </div>
          </>
        )}
      </div>

      {/* BOTÃO FLUTUANTE DO WHATSAPP (Sempre Fixo) */}
      <a href={whatsAppLink} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_4px_25px_rgba(37,211,102,0.4)] transition-all hover:scale-110 active:scale-95 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
      </a>

    </div>
  );
}