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
