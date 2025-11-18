<?php

class Database {
    private $host = "localhost";
    private $db_name = "celulas"; 
    private $username = "root";
    private $password = "Uc1661"; 
    private $conn;

    /**
     * Estabelece conexão com o banco de dados
     */
    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password
            );
            
            // Definir modo de erro do PDO para exceções
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Retornar resultados como arrays associativos
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            
        } catch(PDOException $e) {
            error_log("Connection Error: " . $e->getMessage());
            return null;
        }

        return $this->conn;
    }

    /**
     * Fecha a conexão com o banco de dados
     */
    public function closeConnection() {
        $this->conn = null;
    }
}
?>