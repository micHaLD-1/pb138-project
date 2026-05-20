-- ── Enums are already created by drizzle, just insert data ───────────────────

-- ── Library settings ──────────────────────────────────────────────────────────
INSERT INTO library_setting (key, value, updated_at) VALUES
  ('fineAmountPerDay', '0.50', NOW()),
  ('maxLoanDays', '30', NOW()),
  ('maxRenewals', '2', NOW()),
  ('reservationValidityHours', '48', NOW())
ON CONFLICT (key) DO NOTHING;

-- ── Publishers ────────────────────────────────────────────────────────────────
INSERT INTO publisher (name) VALUES
  ('Penguin Books'),
  ('HarperCollins'),
  ('Random House'),
  ('Bloomsbury'),
  ('Knopf'),
  ('Odeon'),
  ('Host'),
  ('Argo');

-- ── Authors ───────────────────────────────────────────────────────────────────
INSERT INTO author (first_name, last_name) VALUES
  ('J.R.R.', 'Tolkien'),
  ('George', 'Orwell'),
  ('Frank', 'Herbert'),
  ('J.K.', 'Rowling'),
  ('Stephen', 'King'),
  ('Agatha', 'Christie'),
  ('Ernest', 'Hemingway'),
  ('Franz', 'Kafka'),
  ('Gabriel García', 'Márquez'),
  ('Fyodor', 'Dostoevsky'),
  ('Leo', 'Tolstoy'),
  ('Virginia', 'Woolf'),
  ('Albert', 'Camus'),
  ('Haruki', 'Murakami'),
  ('Isaac', 'Asimov'),
  ('Philip K.', 'Dick'),
  ('Ursula K.', 'Le Guin'),
  ('Cormac', 'McCarthy'),
  ('Toni', 'Morrison'),
  ('Milan', 'Kundera');

-- ── Genres ────────────────────────────────────────────────────────────────────
INSERT INTO genre (name) VALUES
  ('Fantasy'),
  ('Sci-Fi'),
  ('Dystopian'),
  ('Mystery'),
  ('Horror'),
  ('Romance'),
  ('Historical Fiction'),
  ('Literary Fiction'),
  ('Thriller'),
  ('Classic');

-- ── Books ─────────────────────────────────────────────────────────────────────
INSERT INTO book (title, year_published, language, description, id_publisher) VALUES
  ('The Hobbit', 1937, 'English', 'A fantasy adventure following Bilbo Baggins on an epic journey with dwarves to reclaim their homeland from the dragon Smaug.', 1),
  ('1984', 1949, 'English', 'A haunting dystopian novel set in a totalitarian society ruled by Big Brother, following Winston Smith who begins to question the regime.', 2),
  ('Dune', 1965, 'English', 'An epic science fiction saga set on the desert planet Arrakis, the only source of the universe most valuable substance — spice.', 3),
  ('Harry Potter and the Philosopher''s Stone', 1997, 'English', 'A young boy discovers he is a wizard and attends Hogwarts School of Witchcraft and Wizardry.', 4),
  ('The Shining', 1977, 'English', 'A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence.', 2),
  ('Murder on the Orient Express', 1934, 'English', 'Detective Hercule Poirot investigates a murder on the famous Orient Express train.', 1),
  ('The Old Man and the Sea', 1952, 'English', 'An aging Cuban fisherman struggles with a giant marlin far out in the Gulf Stream.', 3),
  ('The Trial', 1925, 'German', 'Josef K. is arrested and prosecuted by a remote authority for an unspecified crime.', 8),
  ('One Hundred Years of Solitude', 1967, 'Spanish', 'The multi-generational story of the Buendía family in the fictional town of Macondo.', 5),
  ('Crime and Punishment', 1866, 'Russian', 'A young student commits a murder and struggles with guilt, paranoia and redemption in St. Petersburg.', 6),
  ('The Lord of the Rings', 1954, 'English', 'The epic quest to destroy the One Ring and defeat the dark lord Sauron.', 1),
  ('Animal Farm', 1945, 'English', 'A satirical allegorical novella reflecting events leading up to the Russian Revolution.', 2),
  ('Norwegian Wood', 1987, 'Japanese', 'A nostalgic story of loss and sexuality set in Tokyo during the late 1960s.', 5),
  ('Foundation', 1951, 'English', 'A mathematician develops psychohistory to predict the fall of a galactic empire and minimize the dark age that follows.', 3),
  ('The Left Hand of Darkness', 1969, 'English', 'A human envoy visits a planet whose inhabitants have no fixed gender in this landmark of science fiction.', 2),
  ('The Road', 2006, 'English', 'A father and son journey through a post-apocalyptic America, struggling to survive and maintain their humanity.', 5),
  ('Beloved', 1987, 'English', 'A former slave is haunted by the ghost of her dead daughter in post-Civil War Ohio.', 3),
  ('The Unbearable Lightness of Being', 1984, 'Czech', 'A philosophical novel about two couples in Prague during and after the Prague Spring of 1968.', 7),
  ('Do Androids Dream of Electric Sheep?', 1968, 'English', 'In a post-nuclear future, a bounty hunter tracks down rogue androids in a decaying San Francisco.', 3),
  ('The Metamorphosis', 1915, 'German', 'Gregor Samsa wakes up one morning to find himself transformed into a giant insect.', 8);

-- ── Book authors ──────────────────────────────────────────────────────────────
INSERT INTO book_author (id_book, id_author) VALUES
  (1, 1),   -- The Hobbit - Tolkien
  (2, 2),   -- 1984 - Orwell
  (3, 3),   -- Dune - Herbert
  (4, 4),   -- Harry Potter - Rowling
  (5, 5),   -- The Shining - King
  (6, 6),   -- Murder on the Orient Express - Christie
  (7, 7),   -- The Old Man and the Sea - Hemingway
  (8, 8),   -- The Trial - Kafka
  (9, 9),   -- One Hundred Years of Solitude - García Márquez
  (10, 10), -- Crime and Punishment - Dostoevsky
  (11, 1),  -- The Lord of the Rings - Tolkien
  (12, 2),  -- Animal Farm - Orwell
  (13, 14), -- Norwegian Wood - Murakami
  (14, 15), -- Foundation - Asimov
  (15, 17), -- The Left Hand of Darkness - Le Guin
  (16, 18), -- The Road - McCarthy
  (17, 19), -- Beloved - Morrison
  (18, 20), -- The Unbearable Lightness of Being - Kundera
  (19, 16), -- Do Androids Dream of Electric Sheep? - Philip K. Dick
  (20, 8);  -- The Metamorphosis - Kafka

-- ── Book genres ───────────────────────────────────────────────────────────────
INSERT INTO book_genre (id_book, id_genre) VALUES
  (1, 1),   -- The Hobbit - Fantasy
  (2, 3),   -- 1984 - Dystopian
  (2, 10),  -- 1984 - Classic
  (3, 2),   -- Dune - Sci-Fi
  (4, 1),   -- Harry Potter - Fantasy
  (5, 5),   -- The Shining - Horror
  (5, 9),   -- The Shining - Thriller
  (6, 4),   -- Murder on the Orient Express - Mystery
  (7, 10),  -- The Old Man and the Sea - Classic
  (7, 8),   -- The Old Man and the Sea - Literary Fiction
  (8, 8),   -- The Trial - Literary Fiction
  (8, 10),  -- The Trial - Classic
  (9, 8),   -- One Hundred Years of Solitude - Literary Fiction
  (10, 8),  -- Crime and Punishment - Literary Fiction
  (10, 10), -- Crime and Punishment - Classic
  (11, 1),  -- The Lord of the Rings - Fantasy
  (12, 3),  -- Animal Farm - Dystopian
  (12, 10), -- Animal Farm - Classic
  (13, 8),  -- Norwegian Wood - Literary Fiction
  (13, 6),  -- Norwegian Wood - Romance
  (14, 2),  -- Foundation - Sci-Fi
  (15, 2),  -- The Left Hand of Darkness - Sci-Fi
  (16, 8),  -- The Road - Literary Fiction
  (17, 8),  -- Beloved - Literary Fiction
  (17, 7),  -- Beloved - Historical Fiction
  (18, 8),  -- The Unbearable Lightness of Being - Literary Fiction
  (19, 2),  -- Do Androids Dream of Electric Sheep? - Sci-Fi
  (19, 3),  -- Do Androids Dream of Electric Sheep? - Dystopian
  (20, 8),  -- The Metamorphosis - Literary Fiction
  (20, 10); -- The Metamorphosis - Classic

-- ── Book copies ───────────────────────────────────────────────────────────────
INSERT INTO book_copy (status, id_book) VALUES
  ('AVAILABLE', 1), ('AVAILABLE', 1), ('AVAILABLE', 1),  -- The Hobbit
  ('AVAILABLE', 2), ('AVAILABLE', 2), ('RESERVED', 2),   -- 1984
  ('AVAILABLE', 3), ('AVAILABLE', 3),                     -- Dune
  ('AVAILABLE', 4), ('AVAILABLE', 4), ('AVAILABLE', 4),  -- Harry Potter
  ('AVAILABLE', 5), ('BORROWED', 5),                      -- The Shining
  ('AVAILABLE', 6), ('AVAILABLE', 6),                     -- Murder on the Orient Express
  ('AVAILABLE', 7),                                        -- The Old Man and the Sea
  ('AVAILABLE', 8), ('AVAILABLE', 8),                     -- The Trial
  ('AVAILABLE', 9), ('BORROWED', 9),                      -- One Hundred Years of Solitude
  ('AVAILABLE', 10), ('AVAILABLE', 10),                   -- Crime and Punishment
  ('AVAILABLE', 11), ('AVAILABLE', 11), ('AVAILABLE', 11),-- The Lord of the Rings
  ('AVAILABLE', 12), ('AVAILABLE', 12),                   -- Animal Farm
  ('AVAILABLE', 13),                                       -- Norwegian Wood
  ('AVAILABLE', 14), ('AVAILABLE', 14),                   -- Foundation
  ('AVAILABLE', 15),                                       -- The Left Hand of Darkness
  ('AVAILABLE', 16), ('AVAILABLE', 16),                   -- The Road
  ('AVAILABLE', 17),                                       -- Beloved
  ('AVAILABLE', 18), ('AVAILABLE', 18),                   -- The Unbearable Lightness of Being
  ('AVAILABLE', 19),                                       -- Do Androids Dream of Electric Sheep?
  ('AVAILABLE', 20), ('AVAILABLE', 20);                   -- The Metamorphosis

-- ── Users ─────────────────────────────────────────────────────────────────────
INSERT INTO "user" (role, first_name, last_name, email, password_hash) VALUES
  ('ADMIN', 'Admin', 'Systémový', 'admin@knihovna.cz', '$argon2id$v=19$m=65536,t=2,p=1$P/cIy6XHUgx1oCF3/tDIw2fpoL649K32O5lk+BWFQAY$xvEwUhO6ThVzmxkoFm4gUHh0taPv91+tq2wjAFsOBPA'),
  ('STAFF', 'Jana', 'Nováková', 'jana.novakova@knihovna.cz', '$argon2id$v=19$m=65536,t=2,p=1$P/cIy6XHUgx1oCF3/tDIw2fpoL649K32O5lk+BWFQAY$xvEwUhO6ThVzmxkoFm4gUHh0taPv91+tq2wjAFsOBPA'),
  ('STAFF', 'Petr', 'Svoboda', 'petr.svoboda@knihovna.cz', '$argon2id$v=19$m=65536,t=2,p=1$P/cIy6XHUgx1oCF3/tDIw2fpoL649K32O5lk+BWFQAY$xvEwUhO6ThVzmxkoFm4gUHh0taPv91+tq2wjAFsOBPA'),
  ('MEMBER', 'Marie', 'Dvořáková', 'marie.dvorakova@email.cz', '$argon2id$v=19$m=65536,t=2,p=1$P/cIy6XHUgx1oCF3/tDIw2fpoL649K32O5lk+BWFQAY$xvEwUhO6ThVzmxkoFm4gUHh0taPv91+tq2wjAFsOBPA'),
  ('MEMBER', 'Tomáš', 'Blaho', 'tomas.blaho@email.cz', '$argon2id$v=19$m=65536,t=2,p=1$P/cIy6XHUgx1oCF3/tDIw2fpoL649K32O5lk+BWFQAY$xvEwUhO6ThVzmxkoFm4gUHh0taPv91+tq2wjAFsOBPA'),
  ('MEMBER', 'Lucie', 'Marková', 'lucie.markova@email.cz', '$argon2id$v=19$m=65536,t=2,p=1$P/cIy6XHUgx1oCF3/tDIw2fpoL649K32O5lk+BWFQAY$xvEwUhO6ThVzmxkoFm4gUHh0taPv91+tq2wjAFsOBPA'),
  ('MEMBER', 'Ondřej', 'Procházka', 'ondrej.prochazka@email.cz', '$argon2id$v=19$m=65536,t=2,p=1$P/cIy6XHUgx1oCF3/tDIw2fpoL649K32O5lk+BWFQAY$xvEwUhO6ThVzmxkoFm4gUHh0taPv91+tq2wjAFsOBPA'),
  ('MEMBER', 'Tereza', 'Horáková', 'tereza.horakova@email.cz', '$argon2id$v=19$m=65536,t=2,p=1$P/cIy6XHUgx1oCF3/tDIw2fpoL649K32O5lk+BWFQAY$xvEwUhO6ThVzmxkoFm4gUHh0taPv91+tq2wjAFsOBPA');

-- ── Reservations ──────────────────────────────────────────────────────────────
INSERT INTO reservation (from_date, to_date, price, status, date_of_reservation, validity_of_pick_up_until, id_user, id_book_copy) VALUES
  ('2026-05-01', '2026-05-15', 0.00, 'ACTIVE', '2026-04-27', '2026-04-29', 4, 6),
  ('2026-05-05', '2026-05-19', 0.00, 'ACTIVE', '2026-04-27', '2026-04-29', 5, 3),
  ('2026-04-01', '2026-04-15', 0.00, 'CANCELED', '2026-03-30', '2026-04-01', 6, 1);

-- ── Loans ─────────────────────────────────────────────────────────────────────
INSERT INTO loan (price, status, loan_date, expected_return_date, actual_return_date, id_user, id_book_copy) VALUES
  (0.00, 'ACTIVE', '2026-04-10', '2026-05-10', NULL, 4, 13),
  (0.00, 'ACTIVE', '2026-04-15', '2026-05-15', NULL, 5, 21),
  (1.50, 'RETURNED', '2026-03-01', '2026-03-31', '2026-04-03', 6, 8),
  (0.00, 'RETURNED', '2026-03-10', '2026-04-10', '2026-04-09', 7, 2);

-- ── Reviews ───────────────────────────────────────────────────────────────────
INSERT INTO review (content, created_at, id_user, id_book) VALUES
  ('Úžasná kniha! Tolkien vytvořil neuvěřitelný svět plný magie a dobrodružství.', '2026-03-15 10:30:00', 4, 1),
  ('Varovná kniha pro každou dobu. Orwellova vize totalitarismu je děsivě aktuální.', '2026-03-20 14:00:00', 5, 2),
  ('Herbert napsal mistrovské dílo. Komplexní svět s hlubokou filozofií.', '2026-04-01 09:15:00', 6, 3),
  ('Klasika, která nikdy nezestárne. Dokonalé napětí až do poslední stránky.', '2026-04-05 16:45:00', 7, 6),
  ('Jedna z nejkrásnějších knih, které jsem kdy četla. Dojemné a hluboké.', '2026-04-10 11:00:00', 8, 13);