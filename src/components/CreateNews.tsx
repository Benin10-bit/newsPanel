import { useState, FormEvent, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { Upload, X, Loader2, FileText, Image as ImageIcon } from 'lucide-react';

const NEWS_TYPES = [
  { value: 'noticia', label: '📰 Notícia', icon: '📰' },
  { value: 'cronica', label: '📝 Crônica', icon: '📝' },
  { value: 'poema', label: '✍️ Poema', icon: '✍️' },
  { value: 'tirinha', label: '🎨 Tirinha', icon: '🎨' },
];

const CreateNews = () => {
  const [newsType, setNewsType] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [author, setAuthor] = useState('');
  const [body, setBody] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageChange = (files: FileList | null) => {
    if (!files) return;

    const newImages = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, 5 - images.length);
    
    if (images.length + newImages.length > 5) {
      toast({
        title: "Limite de imagens",
        description: "Máximo de 5 imagens permitidas",
        variant: "destructive",
      });
      return;
    }

    const newPreviews = newImages.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newImages]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!newsType || !title.trim() || !summary.trim() || !author.trim() || !body.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await api.createNews({
        newsType,
        title: title.trim(),
        summary: summary.trim(),
        author: author.trim(),
        body: body.trim(),
        images,
      });

      toast({
        title: "Notícia criada!",
        description: "A notícia foi publicada com sucesso",
      });

      // Limpar formulário
      setNewsType('');
      setTitle('');
      setSummary('');
      setAuthor('');
      setBody('');
      setImages([]);
      previews.forEach(url => URL.revokeObjectURL(url));
      setPreviews([]);
    } catch (error) {
      toast({
        title: "Erro ao criar notícia",
        description: error instanceof Error ? error.message : "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card border border-border rounded-xl p-6 shadow-card"
    >
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-bold text-foreground">Nova Notícia</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="newsType" className="text-accent font-medium">
            Tipo *
          </Label>
          <Select value={newsType} onValueChange={setNewsType}>
            <SelectTrigger className="bg-input border-border focus:border-accent">
              <SelectValue placeholder="Selecione o tipo..." />
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
          <Label htmlFor="title" className="text-accent font-medium">
            Título *
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite o título da notícia"
            disabled={loading}
            className="bg-input border-border focus:border-accent"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary" className="text-accent font-medium">
            Resumo *
          </Label>
          <Textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Escreva um breve resumo"
            disabled={loading}
            className="bg-input border-border focus:border-accent min-h-24 resize-y"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="author" className="text-accent font-medium">
            Autor *
          </Label>
          <Input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Nome do autor"
            disabled={loading}
            className="bg-input border-border focus:border-accent"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body" className="text-accent font-medium">
            Corpo do texto *
          </Label>
          <Textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Conteúdo completo da notícia"
            disabled={loading}
            className="bg-input border-border focus:border-accent min-h-40 resize-y"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-accent font-medium">
            Imagens (máx. 5)
          </Label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleImageChange(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
              dragOver 
                ? 'border-accent bg-accent/5' 
                : 'border-border bg-input hover:border-accent hover:bg-accent/5'
            }`}
          >
            <ImageIcon className="w-12 h-12 mx-auto mb-3 text-accent" />
            <p className="text-foreground font-medium mb-1">Clique ou arraste imagens</p>
            <p className="text-sm text-muted-foreground">PNG, JPG até 5 arquivos</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageChange(e.target.files)}
              className="hidden"
            />
          </div>

          {previews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
              {previews.map((preview, i) => (
                <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-border">
                  <img src={preview} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-11"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando...
            </>
          ) : (
            'Criar Notícia'
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default CreateNews;
