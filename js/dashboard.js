const botoesDelete = document.querySelectorAll('.button_delete_element');

botoesDelete.forEach(botao => {
	botao.addEventListener('click', () => {
		const linkParaDeletar = botao.closest('.link_related_subdiv');

		if (linkParaDeletar) {
			linkParaDeletar.remove();
		}
	});
});


const elementosURLSubdiv = document.querySelectorAll('.element_URL_fitcontent_subdiv');

elementosURLSubdiv.forEach(elemento => {
	elemento.addEventListener('click', () => {

	});
});

async function mostrarQtdLinks(){
	var promise = await fetch("database/api/tags.php",
		{method: "GET"}
	);

	var resultado = await promise.json();

	
	const qtdLinks = document.getElementById('profile_links_count_p');
	if(qtdLinks == 0){
		qtdLinks.innerHTML = "No links created.";
	}
	else if(qtdLinks == 1){
		qtdLinks.innerHTML = "1 link created.";
	} else {
		qtdLinks.innerHTML = resultado + " links created.";
	}
}
mostrarQtdLinks();


// Código para verificar se usuário está logado
document.addEventListener('DOMContentLoaded', () => {
  const loggedInText = document.getElementById('authloggedInText');

  fetch('database/api/checkSession.php', {
    method: 'GET',
    credentials: 'include' // necessário se o backend usa cookies de sessão
  })
  .then(res => res.json())
  .then(data => {
    if (data.loggedIn) {
      // Usuário está logado
      loggedInText.textContent = 'LOG OUT';
      loggedInText.addEventListener('click', logout);
    } else {
      // Usuário não está logado
      loggedInText.textContent = 'LOG IN';
      loggedInText.addEventListener('click', () => {
        window.location.href = 'login.html';
      });
    }
  })
  .catch(err => console.error('Erro ao verificar sessão:', err));
});

function logout() {
  fetch('database/api/logout.php', {
    method: 'POST',
    credentials: 'include'
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert('Logout realizado com sucesso!');
      window.location.reload();
    }
  })
  .catch(err => console.error('Erro ao fazer logout:', err));
}
