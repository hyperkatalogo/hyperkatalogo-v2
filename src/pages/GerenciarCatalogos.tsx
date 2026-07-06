import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Trash2, Edit, ExternalLink } from 'lucide-react';

export default function GerenciarCatalogos() {
  const [catalogos, setCatalogos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCatalogos() {
      const { data } = await supabase.from('catalogos').select('*');
      if (data) setCatalogos(data);
      setLoading(false);
    }
    fetchCatalogos();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-400"><Loader2 className="animate-spin inline mr-2" /> Carregando catálogos...</div>;

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-6 text-white">Gerenciamento de Catálogos</h2>
      <div className="bg-[#0d1117] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-white/5 text-xs uppercase text-gray-300">
            <tr>
              <th className="px-6 py-4">Loja</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {catalogos.map((cat) => (
              <tr key={cat.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-6 py-4 font-medium text-white">{cat.store_name}</td>
                <td className="px-6 py-4">{cat.slug}</td>
                <td className="px-6 py-4 flex gap-3">
                  <button className="text-[#007AFF] hover:text-white"><Edit size={16} /></button>
                  <button className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                  <a href={`/catalogo/${cat.slug}`} target="_blank" className="text-gray-400 hover:text-white"><ExternalLink size={16} /></a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}