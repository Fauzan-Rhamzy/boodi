-- CREATE DATABASE boodi;

DROP TABLE IF EXISTS Reply;
DROP TABLE IF EXISTS BookCollection;
DROP TABLE IF EXISTS Collection;
DROP TABLE IF EXISTS AuthorBook;
DROP TABLE IF EXISTS BookGenre;
DROP TABLE IF EXISTS UserBook;
DROP TABLE IF EXISTS ReadingHistory;

DROP TABLE IF EXISTS Author;
DROP TABLE IF EXISTS Genre;
DROP TABLE IF EXISTS Likes;
DROP TABLE IF EXISTS Review;
DROP TABLE IF EXISTS Book;
DROP TABLE IF EXISTS Users;

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
    title VARCHAR(255) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    year INT NOT NULL,
    page INT NOT NULL,
    language VARCHAR(5) NOT NULL,
    description TEXT,
    cover TEXT
);

CREATE TABLE UserBook(
    user_book_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id)NOT NULL,
    book_id INT REFERENCES book(book_id), 
    current_page INT,
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ReadingHistory (
    reading_history_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) NOT NULL,
    book_id INT REFERENCES book(book_id) NOT NULL,
    pages_read INT NOT NULL,  
    read_date DATE NOT NULL   
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
    description TEXT NOT NULL, 
    profile_pic TEXT
);

CREATE TABLE AuthorBook (
    author_book_id SERIAL PRIMARY KEY,
    author_id INT REFERENCES author(author_id), 
    book_id INT REFERENCES book(book_id)
);

CREATE TABLE Collection(
    collection_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_system BOOLEAN DEFAULT false,
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
