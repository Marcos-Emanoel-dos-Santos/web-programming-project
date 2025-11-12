<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../classes/Usuario.php';
session_start();

// Lida com pré-requisição CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}


try {
    $usuario = new Usuario();
    $id_usuario = $_SESSION['id_usuario'];

    if ($usuario->deletar($id_usuario)) {
        // Encerra sessão
        session_destroy();
        echo json_encode(['success' => true, 'message' => 'Usuário deletado com sucesso']);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Erro ao deletar usuário']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro no servidor: ' . $e->getMessage()]);
}
?>
