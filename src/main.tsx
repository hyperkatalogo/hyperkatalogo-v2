import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import Cadastro from './pages/Cadastro.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Formulario from './pages/Formulario.tsx'
import IntroducaoCatalogo from './pages/IntroducaoCatálogo.tsx'
import Catalogo from './pages/Catalogo'
import EditarCatalogo from './pages/EditarCatalogo.tsx'
import GerenciarCatalogos from './pages/GerenciarCatalogos.tsx'

// 1. IMPORTAÇÃO DA PÁGINA ADMIN
import AdminLayout from './pages/AdminLayout.tsx'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/catalogo-intro" element={<IntroducaoCatalogo />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/catalogo/:id" element={<Catalogo />} />
        <Route path="/editar/:id" element={<EditarCatalogo />} />
        <Route path="/admin/catalogos" element={<GerenciarCatalogos />} />

        {/* 2. A ROTA DO PAINEL ADMINISTRATIVO */}
        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
