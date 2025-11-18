<?php
class Conexao {
    private $host = "localhost";
    private $usuario = "root";
    private $senha = "Uc1661";
    private $banco = "webknot"; 

    public function getConexao() {
        $conn = new mysqli($this->host, $this->usuario, $this->senha, $this->banco);
        if ($conn->connect_error) {
            die("Erro de conexão: " . $conn->connect_error);
        }
        $conn->set_charset("utf8mb4");
        return $conn;
    }
}
?>
