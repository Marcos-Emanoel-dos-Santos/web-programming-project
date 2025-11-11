document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('signupForm');

	form.addEventListener('submit', function(event) {
		event.preventDefault();

		const isFormValid = validateForm();

		if (isFormValid) {
			console.log('Form valid, sending data.');
			salvarUsuario();
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

	if (password.length < 8) {
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


async function salvarUsuario(){
	const fullName = document.getElementById('fullName').value.trim();
	const email = document.getElementById('email').value.trim();
	const password = document.getElementById('password').value.trim();

	const payload = {
		fullName,
		email,
		password
	};

	const response = await fetch("database/api/signup.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(payload)
	});

	const resultado = await response.json();
	console.log(resultado);

	if (resultado.success) {
		alert("Usuário cadastrado com sucesso!");
		window.location.href = "index.html";
	} else {
		alert(resultado.message);
	}
}