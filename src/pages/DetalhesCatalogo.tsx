import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Save, ArrowLeft } from 'lucide-react';

export default function DetalhesCatalogo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [catalogo, setCatalogo] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('catalogos').select('*').eq('id', id).single();
      (data);
    }
    load();
  }, [id]);

  async function handleSave() {
    await supabase.from('catalogos').update(catalogo).eq('id', id);
    alert('Alterações salvas!');
  }

  if (!catalogo) return <div>Carregando...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto text-white">
      <button onClick={() => navigate(-1)} className="flex items-center mb-6 text-gray-400 hover:text-white">
        <ArrowLeft className="mr-2" /> Voltar
      </button>
      
      <h2 className="text-2xl font-bold mb-6">Editar {catalogo.store_name}</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Nome da Loja</label>
          <input 
            className="w-full bg-[#1a1f2e] p-3 rounded-lg border border-white/10"
            value={catalogo.store_name}
            onChange={(e) => setCatalogo({...catalogo, store_name: e.target.value})}
          />
        </div>
        
        <button onClick={handleSave} className="flex items-center bg-[#007AFF] px-6 py-2 rounded-lg font-bold hover:bg-blue-600">
          <Save className="mr-2" size={18} /> Salvar Alterações
        </button>
      </div>
    </div>
  );
}