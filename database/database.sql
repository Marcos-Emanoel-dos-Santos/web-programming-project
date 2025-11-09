CREATE TABLE Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_ultima_atividade DATETIME NULL 
);

-- Criação da tabela de Links
CREATE TABLE Link (
    id_link INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NULL,
    id_sessao INT NULL,
    url_original TEXT NOT NULL,
    url_curta VARCHAR(30) NOT NULL UNIQUE,
    total_cliques INT NOT NULL DEFAULT 0,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_expiracao DATETIME NULL,
    
    CONSTRAINT fk_link_usuario FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    CONSTRAINT fk_link_sessao FOREIGN KEY (id_sessao) REFERENCES Sessao(id_sessao)
);

-- Criação da tabela de Tags, com propriedade do usuário
CREATE TABLE Tag (
    id_tag INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_tag_usuario FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    CONSTRAINT uq_usuario_tag UNIQUE (id_usuario, nome)
);

-- Tabela associativa para o relacionamento N:N entre Link e Tag
CREATE TABLE Link_Tag (
    id_link_tag INT AUTO_INCREMENT PRIMARY KEY,
    id_link INT NOT NULL,
    id_tag INT NOT NULL,
    
    CONSTRAINT fk_linktag_link FOREIGN KEY (id_link) REFERENCES Link(id_link) ON DELETE CASCADE,
    CONSTRAINT fk_linktag_tag FOREIGN KEY (id_tag) REFERENCES Tag(id_tag) ON DELETE CASCADE,
    CONSTRAINT uq_link_tag_associacao UNIQUE (id_link, id_tag)
);

-- Criação da tabela de Cliques para coletar métricas
CREATE TABLE Clique (
    id_clique INT AUTO_INCREMENT PRIMARY KEY,
    id_link INT NOT NULL,
    data_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip VARCHAR(45) NOT NULL,
    user_agent TEXT NULL,
    geo_localizacao VARCHAR(255) NULL,
    referrer TEXT NULL,
    
    CONSTRAINT fk_clique_link FOREIGN KEY (id_link) REFERENCES Link(id_link) ON DELETE CASCADE
);