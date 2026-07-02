import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Se der certo, manda para o Dashboard
      navigate('/dashboard');

    } catch (error: any) {
      console.error('Erro no login:', error);
      alert('E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#090b11] text-white flex flex-col items-center justify-center p-4 antialiased">
      
      <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl font-medium tracking-tight mb-2">HyperKatalogo</h1>
        <p className="text-gray-400 text-lg">Acesse seu painel para gerenciar seu catálogo</p>
      </div>

      <div className="w-full max-w-[440px] bg-[#161b26] rounded-[32px] p-10 shadow-2xl border border-white/5 animate-in fade-in zoom-in duration-500">
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-1">Entrar</h2>
          <p className="text-gray-400 text-sm">Use seu e-mail e senha</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          
          <div className="flex flex-col gap-2">
            <label className="text-base font-medium text-gray-200">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@exemplo.com"
              required
              className="w-full h-14 bg-[#0d1117] border border-white/10 rounded-2xl px-5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#4c82f7] transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base font-medium text-gray-200">Senha</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-14 bg-[#0d1117] border border-white/10 rounded-2xl px-5 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#4c82f7] transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 mt-4 bg-[#4c82f7] text-white font-semibold text-lg rounded-2xl flex items-center justify-center gap-2 transition-all hover:bg-[#3b6edb] active:scale-[0.98] shadow-lg shadow-blue-500/10 disabled:opacity-50"
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : 'Entrar'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-400 text-sm">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="text-[#4c82f7] hover:underline font-medium">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}