const urlCompleta = window.location.href;
const partes = urlCompleta.split('/');
const nomeDoArquivo = partes[partes.length - 1].split('.')[0];

if (nomeDoArquivo == 'home') {
    const botaoCopiar = document.getElementById('botao_copiar_link');

    botaoCopiar.addEventListener('click', () => {
    const output_p = document.getElementById('output-link_encurtado-p').textContent;
    if (!output_p) {
        return;
    }
    
    navigator.clipboard.writeText(output_p);
});
}

if (nomeDoArquivo == 'dashboard') {
    const botoesDelete = document.querySelectorAll('.button_delete_element');

    botoesDelete.forEach(botao => {
        botao.addEventListener('click', () => {
            const linkParaDeletar = botao.closest('.link_related_subdiv');

            if (linkParaDeletar) {
                linkParaDeletar.remove();
            }
        });
    });
}



