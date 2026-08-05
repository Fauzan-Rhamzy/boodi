CREATE DATABASE boodi IF NOT EXIST;

DROP TABLE Users IF EXISTS;
DROP TABLE Book IF EXISTS;
DROP TABLE UserBook IF EXISTS;
DROP TABLE Genre IF EXISTS;
DROP TABLE BookGenre IF EXISTS;
DROP TABLE Author IF EXISTS;
DROP TABLE AuthorBook IF EXISTS;
DROP TABLE Collection IF EXISTS;
DROP TABLE BookCollection IF EXISTS;
DROP TABLE Review IF EXISTS;
DROP TABLE Reply IF EXISTS;

CREATE TABLE Users(
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(30) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    profile_pic TEXT,
    role VARCHAR(100) NOT NULL DEFAULT 'user', 
    joined_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE Book(
    book_id SERIAL PRIMARY KEY,
    book_title VARCHAR(255) NOT NULL,
    book_price DOUBLE PRECISION NOT NULL,
    book_year INT NOT NULL,
    book_page INT NOT NULL,
    book_languange VARCHAR(5) NOT NULL,
    book_desc TEXT,
    book_cover TEXT
);

CREATE TABLE UserBook(
    user_book_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id)NOT NULL,
    book_id INT REFERENCES book(book_id), 
    current_page INT,
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE Genre (
    genre_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL 
);

CREATE TABLE BookGenre (
    book_genre_id SERIAL PRIMARY KEY, 
    book_id INT REFERENCES book(book_id), 
    genre_id INT REFERENCES genre(genre_id) NOT NULL
);

CREATE TABLE Author (
    author_id SERIAL PRIMARY KEY, 
    name VARCHAR(255) NOT NULL, 
    description TEXT NOT NULL
);

CREATE TABLE AuthorBook (
    author_book_id SERIAL PRIMARY KEY,
    author_id INT REFERENCES author(author_id), 
    book_id INT REFERENCES book(book_id)
);

CREATE TABLE Collection(
    collection_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_id INT REFERENCES users(user_id)NOT NULL,
	cover_photo TEXT
);

CREATE TABLE BookCollection(
    book_collect_id SERIAL PRIMARY KEY,
    book_id INT REFERENCES book(book_id),
    collection_id INT REFERENCES collection(collection_id)
);

CREATE TABLE Review(
    review_id SERIAL PRIMARY KEY,
    comment VARCHAR(500),
    rating INT NOT NULL,
    book_id INT REFERENCES book(book_id) NOT NULL,
    user_id INT REFERENCES users(user_id)NOT NULL
);

CREATE TABLE Likes(
    like_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id)NOT NULL,
    review_id INT REFERENCES review(review_id) NOT NULL
);

CREATE TABLE Reply(
    reply_id SERIAL PRIMARY KEY,
    comment VARCHAR(200),
    user_id INT REFERENCES users(user_id)NOT NULL,
    review_id INT REFERENCES review(review_id) NOT NULL
);
