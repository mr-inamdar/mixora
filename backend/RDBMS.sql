CREATE DATABASE mixora;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE songs (
    id INT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    album VARCHAR(255),

    audio_url TEXT NOT NULL,
    image_url TEXT,

    urduName VARCHAR(255),
    hindiName VARCHAR(255),

    uploaded_by INT,

    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_song_user
    FOREIGN KEY (uploaded_by)
    REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

CREATE TABLE playlists (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    owner_id INT,

    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_playlist_owner
    FOREIGN KEY (owner_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
CREATE TABLE playlistsongs (
    id INT AUTO_INCREMENT PRIMARY KEY,

    playlist_id INT NOT NULL,
    song_id INT NOT NULL,

    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_playlist_song_playlist
    FOREIGN KEY (playlist_id)
    REFERENCES playlists(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

    CONSTRAINT fk_playlist_song_song
    FOREIGN KEY (song_id)
    REFERENCES songs(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

    UNIQUE KEY unique_playlist_song
    (playlist_id, song_id)
);

-- users
-- │
-- ├── songs
-- │      uploaded_by → users.id
-- │
-- └── playlists
--        owner_id → users.id
--               │
--               └── playlist_songs
--                      playlist_id → playlists.id
--                      song_id → songs.id