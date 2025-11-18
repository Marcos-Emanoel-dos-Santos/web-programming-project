// ========== CREATE DO USUÁRIO ==========
// É o signup :)


// ========== READ DO USUÁRIO ==========
async function mostrarNome() {
  try {
    const response = await fetch("database/api/checkSession.php", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Erro ao buscar info do usuário: " + response.status);

    const resultado = await response.json();
    if (!resultado.loggedIn) throw new Error(resultado.message);

    const nome = resultado.user.nome || 'Unknown';
    const username = document.getElementById("profile_username_p");

    if (!username) return;
	
	  username.textContent = nome;
  } catch (erro) {
    console.error("Erro ao carregar nome:", erro);
  }
}


// ========== UPDATE DO USUÁRIO ==========
async function enviarAtualizacaoPerfil(nome, email) {
  const feedbackEl = document.getElementById("mensagem_update");

  if (!nome && !email) {
      if (feedbackEl) feedbackEl.textContent = "Fill at least one field to update.";
      return; 
  }

  const data = {
      nome: nome,
      email: email
  };

  try {
    const response = await fetch("database/api/editUser.php", {
      method: "PUT",
      headers: {
          "Content-Type": "application/json"
      },
      credentials: "include", 
      body: JSON.stringify(data)
  });

  const resultado = await response.json();
    if (response.ok) {
        alert(resultado.message);
        if (nome) {
            await mostrarNome();
        }
            
        document.getElementById("edit_profile_form").reset();
        if (feedbackEl) feedbackEl.textContent = "";
        } else {
            if (feedbackEl) feedbackEl.textContent = "Erro: " + resultado.message;
            alert("Erro: " + resultado.message);
        }

    } catch (error) {
        console.error("Falha na requisição de update:", error);
        if (feedbackEl) feedbackEl.textContent = "Erro de conexão. Tente novamente.";
    }
    finally{
      fecharModalEditar();
    }
}

// ========== LISTENER PARA SUBMIT DO UPDATE ==========
document.addEventListener("submit", (event) => {
    if (event.target.id === "edit_profile_form") {
        
        event.preventDefault(); 
        
        const nome = document.getElementById("edit_nome").value.trim();
        const email = document.getElementById("edit_email").value.trim();

        enviarAtualizacaoPerfil(nome, email);
    }
});

// ========== AUXILIARES DO UPDATE (MODAL) ==========
function abrirModalEditar() {
    const modal = document.getElementById('edit_profile_form');
    const fundo = document.getElementsByClassName('shadow')[0];
    modal.classList.add('show');
    fundo.classList.add('show');
}
function fecharModalEditar() {
    const modal = document.getElementById('edit_profile_form');
    const fundo = document.getElementsByClassName('shadow')[0];
    const inpArr = document.getElementsByClassName('account_edit_input');
    for(i=0; i < inpArr.length; i++){
      inpArr[i].value = "";
    }
    modal.classList.remove('show');
    fundo.classList.remove('show');
}
const fecharModalSpan = document.getElementById('close_edit_form');
fecharModalSpan.addEventListener("click", () => {
    fecharModalEditar();
})


// ========== DELETE DO USUÁRIO ==========
async function deletarUsuario() {
  if(confirm("Tem certeza que deseja excluir esta conta?")){
    try {
      const response = await fetch("database/api/deleteUser.php", {
        method: "DELETE",
        credentials: "include"
      });

      const data = await response.json();
      alert(data.message);

      if (data.success) {
        window.location.href = "signin.html";
      }
    } catch (err) {
      console.error("Erro ao deletar usuário:", err);
      alert("Erro ao tentar deletar conta.");
    }
  }
}



// ========== AO CARREGAR A PÁGINA ==========
document.addEventListener("DOMContentLoaded", () => {
  mostrarNome();
});
