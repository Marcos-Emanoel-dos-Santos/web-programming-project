<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '/../classes/Usuario.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método não permitido'
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (empty($data->email) || empty($data->password)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Email e senha são obrigatórios'
    ]);
    exit;
}

$usuario = new Usuario();
$usuario->email = $data->email;

if (!$usuario->login($data->password)) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Credenciais inválidas'
    ]);
    exit;
}

// Se o login foi bem-sucedido, inicia a sessão
session_start();
$_SESSION['id_usuario'] = $usuario->id_usuario;
$_SESSION['nome'] = $usuario->nome;
$_SESSION['email'] = $usuario->email;

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Login realizado com sucesso',
    'user' => [
        'id_usuario' => $usuario->id_usuario,
        'nome' => $usuario->nome,
        'email' => $usuario->email
    ]
]);
?>
