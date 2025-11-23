import Cookies from 'js-cookie';

const API_BASE = '/api';

export const auth = {
  // Verifica se existe token
  hasToken: (): boolean => {
    return !!Cookies.get('token');
  },

  // Verifica se o token é válido fazendo uma requisição
  checkAuth: async (): Promise<boolean> => {
    if (!auth.hasToken()) return false;
    
    try {
      const response = await fetch(`${API_BASE}/show-news`, {
        credentials: 'include',
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  // Login
  login: async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Erro ao fazer login' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro de conexão' };
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Continua mesmo com erro
    }
    
    // Remove o cookie forçadamente
    Cookies.remove('token', { path: '/' });
    
    // Limpa storage
    localStorage.clear();
    sessionStorage.clear();
  },
};
