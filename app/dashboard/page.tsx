'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Dashboard() {
  const [user] = useState({
    name: 'Usuário Demo',
    role: 'PRODUCER'
  })

  const stats = [
    { label: 'Propriedades', value: '0', icon: '🏞️', color: 'blue' },
    { label: 'Talhões', value: '0', icon: '📐', color: 'green' },
    { label: 'Cultivos Ativos', value: '0', icon: '🌾', color: 'yellow' },
    { label: 'Área Total', value: '0 ha', icon: '📏', color: 'purple' },
  ]

  const modules = [
    { name: 'Propriedades', icon: '🏞️', href: '/dashboard/properties', description: 'Gerencie suas propriedades rurais' },
    { name: 'Talhões', icon: '📐', href: '/dashboard/plots', description: 'Controle de talhões e áreas' },
    { name: 'Cultivos', icon: '🌾', href: '/dashboard/crops', description: 'Gestão de cultivos e safras' },
    { name: 'Insumos', icon: '🧪', href: '/dashboard/inputs', description: 'Controle de estoque' },
    { name: 'Maquinários', icon: '🚜', href: '/dashboard/equipment', description: 'Gestão de equipamentos' },
    { name: 'Financeiro', icon: '💰', href: '/dashboard/financial', description: 'Análise financeira' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AgroGoiás ERP
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Olá, {user.name}</span>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">Bem-vindo ao Dashboard! 👋</h1>
          <p className="text-blue-100">Gerencie sua propriedade rural de forma inteligente e eficiente</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{stat.icon}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${stat.color}-100 text-${stat.color}-700`}>
                  Novo
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Modules Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Módulos do Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <Link
                key={index}
                href={module.href}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-105 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {module.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {module.name}
                </h3>
                <p className="text-sm text-gray-500">{module.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Ações Rápidas</h2>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              + Nova Propriedade
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              + Novo Talhão
            </button>
            <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              + Registrar Cultivo
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              + Adicionar Insumo
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

