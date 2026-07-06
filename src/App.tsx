import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import Formulario from './pages/Formulario';
import Catalogo from './pages/Catalogo';
import EditarCatalogo from './pages/EditarCatalogo';
import AdminLayout from './pages/AdminLayout'; // Importação do painel Admin

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/formulario" element={<Formulario />} />
      <Route path="/editar/:id" element={<EditarCatalogo />} />
      
      {/* 1. ROTA EXCLUSIVA DO SUPER ADMIN */}
      <Route path="/admin" element={<AdminLayout />} />
      <Route path="/admin/*" element={<AdminLayout />} />

      {/* 2. ROTA DOS CATÁLOGOS DOS CLIENTES */}
      <Route path="/catalogo/:id" element={<Catalogo />} />
      
      <Route path="*" element={<Login />} />
    </Routes>
  );
}