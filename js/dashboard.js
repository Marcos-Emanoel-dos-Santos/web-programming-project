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
	var promise = await fetch("database/listarLinksUsuario.php",
		{method: "GET"}
	);

	var resultado = await promise.json();

	
	const qtdLinks = document.getElementById('profile_links_count_p');
	qtdLinks.innerHTML = resultado.totalLinks + " links created.";
}
mostrarQtdLinks();