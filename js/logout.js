fetch('database/api/logout.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        alert(data.message);
        window.location.href = 'signin.html';
  }
});
