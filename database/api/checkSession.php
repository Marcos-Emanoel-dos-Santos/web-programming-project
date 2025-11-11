<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

session_start();

if (isset($_SESSION['id_usuario'])) {
    echo json_encode([
        'loggedIn' => true,
        'user' => [
            'id_usuario' => $_SESSION['id_usuario'],
            'nome' => $_SESSION['nome'],
            'email' => $_SESSION['email']
        ]
    ]);
} else {
    echo json_encode(['loggedIn' => false]);
}
?>
