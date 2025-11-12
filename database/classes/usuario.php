<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/database/config/conexao.php';

$con = new Conexao();
$conn = $con->getConexao();


class Usuario {
    private $conn;
    
    public $id_usuario;
    public $nome;
    public $email;
    public $senha;
    public $senha_hash;
    public $data_criacao;
    public $data_ultima_atividade;

    public function __construct() {
        $this->conn = (new Conexao())->getConexao();
    }

    // Cria novo usuário
    public function registrar() {
        $sql = "INSERT INTO Usuario (nome, email, senha_hash) VALUES (?, ?, ?)";
        $stmt = $this->conn->prepare($sql);

        if (!$stmt) {
            throw new Exception("Erro na preparação da query: " . $this->conn->error);
        }

        $this->senha_hash = password_hash($this->senha, PASSWORD_DEFAULT);

        $stmt->bind_param("sss", $this->nome, $this->email, $this->senha_hash);

        if ($stmt->execute()) {
            $this->id_usuario = $this->conn->insert_id;
            return true;
        } else {
            return false;
        }
    }

    // Verifica se o email já existe
    public function emailExiste() {
        $sql = "SELECT id_usuario FROM Usuario WHERE email = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $this->email);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->num_rows > 0;
    }

    // Faz login e retorna dados do usuário se sucesso
    public function login($senhaDigitada) {
        $sql = "SELECT * FROM Usuario WHERE email = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $this->email);
        $stmt->execute();
        $resultado = $stmt->get_result();

        if ($resultado->num_rows == 0) {
            return false;
        }

        $usuario = $resultado->fetch_assoc();

        if (password_verify($senhaDigitada, $usuario['senha_hash'])) {
            // Atualiza data de última atividade
            $this->atualizarUltimaAtividade($usuario['id_usuario']);

            // Define atributos do objeto
            $this->id_usuario = $usuario['id_usuario'];
            $this->nome = $usuario['nome'];
            $this->email = $usuario['email'];
            $this->data_criacao = $usuario['data_criacao'];
            $this->data_ultima_atividade = $usuario['data_ultima_atividade'];

            return true;
        }

        return false;
    }

    // Atualiza o timestamp da última atividade
    public function atualizarUltimaAtividade($id_usuario) {
        $sql = "UPDATE Usuario SET data_ultima_atividade = NOW() WHERE id_usuario = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id_usuario);
        $stmt->execute();
    }

    // Busca um usuário pelo ID
    public function buscarPorId($id_usuario) {
        $sql = "SELECT * FROM Usuario WHERE id_usuario = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id_usuario);
        $stmt->execute();
        $resultado = $stmt->get_result();

        if ($resultado->num_rows == 0) {
            return null;
        }

        $dados = $resultado->fetch_assoc();

        $this->id_usuario = $dados['id_usuario'];
        $this->nome = $dados['nome'];
        $this->email = $dados['email'];
        $this->senha_hash = $dados['senha_hash'];
        $this->data_criacao = $dados['data_criacao'];
        $this->data_ultima_atividade = $dados['data_ultima_atividade'];

        return $this;
    }

    // Deleta um usuário e seus relacionamentos
    public function deletar($id_usuario) {
        // Isso vai apagar em cascata tudo que está relacionado via ON DELETE CASCADE
        $sql = "DELETE FROM Usuario WHERE id_usuario = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id_usuario);
        return $stmt->execute();
    }
}
?>
