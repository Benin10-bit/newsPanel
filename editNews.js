document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#formNews");
  const msgEl = form.querySelector("span[aria-live]"); // pega o span do form
  const submitBtn = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // pega valores dos campos
    const resumo = document.querySelector("#resumo").value.trim();
    const autor = document.querySelector("#autor").value.trim();
    const corpo = document.querySelector("#corpo").value.trim();
    const id = document.querySelector("#id").value.trim()

    // limpa mensagem anterior
    msgEl.textContent = "";
    msgEl.style.color = "";

    const news = {
      summary: resumo,
      author: autor,
      body: corpo,
    };

    // bloqueia botão
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Editando...";

    try {
      const response = await fetch(`https://apijornal.onrender.com/update-news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(news),
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
        msgEl.textContent = "✅ Notícia editada com sucesso!";
        console.log("Resposta:", data);
        form.reset();
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
