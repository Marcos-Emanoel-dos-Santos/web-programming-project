<?php
    $conexao = mysqli_connect("localhost:3306", "root", "Uc1661", "new_schema");

    if(!$conexao){
        die("Connection failed");
    }

    
    $fullName = $_POST["fullName"];
    $email = $_POST["email"];
    $psswd = $_POST["password"];


    $sql = "INSERT INTO Usuario(nome, email, senha_hash) VALUES (?,?,?)";
    $statement = mysqli_prepare(mysql: $conexao, query: $sql);
    mysqli_stmt_bind_param($statement, "sss", $fullName, $email, $psswd);


    if (mysqli_stmt_execute($statement)) {
        $dados_recebidos = [
            "nomeCompleto" => $fullName,
            "email" => $email,
            "psswd" => $psswd
        ];

        $resultado["mensagem"] = "Success!";
        $resultado["dados"] = $dados_recebidos;
    } else {
        http_response_code(400);
        $resultado["mensagem"] = "Erro ao cadastrar: " . mysqli_error($conexao);
        $resultado["dados"] = null;
    }

    echo json_encode($resultado);

    mysqli_stmt_close($statement);
    mysqli_close($conexao);
?>