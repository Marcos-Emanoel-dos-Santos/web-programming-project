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