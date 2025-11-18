<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../classes/Usuario.php';
session_start();

// Lida com pré-requisição CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}


if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Método não permitido. Use PUT.']);
    exit;
}


if (empty($_SESSION['id_usuario'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(['success' => false, 'message' => 'Usuário não autenticado.']);
    exit;
}


$data = json_decode(file_get_contents("php://input"), true);


if (empty($data['nome']) && empty($data['email'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Nenhum dado (nome ou email) foi enviado para atualização.']);
    exit;
}

try {
    $id_usuario = $_SESSION['id_usuario'];
    $usuario = new Usuario();


    if (!$usuario->buscarPorId($id_usuario)) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Usuário da sessão não encontrado.']);
        exit;
    }


    $usuario->nome = $data['nome'] ?? $usuario->nome;
    $usuario->email = $data['email'] ?? $usuario->email;

    if ($usuario->atualizar()) {
        $_SESSION['nome'] = $usuario->nome;

        echo json_encode(['success' => true, 'message' => 'Usuário atualizado com sucesso']);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Erro ao atualizar usuário.']);
    }

} catch (Exception $e) {
    if (str_contains($e->getMessage(), 'email informado já está em uso')) {
        http_response_code(400);
    } else {
        http_response_code(500);
    }
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>