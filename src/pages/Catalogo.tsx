import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Deixei apenas as seleções para o teste
const SELECOES_ITEMS = [
  { id: 9, img: "/BRASIL.png", name: "BRASIL", link: "https://photos.app.goo.gl/caB7TJKQgLvpZLwk6" },
  { id: 4, img: "/ARGENTINA.png", name: "ARGENTINA", link: "https://photos.app.goo.gl/eAmjsAuosWDhkDHd8" },
  { id: 27, img: "/FRANÇA.png", name: "FRANÇA", link: "https://photos.app.goo.gl/LxP2avYb8EEvxevWA" },
  { id: 34, img: "/inglaterra.png", name: "INGLATERRA", link: "https://photos.app.goo.gl/5ACbDwoS4tEiZPSa6" },
  { id: 48, img: "/portugal.png", name: "PORTUGAL", link: "https://photos.app.goo.gl/6nkjpM6pMWgsgnQY6" },
  { id: 1, img: "/ALEMANHA.png", name: "ALEMANHA", link: "https://photos.app.goo.gl/iU92iRfttVxHjzV67" },
];

export default function Catalogo() {
  const { id } = useParams(); 
  const [catalogo, setCatalogo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const selecoesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchCatalogo() {
      try {
        let { data, error } = await supabase.from('catalogos').select('*').eq('slug', id).single();
        if (error || !data) {
          const { data: fallbackData } = await supabase.from('catalogos').select('*').eq('id', id).single();
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

  if (loading) return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-center">
      <p>Carregando teste...</p>
    </div>
  );

  const temaCor = catalogo?.theme_color || '#007AFF';

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white pt-10 px-4 pb-28">
      <div className="w-full max-w-sm mx-auto flex flex-col items-center">
        
        {/* TOPO SIMPLES */}
        <div className="flex items-center gap-2.5 bg-[#111] border border-white/10 px-4 py-2 rounded-full mb-8">
          <div className="w-2.5 h-2.5 bg-[#25D366] rounded-full"></div>
          <span className="text-xs font-black">ONLINE</span>
        </div>

        <div className="w-28 h-28 rounded-full border-[3px] bg-black overflow-hidden mb-6" style={{ borderColor: temaCor }}>
          <img src={catalogo?.logo_url || "/logo.jpg"} alt="Logo" className="w-full h-full object-cover" />
        </div>
        
        <h1 className="text-[28px] font-black tracking-tight uppercase mb-10 text-center">
          {catalogo?.store_name || "TESTE SAFARI"}
        </h1>

        {/* LISTA DE SELEÇÕES PURA */}
        <div className="w-full px-2">
          <h3 className="text-xs font-black tracking-widest text-white uppercase mb-5">SELEÇÕES:</h3>
          
          <div className="flex overflow-x-auto gap-4 pb-4 w-full" ref={selecoesRef}>
            {SELECOES_ITEMS.map((item) => (
              <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2.5 min-w-[80px]">
                <div className="w-20 h-20 rounded-full border-[3px] bg-[#151515] flex items-center justify-center overflow-hidden" style={{ borderColor: temaCor }}>
                  <img src={item.img} alt={item.name} className="w-full h-full object-contain p-2" />
                </div>
                <span className="text-[9px] font-black uppercase text-center text-gray-400 whitespace-pre-line">{item.name}</span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}