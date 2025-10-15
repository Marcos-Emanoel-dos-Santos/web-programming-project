const urlCompleta = window.location.href;
const partes = urlCompleta.split('/');
const nomeDoArquivo = partes[partes.length - 1].split('.')[0];

if (nomeDoArquivo == 'index') {
	function gerarLink() {
		const output_div = document.getElementById('output-link_encurtado');
		const input_link = document.getElementById('input-link_encurtado').value;

		const output_p = output_div.querySelector('p');
		const output_img = output_div.querySelector('img');

		var output_str = 'https://www.wknot.' + input_link.slice(12, 17) + '.com';


		output_div.classList.remove('show');
		void output_div.offsetWidth;
		output_div.classList.add('show');

		setTimeout(() => { output_p.textContent = output_str }, 550);
		setTimeout(() => { output_img.style = 'display: inline-block;' }, 550);
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

if (nomeDoArquivo == 'signup') {
	document.addEventListener('DOMContentLoaded', () => {
		const form = document.getElementById('signupForm');

		form.addEventListener('submit', function(event) {
			event.preventDefault();

			const isFormValid = validateForm();

			if (isFormValid) {
				console.log('Form valid, sending data.');
				window.location.href = "index.html";
			} else {
				console.log('Form invalid, please check the fields.');
			}
		});
	});

	function validateFullName(){
		const fullName = document.getElementById('fullName').value.trim();
		if (fullName.length < 2) {
			document.getElementById('nameError').textContent = 'Full name must be at least 2 characters long.';
			return false;
		}
		return true;
	}

	function validateEmail(){
		const email = document.getElementById('email').value.trim();

		// regex for email validation (eu totalmente fiz isso de cabeça)
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			document.getElementById('emailError').textContent = 'Please enter a valid email address.';
			return false;
		}
		return true;
	}

	function validatePsswd(){
		const password = document.getElementById('password').value.trim();
		const passwordRepeat = document.getElementById('password_repeat').value.trim();

		if (password.length < 12) {
			document.getElementById('passwordError').textContent = 'Password must be at least 12 characters long.';
			return false;
		} 
		if(password != passwordRepeat){
				document.getElementById('passwordError2').textContent = 'Password must match.';
				return false;
			}
		return true;
	}

	function validateForm() {
		document.querySelectorAll('.error').forEach(e => e.textContent = '');
		const isValidName = validateFullName();
		const isValidEmail = validateEmail();
		const isValidPsswd = validatePsswd();

		return isValidName && isValidEmail && isValidPsswd;
	}
}

if(nomeDoArquivo == 'signin'){
	document.addEventListener('DOMContentLoaded', () => {
		const form = document.getElementById('signinForm');

		form.addEventListener('submit', function(event) {
			event.preventDefault();

			const isFormValid = validateForm();

			if (isFormValid) {
				console.log('Form valid, sending data.');
				window.location.href = "index.html";
			} else {
				console.log('Form invalid, please check the fields.');
			}
		});
	});


	function validateEmail(){
		const email = document.getElementById('email').value.trim();

		// regex for email validation (eu totalmente fiz isso de cabeça)
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			document.getElementById('emailError').textContent = 'Please enter a valid email address.';
			return false;
		}
		return true;
	}

	function validatePsswd(){
		const password = document.getElementById('password').value.trim();

		// VALIDAÇÃO DA SENHA NO LOGIN (PRECISA DE BANCO DE DADOS)
		if (password.length === 0) {
        	document.getElementById('passwordError').textContent = 'Por favor, insira sua senha.';
        return false;
    	}

		return true;
	}

	function validateForm() {
		document.querySelectorAll('.error').forEach(e => e.textContent = '');
		const isValidEmail = validateEmail();
		const isValidPsswd = validatePsswd();

		return isValidEmail && isValidPsswd;
	}
}
