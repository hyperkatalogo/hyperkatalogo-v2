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

// 1. IMPORTAÇÃO DA NOVA PÁGINA AQUI
import EditarCatalogo from './pages/EditarCatalogo.tsx'

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
        
        {/* 2. A ROTA DE EDIÇÃO LIGADA AQUI */}
        <Route path="/editar/:id" element={<EditarCatalogo />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)