<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

session_start();
require_once '../classes/Tag.php';

// Função auxiliar para verificar autenticação
function verificarAutenticacao() {
    if (!isset($_SESSION['id_usuario'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Usuário não autenticado'
        ]);
        exit;
    }
    return $_SESSION['id_usuario'];
}

$metodo = $_SERVER['REQUEST_METHOD'];
$tag = new Tag();

switch ($metodo) {
    case 'GET':
        // Listar tags do usuário
        $id_usuario = verificarAutenticacao();
        
        $tags = $tag->buscarPorUsuario($id_usuario);
        
        echo json_encode([
            'success' => true,
            'tags' => $tags
        ]);
        break;

    case 'POST':
        // Criar nova tag
        $id_usuario = verificarAutenticacao();
        $dados = json_decode(file_get_contents("php://input"));
        
        if (empty($dados->nome)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Nome da tag é obrigatório'
            ]);
            exit;
        }

        $tag->id_usuario = $id_usuario;
        $tag->nome = $dados->nome;

        if ($tag->criar()) {
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Tag criada com sucesso',
                'tag' => [
                    'id_tag' => $tag->id_tag,
                    'nome' => $tag->nome
                ]
            ]);
        } else {
            http_response_code(409);
            echo json_encode([
                'success' => false,
                'message' => 'Esta tag já existe'
            ]);
        }
        break;

    case 'PUT':
        // Atualizar tag
        $id_usuario = verificarAutenticacao();
        $dados = json_decode(file_get_contents("php://input"));

        if (empty($dados->id_tag) || empty($dados->nome)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'ID e nome da tag são obrigatórios'
            ]);
            exit;
        }

        $tag->id_tag = $dados->id_tag;
        $tag->id_usuario = $id_usuario;
        $tag->nome = $dados->nome;

        if ($tag->atualizar()) {
            echo json_encode([
                'success' => true,
                'message' => 'Tag atualizada com sucesso'
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Erro ao atualizar tag'
            ]);
        }
        break;

    case 'DELETE':
        // Deletar tag
        $id_usuario = verificarAutenticacao();
        $dados = json_decode(file_get_contents("php://input"));

        if (empty($dados->id_tag)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'ID da tag é obrigatório'
            ]);
            exit;
        }

        $tag->id_tag = $dados->id_tag;
        $tag->id_usuario = $id_usuario;

        if ($tag->deletar()) {
            echo json_encode([
                'success' => true,
                'message' => 'Tag deletada com sucesso'
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Erro ao deletar tag'
            ]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'message' => 'Método não permitido'
        ]);
        break;
}
?>