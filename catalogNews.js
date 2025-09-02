const API_BASE = "https://apijornal.onrender.com";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const main = document.querySelector("#noticias");
    if (!main) throw new Error("Elemento <main> não encontrado");

    const res = await fetch(`${API_BASE}/show-news`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    // Se a API retornar { news: [...] }
    const newsArray = Array.isArray(data) ? data : data.news;

    if (!newsArray) throw new Error("Formato de dados inesperado");

    newsArray.forEach((news) => {
      const root = document.documentElement;
      const cor = getComputedStyle(root).getPropertyValue("--text");

      const msg = document.querySelector("#msg");
      const article = document.createElement("article");
      const div = document.createElement("div");
      const div2 =document.createElement("div")
      const titulo = document.createElement("h1");
      const corpo = document.createElement("p");
      const autor = document.createElement("pre");
      const botaoDelete = document.createElement("button");
      const botaoCopyId = document.createElement("button");


      if (news.image1) {
        const url = news.image1.startsWith("http")
          ? news.image1
          : `${API_BASE}${news.image1}`; // vira https://apijornal.onrender.com/uploads/arquivo.jpg

        const img = document.createElement("img");
        img.src = encodeURI(url); // evita problema com espaços/caracteres especiais
        img.alt = news.title || "Imagem da notícia";
        img.style.maxWidth = "20rem";
        img.style.height = "auto";
        article.appendChild(img);
        article.style.justifyContent = 'space-between'
      }else{
        article.style.justifyContent = 'center'
      }

      article.classList.add("noticia");
      botaoDelete.classList.add("botao");
      botaoDelete.style.marginRight = "1.5rem";
      div.style.marginTop = '2rem'
      article.style.flexDirection = 'row'
      article.style.alignItems = 'center'
      article.style.paddingInline = '6rem'
      botaoCopyId.classList.add("botao");
      autor.style.color = cor;

      titulo.textContent = news.title;
      corpo.innerHTML = news.summary;
      autor.textContent = "-" + news.author;
      botaoDelete.textContent = "remover notícia";
      botaoCopyId.textContent = "copiar ID";

      div.appendChild(botaoDelete);
      div.appendChild(botaoCopyId);
      div2.appendChild(titulo);
      div2.appendChild(corpo);
      div2.appendChild(autor);
      div2.appendChild(div);
      article.appendChild(div2)

      article.style.textAlign = "center";

      main.appendChild(article);

      // evento copiar ID
      botaoCopyId.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(news.id);
          msg.innerHTML = `✅ ID da notícia copiado para área de transferência, agora é possível editar a notícia em questão na página de edição`;
          msg.style.display = "block";

          setTimeout(() => {
            msg.style.display = "none";
          }, 3000);
        } catch (err) {
          msg.innerHTML = "⚠️ Falha para copiar: " + err.message;
          msg.style.display = "block";

          setTimeout(() => {
            msg.style.display = "none";
          }, 3000);
        }
      });

      // ✅ evento deletar notícia (agora dentro do loop)
      botaoDelete.addEventListener("click", async () => {
        try {
          const res = await fetch(
            `${API_BASE}/delete-news/${news.id}`,
            {
              method: "DELETE",
            }
          );
          if (!res.ok) throw new Error("Erro ao deletar a notícia");

          msg.innerHTML = "✅ Notícia deletada com sucesso";
          msg.style.display = "block";
          setTimeout(() => {
            msg.style.display = "none";
          }, 3000);

          // opcional: remover o article do DOM após deletar
          article.remove();
        } catch (err) {
          msg.innerHTML = "⚠️ Erro ao deletar a notícia: " + err.message;
          msg.style.display = "block";
          setTimeout(() => {
            msg.style.display = "none";
          }, 3000);
        }
      });
    });
  } catch (err) {
    const msg = document.querySelector("#msg");
    msg.innerHTML = "⚠️ Erro ao buscar notícias: " + err.message;
    msg.style.display = "block";

    setTimeout(() => {
      msg.style.display = "none";
    }, 3000);
  }
  finally{
    const loader = document.querySelector(".banter-loader")
    loader.style.display = 'none'
  }
});
