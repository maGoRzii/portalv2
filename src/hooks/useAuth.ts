import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (identifier: string, password: string) => {
    try {
      // First try to sign in with the identifier as is (could be email)
      let { data, error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password,
      });

      // If that fails and the identifier doesn't contain @, try with @jonquera16549.es
      if (error && !identifier.includes('@')) {
        ({ data, error } = await supabase.auth.signInWithPassword({
          email: `${identifier}@jonquera16549.es`,
          password,
        }));
      }

      if (error) {
        if (error.message === 'Invalid login credentials') {
          throw new Error('Credenciales inválidas');
        }
        throw error;
      }

      if (data?.user) {
        setUser(data.user);
        toast.success('¡Bienvenido!');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Error al iniciar sesión');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success('Sesión cerrada');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  return {
    user,
    loading,
    signIn,
    signOut,
  };
}