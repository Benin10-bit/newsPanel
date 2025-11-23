import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/auth';
import { Newspaper, Loader2 } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Auto-login: verifica se já existe token válido
  useEffect(() => {
    const checkExistingAuth = async () => {
      const isAuthenticated = await auth.checkAuth();
      if (isAuthenticated) {
        navigate('/dashboard', { replace: true });
      }
      setChecking(false);
    };

    checkExistingAuth();
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha usuário e senha",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const result = await auth.login(username.trim(), password);

    if (result.success) {
      toast({
        title: "Login realizado!",
        description: "Redirecionando...",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Erro ao fazer login",
        description: result.error || "Verifique suas credenciais",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  // Mostra loading enquanto verifica autenticação
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-xl p-8 shadow-card">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
              <Newspaper className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Painel de Notícias</h1>
            <p className="text-muted-foreground">Acesse o sistema administrativo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-accent font-medium">
                Usuário
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                disabled={loading}
                className="bg-input border-border focus:border-accent transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-accent font-medium">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                disabled={loading}
                className="bg-input border-border focus:border-accent transition-colors"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-11"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
