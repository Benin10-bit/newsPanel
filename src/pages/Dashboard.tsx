import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Newspaper, LogOut, PlusCircle, List } from 'lucide-react';
import CreateNews from '@/components/CreateNews';
import NewsList from '@/components/NewsList';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-card border-b border-border shadow-md"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Newspaper className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Painel de Notícias</h1>
                <p className="text-sm text-muted-foreground">Sistema de gerenciamento</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              disabled={loading}
              variant="destructive"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-card border border-border h-auto p-1">
              <TabsTrigger 
                value="create" 
                className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground py-2.5"
              >
                <PlusCircle className="w-4 h-4" />
                Criar
              </TabsTrigger>
              <TabsTrigger 
                value="list" 
                className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground py-2.5"
              >
                <List className="w-4 h-4" />
                Listar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="mt-0">
              <CreateNews />
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              <NewsList />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
