<?php
/**
 * Classe Tag - Gerencia tags/etiquetas
 */

require_once 'database/config/database.php';

class Tag {
    private $conn;
    private $table_name = "Tag";

    public $id_tag;
    public $id_usuario;
    public $nome;
    public $data_criacao;
    public $data_atualizacao;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    /**
     * Cria uma nova tag
     */
    public function criar() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (id_usuario, nome) 
                  VALUES (:id_usuario, :nome)";

        $stmt = $this->conn->prepare($query);

        $this->nome = htmlspecialchars(strip_tags($this->nome));

        $stmt->bindParam(":id_usuario", $this->id_usuario);
        $stmt->bindParam(":nome", $this->nome);

        try {
            if($stmt->execute()) {
                $this->id_tag = $this->conn->lastInsertId();
                return true;
            }
        } catch (PDOException $e) {
            // Tag duplicada para o usuário
            if ($e->getCode() == 23000) {
                return false;
            }
            throw $e;
        }

        return false;
    }

    /**
     * Busca todas as tags de um usuário
     */
    public function buscarPorUsuario($id_usuario) {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE id_usuario = :id_usuario 
                  ORDER BY nome ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id_usuario", $id_usuario);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Busca tag por ID
     */
    public function buscarPorId($id_tag) {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE id_tag = :id_tag 
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id_tag", $id_tag);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->id_tag = $row['id_tag'];
            $this->id_usuario = $row['id_usuario'];
            $this->nome = $row['nome'];
            $this->data_criacao = $row['data_criacao'];
            $this->data_atualizacao = $row['data_atualizacao'];
            return true;
        }

        return false;
    }

    /**
     * Busca ou cria tag (útil para criar tags rapidamente)
     */
    public function buscarOuCriar($id_usuario, $nome_tag) {
        // Primeiro tenta buscar
        $query = "SELECT id_tag FROM " . $this->table_name . " 
                  WHERE id_usuario = :id_usuario AND nome = :nome 
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id_usuario", $id_usuario);
        $stmt->bindParam(":nome", $nome_tag);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            return $row['id_tag'];
        }

        // Se não encontrou, cria
        $this->id_usuario = $id_usuario;
        $this->nome = $nome_tag;
        
        if($this->criar()) {
            return $this->id_tag;
        }

        return null;
    }

    /**
     * Atualiza nome da tag
     */
    public function atualizar() {
        $query = "UPDATE " . $this->table_name . " 
                  SET nome = :nome 
                  WHERE id_tag = :id_tag AND id_usuario = :id_usuario";

        $stmt = $this->conn->prepare($query);

        $this->nome = htmlspecialchars(strip_tags($this->nome));

        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindParam(":id_tag", $this->id_tag);
        $stmt->bindParam(":id_usuario", $this->id_usuario);

        return $stmt->execute();
    }

    /**
     * Deleta tag
     */
    public function deletar() {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE id_tag = :id_tag AND id_usuario = :id_usuario";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id_tag", $this->id_tag);
        $stmt->bindParam(":id_usuario", $this->id_usuario);

        return $stmt->execute();
    }

    /**
     * Conta quantos links usam esta tag
     */
    public function contarLinks() {
        $query = "SELECT COUNT(*) as total 
                  FROM Link_Tag 
                  WHERE id_tag = :id_tag";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id_tag", $this->id_tag);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total'];
    }

    /**
     * Busca tags mais usadas por um usuário
     */
    public function buscarMaisUsadas($id_usuario, $limite = 10) {
        $query = "SELECT t.*, COUNT(lt.id_link) as total_uso 
                  FROM " . $this->table_name . " t
                  LEFT JOIN Link_Tag lt ON t.id_tag = lt.id_tag
                  WHERE t.id_usuario = :id_usuario
                  GROUP BY t.id_tag
                  ORDER BY total_uso DESC
                  LIMIT :limite";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id_usuario", $id_usuario);
        $stmt->bindParam(":limite", $limite, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>