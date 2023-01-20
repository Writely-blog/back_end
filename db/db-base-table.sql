-- TABLES --
CREATE TABLE users
(id BIGSERIAL PRIMARY KEY NOT NULL,
user_name VARCHAR(200) NOT NULL,
email VARCHAR(200) NOT NULL,
password VARCHAR(255) NOT NULL,
UNIQUE (email));

CREATE TABLE posts
(id BIGSERIAL PRIMARY KEY NOT NULL,
title VARCHAR(200) NOT NULL,
context VARCHAR(2000) NOT NULL,
likes_count INTEGER DEFAULT 0,
user_id INTEGER NOT NULL,
FOREIGN KEY (user_id) REFERENCES users (id));

-- USERS --

INSERT INTO users (user_name, email, password) VALUES ('Dima', 'dima@dima.com', 'password'); 

-- POSTS --

INSERT INTO posts (title, context, user_id) VALUES ('First Step', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. 
Possimus eveniet sed officia soluta hic, error vitae, laborum debitis velit totam temporibus! Earum aliquam nostrum eos hic rem, 
similique voluptas rerum ullam, aperiam obcaecati dicta. Nobis inventore porro expedita assumenda voluptates dicta! 
Quo officia blanditiis quos natus soluta ea amet, laboriosam dolor reprehenderit unde, 
doloremque tempore eligendi voluptatem dicta non ullam esse quis facilis distinctio officiis ut autem optio debitis! 
Nulla ratione exercitationem saepe ullam vel nostrum error vitae ea recusandae, nisi ipsum placeat, 
laudantium facilis similique aperiam dignissimos sequi quaerat assumenda nihil, consequuntur esse quis. Minus modi culpa eos omnis?
', 1); 

INSERT INTO posts (title, context, user_id) VALUES ('Second Step', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. 
Possimus eveniet sed officia soluta hic, error vitae, laborum debitis velit totam temporibus! Earum aliquam nostrum eos hic rem, 
similique voluptas rerum ullam, aperiam obcaecati dicta. Nobis inventore porro expedita assumenda voluptates dicta! 
Quo officia blanditiis quos natus soluta ea amet, laboriosam dolor reprehenderit unde, 
doloremque tempore eligendi voluptatem dicta non ullam esse quis facilis distinctio officiis ut autem optio debitis! 
Nulla ratione exercitationem saepe ullam vel nostrum error vitae ea recusandae, nisi ipsum placeat, 
laudantium facilis similique aperiam dignissimos sequi quaerat assumenda nihil, consequuntur esse quis. Minus modi culpa eos omnis?
Lorem ipsum dolor sit amet consectetur adipisicing elit. 
Possimus eveniet sed officia soluta hic, error vitae, laborum debitis velit totam temporibus! Earum aliquam nostrum eos hic rem, 
similique voluptas rerum ullam, aperiam obcaecati dicta. Nobis inventore porro expedita assumenda voluptates dicta! 
Quo officia blanditiis quos natus soluta ea amet, laboriosam dolor reprehenderit unde, 
doloremque tempore eligendi voluptatem dicta non ullam esse quis facilis distinctio officiis ut autem optio debitis! 
Nulla ratione exercitationem saepe ullam vel nostrum error vitae ea recusandae, nisi ipsum placeat, 
laudantium facilis similique aperiam dignissimos sequi quaerat assumenda nihil, consequuntur esse quis. Minus modi culpa eos omnis?
Lorem ipsum dolor sit amet consectetur adipisicing elit. 
Possimus eveniet sed officia soluta hic, error vitae, laborum debitis velit totam temporibus! Earum aliquam nostrum eos hic rem, 
similique voluptas rerum ullam, aperiam obcaecati dicta. Nobis inventore porro expedita assumenda voluptates dicta! 
', 1); 


