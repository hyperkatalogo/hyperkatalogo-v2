import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export default function IntroducaoCatalogo() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#090b11] text-white antialiased flex flex-col items-center p-4">
      
      {/* Header com a logo oficial da pasta public */}
      <header className="w-full max-w-md flex items-center justify-between py-6 mb-12">
        <div className="flex items-center gap-3">
          {/* Logo oficial puxada da pasta public */}
          <div className="w-10 h-10 rounded-full border border-white/10 bg-black p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img 
              src="/logo.jpg" 
              alt="HyperKatalogo" 
              className="w-full h-full object-contain rounded-full scale-110"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          <span className="font-medium tracking-wide">HyperKatalogo</span>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 transition-all text-xs font-medium"
        >
          <LogOut size={14} /> Sair
        </button>
      </header>

      {/* Título e subtítulo da introdução */}
      <h1 className="text-3xl md:text-4xl font-normal tracking-tight mb-4 text-center">Vamos criar seu catálogo!</h1>
      <p className="text-gray-400 text-sm max-w-xs text-center leading-relaxed mb-16">
        Em menos de 2 minutos você terá um catálogo digital personalizado com o link pronto para compartilhar.
      </p>

      {/* Lista numerada de seções */}
      <div className="w-full max-w-md flex flex-col gap-4 mb-12">
        
        <div className="bg-[#161b26] border border-white/5 rounded-2xl p-4 flex items-center gap-5">
          <div className="w-10 h-10 rounded-full bg-[#0d1117] border border-white/10 flex items-center justify-center text-gray-300 font-medium flex-shrink-0 text-sm">1</div>
          <div className="flex flex-col">
            <span className="text-base font-normal tracking-wide">identidade</span>
            <span className="text-xs text-gray-500 mt-0.5">Nome da loja, WhatsApp</span>
          </div>
        </div>

        <div className="bg-[#161b26] border border-white/5 rounded-2xl p-4 flex items-center gap-5">
          <div className="w-10 h-10 rounded-full bg-[#0d1117] border border-white/10 flex items-center justify-center text-gray-300 font-medium flex-shrink-0 text-sm">2</div>
          <div className="flex flex-col">
            <span className="text-base font-normal tracking-wide">Visual</span>
            <span className="text-xs text-gray-500 mt-0.5">Cor de destaque do catálogo</span>
          </div>
        </div>

        <div className="bg-[#161b26] border border-white/5 rounded-2xl p-4 flex items-center gap-5">
          <div className="w-10 h-10 rounded-full bg-[#0d1117] border border-white/10 flex items-center justify-center text-gray-300 font-medium flex-shrink-0 text-sm">3</div>
          <div className="flex flex-col">
            <span className="text-base font-normal tracking-wide">Módulos</span>
            <span className="text-xs text-gray-500 mt-0.5">Ative categorias e links úteis</span>
          </div>
        </div>

        <div className="bg-[#161b26] border border-white/5 rounded-2xl p-4 flex items-center gap-5">
          <div className="w-10 h-10 rounded-full bg-[#0d1117] border border-white/10 flex items-center justify-center text-gray-300 font-medium flex-shrink-0 text-sm">4</div>
          <div className="flex flex-col">
            <span className="text-base font-normal tracking-wide">ligas</span>
            <span className="text-xs text-gray-500 mt-0.5">Escolha quais ligas aparecem</span>
          </div>
        </div>

        <div className="bg-[#161b26] border border-white/5 rounded-2xl p-4 flex items-center gap-5">
          <div className="w-10 h-10 rounded-full bg-[#0d1117] border border-white/10 flex items-center justify-center text-gray-300 font-medium flex-shrink-0 text-sm">5</div>
          <div className="flex flex-col">
            <span className="text-base font-normal tracking-wide">Preços</span>
            <span className="text-xs text-gray-500 mt-0.5">informe os valores dos produtos</span>
          </div>
        </div>

      </div>

      {/* Botão de ação inicial */}
      <button 
        onClick={() => navigate('/formulario')}
        className="w-full max-w-md h-14 bg-[#22c55e] hover:bg-[#16a34a] text-white font-medium text-base rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(34,197,94,0.2)] transition-all active:scale-[0.98]"
      >
        Começar agora
      </button>

    </div>
  );
}