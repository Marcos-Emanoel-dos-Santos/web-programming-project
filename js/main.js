const urlCompleta = window.location.href;
const partes = urlCompleta.split('/');
const nomeDoArquivo = partes[partes.length - 1].split('.')[0];

if (nomeDoArquivo == 'index') {
    function gerarLink(){
        const output_div = document.getElementById('output-link_encurtado');
        const input_link = document.getElementById('input-link_encurtado').value;

        const output_p = output_div.querySelector('p');
        const output_img = output_div.querySelector('img');
        
        var output_str = 'https://www.wknot.' + input_link.slice(12, 17) + '.com';


        output_div.classList.remove('show');
        void output_div.offsetWidth;
        output_div.classList.add('show');
        
        setTimeout(() => {output_p.textContent = output_str}, 550);
        setTimeout(() => {output_img.style = 'display: inline-block;'}, 550);
    }

    
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


    const elementosURLSubdiv = document.querySelectorAll('.element_URL_fitcontent_subdiv');

    elementosURLSubdiv.forEach(elemento => {
        elemento.addEventListener('click', () => {
            
        });
    });
}
