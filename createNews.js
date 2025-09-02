document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#formNews");
  const msgEl = form.querySelector("span[aria-live]");
  const submitBtn = form.querySelector("button[type='submit']");
  const imagensInput = document.querySelector("#imagens");

  // Criar container para pré-visualizar imagens
  const previewContainer = document.createElement("div");
  previewContainer.style.display = "flex";
  previewContainer.style.gap = "0.5rem";
  previewContainer.style.flexWrap = "wrap";
  imagensInput.parentNode.insertBefore(previewContainer, imagensInput.nextSibling);

  // Pré-visualização das imagens selecionadas
  imagensInput.addEventListener("change", () => {
    previewContainer.innerHTML = "";
    const files = imagensInput.files;
    for (let i = 0; i < files.length && i < 5; i++) {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(files[i]);
      img.style.width = "100px";
      img.style.height = "100px";
      img.style.objectFit = "cover";
      img.style.border = "1px solid #ccc";
      previewContainer.appendChild(img);
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.querySelector("#titulo").value.trim();
    const resumo = document.querySelector("#resumo").value.trim();
    const autor = document.querySelector("#autor").value.trim();
    const corpo = document.querySelector("#corpo").value.trim();
    const imagens = imagensInput.files;

    msgEl.textContent = "";
    msgEl.style.color = "";

    // Criar FormData
    const formData = new FormData();
    formData.append("title", titulo);
    formData.append("summary", resumo);
    formData.append("author", autor);
    formData.append("body", corpo);

    // Adicionar até 5 imagens em campos separados
    for (let i = 0; i < imagens.length && i < 5; i++) {
      formData.append(`image${i + 1}`, imagens[i]);
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Enviando...";

    try {
      const response = await fetch("https://apijornal.onrender.com/news", {
        method: "POST",
        body: formData,
      });

      let data;
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        msgEl.style.color = "red";
        msgEl.textContent = `❌ Erro ${response.status}: ${data.message || data}`;
        console.error("Erro do servidor:", data);
      } else {
        msgEl.style.color = "green";
        msgEl.textContent = "✅ Notícia criada com sucesso!";
        console.log("Resposta:", data);
        form.reset();
        previewContainer.innerHTML = "";
      }
    } catch (err) {
      console.error("Erro de rede:", err);
      msgEl.style.color = "red";
      msgEl.textContent = "❌ Erro de conexão (possível CORS ou servidor offline).";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
});
