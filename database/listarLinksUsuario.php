<?php
    $conexao = mysqli_connect("localhost:3306", "root", "Uc1661", "celulas");

    $id_us = 1;

    if(!$conexao){
        die("Connection failed");
    }


    $sqlTotalLinks = "SELECT COUNT(*) AS total FROM Link l JOIN Usuario u ON u.id_usuario = l.id_usuario WHERE u.id_usuario = ?;";
    $stmt = mysqli_prepare($conexao, $sqlTotalLinks);
    mysqli_stmt_bind_param($stmt, "i", $id_us);
    mysqli_stmt_execute($stmt);
    $resultTotalLinks = mysqli_stmt_get_result($stmt);

    

    if ($resultTotalLinks === false) {
        echo json_encode(['error' => 'Erro na consulta SQL: ' . mysqli_error($conexao)]);
        mysqli_close($conexao);
        exit;
    }

    $totalLinks = mysqli_fetch_all(result: $resultTotalLinks, mode: MYSQLI_ASSOC);

    $retorno['totalLinks'] = $totalLinks;

    echo json_encode($retorno);

    mysqli_close($conexao);
?>