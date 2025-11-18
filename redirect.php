<?php
$pdo = new PDO("mysql:host=localhost;dbname=celulas;charset=utf8", "root", "Uc1661");

$codigo = $_GET['c'] ?? '';

$stmt = $pdo->prepare("
    SELECT url_original
    FROM link
    WHERE url_curta = ?
");

$stmt->execute([$codigo]);

$url = $stmt->fetchColumn();

if ($url) {
    header("Location: " . $url);
    exit;
}

http_response_code(404);
echo "Link não encontrado. Verifique se há algum erro de digitação ou consulte o proprietário.";
