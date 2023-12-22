CREATE TABLE IF NOT EXISTS games (
    uuid VARCHAR(255) PRIMARY KEY,
    player_x_uuid VARCHAR(255),
    player_o_uuid VARCHAR(255),
    winner_uuid VARCHAR(255) NULL,
    turn CHAR(1) CHECK (turn IN ('X', 'O')),
    board JSON,
    finished_at TIMESTAMP NULL
);
