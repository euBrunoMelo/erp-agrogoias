'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-12 text-center animate-fadeIn">
            {/* Logo/Título */}
            <div className="mb-8">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 animate-slideDown">
                Olá Mundo
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                Bem-vindo ao ERP AgroGoiás
              </p>
              <p className="text-sm text-gray-500">
                Sistema de Gestão para Propriedades Rurais
              </p>
            </div>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-50 border-2 border-green-200 rounded-full mb-8 animate-fadeIn">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-green-700 font-semibold">Sistema Online</span>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                <div className="text-3xl mb-2">🌾</div>
                <div className="text-sm font-semibold text-gray-700">Gestão de Cultivos</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-sm font-semibold text-gray-700">Análises</div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-sm font-semibold text-gray-700">Financeiro</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Acessar Dashboard
              </Link>
              <Link
                href="/auth/login"
                className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
              >
                Fazer Login
              </Link>
            </div>

            {/* Footer Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <span className="text-green-500">●</span>
                  <span>Supabase</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-blue-500">●</span>
                  <span>Next.js</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-purple-500">●</span>
                  <span>Vercel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-in;
        }

        .animate-slideDown {
          animation: slideDown 0.8s ease-out;
        }
      `}</style>
    </main>
  )
}

