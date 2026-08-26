INSERT INTO Genre (name) VALUES 
    ('Literary Fiction'),
    ('Mystery'),
    ('Thriller'),
    ('Science Fiction'),
    ('Fantasy'),
    ('Romance'),
    ('Horror'),
    ('Adventure'),
    ('Historical Fiction'),
    ('Biography'),
    ('Autobiography'),
    ('Self-Help'),
    ('Business & Finance'),
    ('Psychology'),
    ('Science & Technology'),
    ('History'),
    ('Philosophy'),
    ('Religion & Spirituality'),
    ('Graphic Novel'),
    ('Poetry');

-- USERS
INSERT INTO Users (email, phone, password, first_name, last_name, profile_pic, role) VALUES
('john.doe@example.com', '1234567890', 'hashedpwd123', 'John', 'Doe', 'profile/user-1.png', 'user'),
('jane.admin@example.com', '0987654321', 'hashedpwd456', 'Jane', 'Smith', 'profile/user-2.png', 'admin'),
('alice.reads@example.com', '5551234567', 'hashedpwd789', 'Alice', 'Jones', 'profile/user-3.png', 'user'),
('bob.bookworm@example.com', '4449876543', 'hashedpwd321', 'Bob', 'Brown', 'profile/user-4.png', 'user'),
('charlie.davis@example.com', '3335557777', 'hashedpwd654', 'Charlie', 'Davis', 'profile/user-5.png', 'user'),
('angeliquegabriella991@gmail.com','+6287828756725','$2a$10$5kzcot7HoSfggcFYdSR8ve78/P5Kha..G5sIdQK4iFVz.UIVncaTS','Angelique','Halim','profile/user-6.png','user');

-- BOOKS
-- BOOKS (Nama kolom disesuaikan dengan struktur CREATE TABLE Anda)
INSERT INTO Book (title, price, year, page, language, description, cover) VALUES
('The Silent Echo', 15.99, 2021, 320, 'EN', 'A gripping mystery about a forgotten town.', 'books/book1.png'),
('Journey to the Stars', 22.50, 2023, 450, 'EN', 'A sci-fi epic exploring the outer rim of the galaxy.', 'books/book2.png'),
('Mind Over Matter', 18.00, 2019, 280, 'EN', 'A profound self-help book on overcoming mental blocks.', 'books/book3.png'),
('El Misterio', 12.99, 2020, 210, 'ES', 'A Spanish thriller that keeps you on the edge of your seat.', 'books/book4.png'),
('History of the World', 29.99, 2015, 800, 'EN', 'A comprehensive look at human history from ancient to modern times.', 'books/book5.png');

-- AUTHORS
INSERT INTO Author (name, description, profile_pic) VALUES
('Arthur Conan', 'Master of mystery and suspense writing with over 20 bestsellers.', 'profile/author/author-1.png'),
('Stella Nova', 'Award-winning science fiction author and astrophysicist.', 'profile/author/author-2.png'),
('Dr. Alan Mind', 'Renowned psychologist, speaker, and self-help guru.', 'profile/author/author-3.png'),
('Carlos Ruiz', 'Bestselling thriller author originating from Madrid, Spain.', 'profile/author/author-4.png'),
('Eleanor Vance', 'Historian and professor at Oxford University.', 'profile/author/author-5.png');

-- AUTHOR_BOOK (Linking Authors to Books)
INSERT INTO AuthorBook (author_id, book_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- BOOK_GENRE (Linking Books to your existing Genres)
-- 2: Mystery, 4: Science Fiction, 12: Self-Help, 3: Thriller, 16: History
INSERT INTO BookGenre (book_id, genre_id) VALUES
(1, 2), 
(2, 4), 
(3, 12), 
(4, 3), 
(5, 16); 

-- USER_BOOK (Reading progress log)
INSERT INTO UserBook (user_id, book_id, current_page) VALUES
(1, 1, 150),
(1, 2, 45),
(2, 5, 800), 
(3, 3, 200),
(4, 4, 12),
(5,5,112),
(6,1,11),
(6,2,11);

-- COLLECTION
INSERT INTO Collection (name, user_id, cover_photo) VALUES
('Currently Reading', 1, 'collections/currently-reading.jpg'),
('Currently Reading', 2, 'collections/currently-reading.jpg'),
('Currently Reading', 3, 'collections/currently-reading.jpg'),
('Currently Reading', 4, 'collections/currently-reading.jpg'),
('Currently Reading', 5, 'collections/currently-reading.jpg'),
('Currently Reading', 6, 'collections/currently-reading.jpg'),
('Favorite', 1, 'collections/favorite.jpg'),
('Favorite', 2, 'collections/favorite.jpg'),
('Favorite', 3, 'collections/favorite.jpg'),
('Favorite', 4, 'collections/favorite.jpg'),
('Favorite', 5, 'collections/favorite.jpg'),
('Favorite', 6, 'collections/favorite.jpg'),
('Summer Reading 2024', 1, 'https://example.com/col1.jpg'),
('All-Time Favorites', 2, NULL),
('To Read Pile', 3, 'https://example.com/col3.jpg');

-- BOOK_COLLECTION (Linking Books to Collections)
INSERT INTO BookCollection (book_id, collection_id) VALUES
(1, 1),
(2, 1),
(1, 2),
(2, 2),
(1, 3),
(2, 3),
(1, 4),
(2, 4),
(1, 5),
(2, 5),
(1, 6),
(2, 6),
(1, 7),
(2, 7),
(1, 8),
(2, 8),
(1, 9),
(2, 9),
(1, 10),
(2, 10),
(1, 11),
(2, 11),
(1, 12),
(2, 12),
(5, 2),
(3, 3),
(4, 3);

-- REVIEW
INSERT INTO Review (comment, rating, book_id, user_id) VALUES
('Absolutely loved the twist at the end!', 5, 1, 1),
('A bit slow in the middle, but great world-building.', 4, 2, 3),
('Changed my perspective entirely. Highly recommend.', 5, 3, 4),
('Decent thriller, but the ending was a bit predictable.', 3, 4, 1),
('Incredibly detailed and well-researched.', 5, 5, 2);

-- LIKES (Likes on Reviews)
INSERT INTO Likes (user_id, review_id) VALUES
(2, 1),
(3, 1),
(4, 2),
(1, 3),
(5, 5);

-- REPLY (Replies to Reviews)
INSERT INTO Reply (comment, user_id, review_id) VALUES
('I totally agree, the twist was crazy!', 2, 1),
('Did you find the technical jargon hard to follow?', 1, 2),
('Which chapter helped you the most?', 5, 3),
('I actually really liked the ending!', 3, 4),
('Thanks for the recommendation, adding it to my list.', 4, 5);