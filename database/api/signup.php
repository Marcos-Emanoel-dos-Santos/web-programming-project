<?php


header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'database/classes/Usuario.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (empty($data->fullName) || empty($data->email) || empty($data->password)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Todos os campos são obrigatórios'
    ]);
    exit;
}

if (!filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Email inválido'
    ]);
    exit;
}

if (strlen($data->password) < 6) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'A senha deve ter no mínimo 6 caracteres'
    ]);
    exit;
}

$usuario = new Usuario ();
$usuario->nome = $data->fullName;
$usuario->email = $data->email;
$usuario->senha = $data->password;

if ($usuario->emailExiste()) {
    http_response_code(409);
    echo json_encode([
        'success' => false,
        'message' => 'Este email já está cadastrado'
    ]);
    exit;
}

// Registra o usuário
if ($usuario->registrar()) {
    // Inicia sessão
    session_start();
    $_SESSION['id_usuario'] = $usuario->id_usuario;
    $_SESSION['nome'] = $usuario->nome;
    $_SESSION['email'] = $usuario->email;

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Usuário cadastrado com sucesso',
        'user' => [
            'id_usuario' => $usuario->id_usuario,
            'nome' => $usuario->nome,
            'email' => $usuario->email
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao cadastrar usuário'
    ]);
}
?>