import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { api, News } from '@/lib/api';
import { X, Loader2, Edit } from 'lucide-react';

const NEWS_TYPES = [
  { value: 'noticia', label: '📰 Notícia' },
  { value: 'cronica', label: '📝 Crônica' },
  { value: 'poema', label: '✍️ Poema' },
  { value: 'tirinha', label: '🎨 Tirinha' },
];

interface EditNewsModalProps {
  news: News;
  onClose: () => void;
  onSuccess: () => void;
}

const EditNewsModal = ({ news, onClose, onSuccess }: EditNewsModalProps) => {
  const [newsType, setNewsType] = useState<string>(news.newstype);
  const [summary, setSummary] = useState(news.summary);
  const [author, setAuthor] = useState(news.author);
  const [body, setBody] = useState(news.body);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!newsType || !summary.trim() || !author.trim() || !body.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await api.updateNews(news.id, {
        newstype: newsType as any,
        summary: summary.trim(),
        author: author.trim(),
        body: body.trim(),
      });

      toast({
        title: "Notícia atualizada!",
        description: "As alterações foram salvas com sucesso",
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: error instanceof Error ? error.message : "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card border border-border rounded-xl p-6 shadow-card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Edit className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">Editar Notícia</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="edit-newsType" className="text-accent font-medium">
                Tipo *
              </Label>
              <Select value={newsType} onValueChange={setNewsType}>
                <SelectTrigger className="bg-input border-border focus:border-accent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NEWS_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-title" className="text-accent font-medium">
                Título
              </Label>
              <Input
                id="edit-title"
                value={news.title}
                disabled
                className="bg-muted border-border cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">O título não pode ser editado</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-summary" className="text-accent font-medium">
                Resumo *
              </Label>
              <Textarea
                id="edit-summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                disabled={loading}
                className="bg-input border-border focus:border-accent min-h-24 resize-y"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-author" className="text-accent font-medium">
                Autor *
              </Label>
              <Input
                id="edit-author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                disabled={loading}
                className="bg-input border-border focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-body" className="text-accent font-medium">
                Corpo do texto *
              </Label>
              <Textarea
                id="edit-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                disabled={loading}
                className="bg-input border-border focus:border-accent min-h-40 resize-y"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-11"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
              <Button
                type="button"
                onClick={onClose}
                disabled={loading}
                variant="outline"
                className="border-border hover:bg-muted"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditNewsModal;
