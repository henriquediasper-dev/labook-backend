-- Active: 1691686247149@@127.0.0.1@3306

CREATE TABLE
    users (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL
    );

INSERT INTO
    users (id, name, email, password, role)
VALUES (
        'u001',
        'Fulano',
        'fulano@email.com',
        '$2a$12$R/zJTdp/5TrzNCHpgOg53uU1VpRgylDU0m4yfwwCf6qhUkUjRLfNq',
        'NORMAL'
    ), (
        'u002',
        'Beltrana',
        'beltrana@email.com',
        '$2a$12$.XDiq6JaMjPWcUxLOCoQBuH33lK0LLoUFFkcwuRsFUAYeCaAaxO1m',
        'NORMAL'
    ), (
        'u003',
        'Astrodev',
        'astrodev@email.com',
        '$2a$12$tavE1qpWoYit4kDuSCaFa.j7wvRKfuyN9ctii2hDshZ96prDfXWnC',
        'ADMIN'
    );

SELECT * FROM users;

CREATE TABLE
    posts (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER DEFAULT (0) NOT NULL,
        dislikes INTEGER DEFAULT (0) NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL,
        updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
    );

INSERT INTO
    posts (id, creator_id, content)
VALUES (
        'p001',
        'u001',
        'Toda vez que eu dou um passo o mundo sai do lugar'
    ), (
        'p002',
        'u002',
        'Uma cerveja antes do almoço é muito bom pra ficar pensando melhor'
    ), (
        'p003',
        'u003',
        'O peso não tem a ver com gravidade se a gente tem alguém pra dividir a queda as leis da física não valem nada não'
    );

SELECT * FROM posts;

CREATE TABLE
    likes_dislikes (
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        like INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE
    );

INSERT INTO
    likes_dislikes (user_id, post_id, like)
VALUES ('u002', 'p001', 1), ('u003', 'p001', 1), ('u001', 'p002', 1), ('u003', 'p002', 0);

SELECT * FROM likes_dislikes;

UPDATE posts SET likes = 2 WHERE id = 'p001';

UPDATE posts SET likes = 1, dislikes = 1 WHERE id = 'p002';

DROP TABLE users;

DROP TABLE posts;

DROP TABLE likes_dislikes;

-- fulano tipo NORMAL e senha = fulano123

-- betrana tipo NORMAL e senha = beltrana00

-- astrodev tipo ADMIN e senha = astrodev99