// Função adaptada para gerar link via API PHP
async function gerarLink() {
	const output_div = document.getElementById('output-link_encurtado');
	const input_link = document.getElementById('input-link_encurtado').value;

	const output_p = output_div.querySelector('p');
	const output_img = output_div.querySelector('img');

	// Validação básica
	if (!input_link.trim()) {
		alert('Por favor, insira uma URL');
		return;
	}

	// Validação de URL
	try {
		new URL(input_link);
	} catch (e) {
		alert('URL inválida. Use o formato: https://exemplo.com');
		return;
	}

	try {
		// Chama a API para criar o link
		const response = await fetch('database/api/links.php', {
			method: 'POST',
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({
				url_original: input_link
			})
		});

		const data = await response.json();

		if (data.success) {
			// Usa a URL curta retornada pela API
			const output_str = data.link.url_curta;

			output_div.classList.remove('show');
			void output_div.offsetWidth;
			output_div.classList.add('show');

			setTimeout(() => { output_p.textContent = output_str }, 550);
			setTimeout(() => { output_img.style = 'display: inline-block;' }, 550);

			// Limpa o input
			document.getElementById('input-link_encurtado').value = '';
		} else {
			alert('Erro ao gerar link: ' + data.message);
		}

	} catch (error) {
		console.error('Erro:', error);
		alert('Erro ao conectar com o servidor');
	}
}

// Mantém a funcionalidade de copiar
const botaoCopiar = document.getElementById('botao_copiar_link');

botaoCopiar.addEventListener('click', () => {
	const output_p = document.getElementById('output-link_encurtado-p').textContent;
	if (!output_p) {
		return;
	}

	navigator.clipboard.writeText(output_p);
});


async function atualizarNavBar() {
  try {
    const response = await fetch("database/api/checkSession.php", {
      credentials: "include",
    });

    const data = await response.json();
    const nav = document.querySelector("nav");
    if (!nav) return;

    // Remove o botão anterior (sign in / sign out)
    const antigo = nav.querySelector(".nav_bar_elemento.sign");
    if (antigo) antigo.remove();

    // Cria o novo elemento
    const div = document.createElement("div");
    div.classList.add("nav_bar_elemento", "sign");
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = data.loggedIn ? "Sign out" : "Sign in";
    div.appendChild(a);

    const span = document.createElement("span");
    span.classList.add("nav_bar_animacao");
    div.appendChild(span);

    // Insere na barra
    nav.insertBefore(div, nav.children[1]);

    // Define comportamento
    if (data.loggedIn) {
      a.addEventListener("click", async (e) => {
        e.preventDefault();
        await fetch("database/api/logout.php", {
          method: "POST",
          credentials: "include",
        });
        window.location.href = "signin.html";
      });
    } else {
      a.href = "signin.html";
    }
  } catch (err) {
    console.error("Erro ao atualizar navbar:", err);
  }
}

atualizarNavBar();


document.addEventListener("DOMContentLoaded", atualizarNavBar)