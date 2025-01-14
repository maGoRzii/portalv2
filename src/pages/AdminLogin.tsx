import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { BackHomeButton } from '../components/BackHomeButton';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await signIn(email, password);
      if (success) {
        navigate('/admin', { replace: true });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      toast.error('Credenciales inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <BackHomeButton />
      
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-gradient-to-b from-white to-gray-50 p-8 rounded-lg border border-gray-200">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-lg bg-gradient-subtle">
              <Lock className="h-6 w-6 text-white stroke-[1.5]" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-light text-gray-900">
              Acceso Administrador
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Ingresa tus credenciales para acceder al panel
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  className="appearance-none rounded-t-lg relative block w-full px-3 py-2 border 
                           border-gray-300 placeholder-gray-500 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:z-10 
                           sm:text-sm"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Contraseña</label>
                <input
                  id="password"
                  type="password"
                  required
                  className="appearance-none rounded-b-lg relative block w-full px-3 py-2 border 
                           border-gray-300 placeholder-gray-500 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:z-10 
                           sm:text-sm"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent
                       text-sm font-medium rounded-lg text-white bg-gradient-subtle hover:bg-gradient-subtle-hover
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900
                       disabled:opacity-50 transition-all duration-200"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}