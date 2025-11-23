const API_BASE = '/api';

export interface News {
  id: string;
  newstype: 'noticia' | 'cronica' | 'poema' | 'tirinha';
  title: string;
  summary: string;
  author: string;
  body: string;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
}

export interface CreateNewsData {
  newsType: string;
  title: string;
  summary: string;
  author: string;
  body: string;
  images: File[];
}

export interface UpdateNewsData {
  newstype: string;
  summary: string;
  author: string;
  body: string;
}

export const api = {
  // Listar notícias
  getNews: async (): Promise<News[]> => {
    const response = await fetch(`${API_BASE}/show-news`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Erro ao carregar notícias');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.news || [];
  },

  // Criar notícia
  createNews: async (data: CreateNewsData): Promise<void> => {
    const formData = new FormData();
    formData.append('newsType', data.newsType);
    formData.append('title', data.title);
    formData.append('summary', data.summary);
    formData.append('author', data.author);
    formData.append('body', data.body);

    data.images.slice(0, 5).forEach((img, i) => {
      formData.append(`image${i + 1}`, img);
    });

    const response = await fetch(`${API_BASE}/news`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro ao criar notícia' }));
      throw new Error(error.message || 'Erro ao criar notícia');
    }
  },

  // Atualizar notícia
  updateNews: async (id: string, data: UpdateNewsData): Promise<void> => {
    const response = await fetch(`${API_BASE}/update-news/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro ao atualizar' }));
      throw new Error(error.message || 'Erro ao atualizar');
    }
  },

  // Deletar notícia
  deleteNews: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/delete-news/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar notícia');
    }
  },
};
