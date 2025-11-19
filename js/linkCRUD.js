// ========== CREATE DO LINK ==========
async function criarLink() {
  try {
    const urlOriginal = document.getElementById("input_url")?.value?.trim();

    if (!urlOriginal) {
      alert("Digite uma URL válida!");
      return;
    }

    const response = await fetch("database/api/links.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ url_original: urlOriginal })
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


// ========== READ DO LINK ==========
async function renderizarLinks() {
  try {
    const response = await fetch("database/api/links.php", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Erro ao buscar links: " + response.status);

    const resultado = await response.json();
    if (!resultado.success) throw new Error(resultado.message);

    const links = resultado.links || [];
    const container = document.getElementById("links_container");
    if (!container) return;

    container.innerHTML = "";

    links.forEach((link) => {
      const div = document.createElement("div");
      div.classList.add("link_summary_div", "link_related_subdiv");
      div.dataset.id = link.id_link;

      const tagsHTML = link.tags
        ? link.tags.map((tag) => `<span>${tag}</span>`).join("")
        : "";

      div.innerHTML = `
        <div class="element_URL_subdiv">
          <div class="element_URL_fitcontent_subdiv">
            <span></span>
            <p class="short_link_URL dashboard_link_URL">${link.url_curta}</p>
            <p class="long_link_URL dashboard_link_URL">${link.url_original}</p>
            <span></span>
          </div>
          <div class="element_tags_subdiv">
            ${tagsHTML}
          </div>
        </div>
        <div class="element_CRUD_subdiv">
          <button class="button_CRUD button_delete_element" onclick="${link.id_link}"><span></span>Delete</button>
          <button class="button_CRUD button_edit_element"><span></span>Edit</button>
        </div>
      `;

      container.appendChild(div);
    });

  } catch (erro) {
    console.error("Erro ao renderizar links:", erro);
  }
}

// ========== AUXILIARES DO READ (COPIAR LINK) ==========
document.addEventListener('click', (e) => {
  const div = e.target.closest('.element_URL_fitcontent_subdiv');
  if (!div) return;

  const shortEl = div.querySelector('.short_link_URL');
  const shortLink = shortEl ? shortEl.textContent.trim() : '';

  if (!shortLink) {
    console.warn('Elemento .short_link_URL não encontrado ou vazio dentro da subdiv.');
    return;
  }

  navigator.clipboard.writeText(shortLink)
});

// lista e conta os links
async function mostrarQtdLinks() {
  try {
    const response = await fetch("database/api/links.php", {
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

  } catch (erro) {
    console.error("Erro ao carregar links:", erro);
  }
}

// ========== CLICAR NO LINK (futuro uso) ==========
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("element_URL_fitcontent_subdiv")) {
    const urlCurta = event.target.textContent.trim();
    navigator.clipboard.writeText(urlCurta);
    alert("Link copiado!");
  }
});


// ========== UPDATE DO LINK (ALGUÉM TEM QUE FAZER) ==========
// ========== UPDATE DO LINK (ALGUÉM TEM QUE FAZER) ==========
// ========== UPDATE DO LINK (ALGUÉM TEM QUE FAZER) ==========


// ========== DELETE DO LINK ==========
async function deletarLink(id_link) {
  try {
    const response = await fetch("database/api/links.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id_link })
    });

    const data = await response.json();
    console.log(data);

    if (!data.success) {
      alert("Erro ao deletar link: " + data.message);
    }
  } catch (error) {
    console.error("Erro ao deletar link:", error);
  }
}

// ========== AUXILIARES DO DELETE (BOTÃO DE DELETAR) ==========
document.addEventListener("click", async (event) => {
  if (event.target.classList.contains("button_delete_element")) {
    const linkDiv = event.target.closest(".link_related_subdiv");
    const id_link = linkDiv?.dataset.id;

    if (id_link) {
      if (confirm("Tem certeza que deseja deletar este link?")) {
        await deletarLink(id_link);
        linkDiv.remove();
        await mostrarQtdLinks();
      }
    }
  }
});


// ========== AO CARREGAR A PÁGINA ==========
document.addEventListener("DOMContentLoaded", () => {
  mostrarQtdLinks();
  renderizarLinks();
});
