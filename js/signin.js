document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('signinForm');

	form.addEventListener('submit', function(event) {
		event.preventDefault();

		const isFormValid = validateForm();

		if (isFormValid) {
			console.log('Form valid, sending data.');
			login();
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

function login() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  fetch('database/api/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log('Usuário logado:', data.user);
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message);
    }
  })
  .catch(err => console.error('Erro ao fazer login:', err));
}

