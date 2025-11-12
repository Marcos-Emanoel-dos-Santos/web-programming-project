<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../config/conexao.php';

// Lida com pré-requisição (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    if (!isset($_SESSION['id_usuario'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Usuário não autenticado']);
        exit;
    }

    $db = new Conexao();
    $conn = $db->getConexao();
    $id_usuario = $_SESSION['id_usuario'];

    switch ($_SERVER['REQUEST_METHOD']) {

        // LISTAR LINKS COM SUAS TAGS (GET)
        case 'GET':
            $stmt = $conn->prepare("SELECT
                                        l.id_link,
                                        l.url_original,
                                        l.url_curta,
                                        l.total_cliques,
                                        l.data_criacao,
                                        GROUP_CONCAT(t.nome) AS tags
                                    FROM Link l
                                    LEFT JOIN Link_Tag lt ON l.id_link = lt.id_link
                                    LEFT JOIN Tag t ON lt.id_tag = t.id_tag
                                    WHERE l.id_usuario = ?
                                    GROUP BY l.id_link");
            $stmt->bind_param("i", $id_usuario);
            $stmt->execute();
            $result = $stmt->get_result();

            $links = [];
            while ($row = $result->fetch_assoc()) {
                $row['tags'] = $row['tags'] ? explode(',', $row['tags']) : [];
                $links[] = $row;
            }

            echo json_encode(['success' => true, 'links' => $links]);
            break;

        // CRIAR NOVO LINK (POST)
        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);

            if (empty($data['url_original'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'URL original é obrigatória']);
                exit;
            }

            $url_original = trim($data['url_original']);
            $data_expiracao = !empty($data['data_expiracao']) ? $data['data_expiracao'] : null;

            // gera código curto aleatório
            $caracteres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            $url_curta = 'https://wknot.' . substr(str_shuffle($caracteres), 0, 5);

            $stmt = $conn->prepare("
                INSERT INTO Link (id_usuario, url_original, url_curta, data_expiracao)
                VALUES (?, ?, ?, ?)
            ");
            $stmt->bind_param("isss", $id_usuario, $url_original, $url_curta, $data_expiracao);

            if ($stmt->execute()) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Link criado com sucesso',
                    'link' => [
                        'id_link' => $conn->insert_id,
                        'url_original' => $url_original,
                        'url_curta' => $url_curta
                    ]
                ]);
            } else {
                throw new Exception("Erro ao salvar link: " . $stmt->error);
            }
            break;

        // DELETAR LINK (DELETE)
        case 'DELETE':
            $data = json_decode(file_get_contents("php://input"), true);
            if (empty($data['id_link'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID do link é obrigatório']);
                exit;
            }

            $id_link = intval($data['id_link']);

            $stmt = $conn->prepare("DELETE FROM Link WHERE id_link = ? AND id_usuario = ?");
            $stmt->bind_param("ii", $id_link, $id_usuario);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                echo json_encode(['success' => true, 'message' => 'Link deletado com sucesso']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Link não encontrado ou não pertence ao usuário']);
            }
            break;

        // MÉTODO DESCONHECIDO
        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método não permitido']);
            break;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro no servidor: ' . $e->getMessage()]);
}
?>
