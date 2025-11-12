// ========== BOTÕES DELETAR ==========
document.addEventListener("click", async (event) => {
  if (event.target.classList.contains("button_delete_element")) {
    const linkDiv = event.target.closest(".link_related_subdiv");
    const id_link = linkDiv?.dataset.id;

    if (id_link) {
      if (confirm("Tem certeza que deseja deletar este link?")) {
        await deletarLink(id_link);
        linkDiv.remove();
        await mostrarQtdLinks(); // atualiza contador
      }
    }
  }
});


// ========== CLICAR NO LINK (futuro uso) ==========
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("element_URL_fitcontent_subdiv")) {
    const urlCurta = event.target.textContent.trim();
    navigator.clipboard.writeText(urlCurta);
    alert("Link copiado!");
  }
});


// ========== LISTAR E CONTAR LINKS ==========
async function mostrarQtdLinks() {
  try {
    const response = await fetch("http://localhost/web-programming-project/database/api/links.php", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Erro ao buscar links: " + response.status);

    const resultado = await response.json();
    if (!resultado.success) throw new Error(resultado.message);

    const links = resultado.links || [];
    const qtdLinks = document.getElementById("profile_links_count_p");

    if (!qtdLinks) return;

    if (links.length === 0) {
      qtdLinks.textContent = "No links created.";
    } else if (links.length === 1) {
      qtdLinks.textContent = "1 link created.";
    } else {
      qtdLinks.textContent = `${links.length} links created.`;
    }

    // Exemplo: renderizar os links numa lista (se quiser)
    const container = document.getElementById("links_container");
    if (container) {
      container.innerHTML = "";
      links.forEach((link) => {
        const div = document.createElement("div");
        div.classList.add("link_related_subdiv");
        div.dataset.id = link.id_link;
        div.innerHTML = `
          <div class="element_URL_fitcontent_subdiv">${link.url_curta}</div>
          <button class="button_delete_element">Delete</button>
        `;
        container.appendChild(div);
      });
    }

  } catch (erro) {
    console.error("Erro ao carregar links:", erro);
  }
}


// ========== CRIAR LINK ==========
async function criarLink() {
  try {
    const urlOriginal = document.getElementById("input_url")?.value?.trim();

    if (!urlOriginal) {
      alert("Digite uma URL válida!");
      return;
    }

    const response = await fetch("http://localhost/web-programming-project/database/api/links.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ url_original: urlOriginal }),
    });

    const data = await response.json();
    console.log(data);

    if (data.success) {
      alert("Link criado com sucesso: " + data.link.url_curta);
      document.getElementById("input_url").value = "";
      await mostrarQtdLinks();
    } else {
      alert("Erro ao criar link: " + data.message);
    }
  } catch (error) {
    console.error("Erro ao criar link:", error);
  }
}


// ========== DELETAR LINK ==========
async function deletarLink(id_link) {
  try {
    const response = await fetch("http://localhost/web-programming-project/database/api/links.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id_link }),
    });

    const data = await response.json();
    console.log(data);

    if (data.success) {
      console.log("Link deletado com sucesso.");
    } else {
      alert("Erro ao deletar link: " + data.message);
    }
  } catch (error) {
    console.error("Erro ao deletar link:", error);
  }
}


// ========== AO CARREGAR A PÁGINA ==========
document.addEventListener("DOMContentLoaded", mostrarQtdLinks);
