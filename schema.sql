-- ============================================================
-- Bible Lesson Database Schema
-- ============================================================

CREATE TABLE categories (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE  -- Elementary, High School, College/Adults
);

CREATE TABLE lessons (
    id          SERIAL PRIMARY KEY,
    category_id INT          NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    created_at  TIMESTAMP    DEFAULT NOW()
);

CREATE TABLE questions (
    id         SERIAL PRIMARY KEY,
    lesson_id  INT       NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    text       TEXT      NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE choices (
    id          SERIAL PRIMARY KEY,
    question_id INT     NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    text        TEXT    NOT NULL,
    is_correct  BOOLEAN NOT NULL DEFAULT FALSE
);

-- ============================================================
-- Enable Row Level Security
-- ============================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons    ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE choices    ENABLE ROW LEVEL SECURITY;

-- Allow public read access on all tables
CREATE POLICY "public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "public read lessons"    ON lessons    FOR SELECT USING (true);
CREATE POLICY "public read questions" ON questions  FOR SELECT USING (true);
CREATE POLICY "public read choices"   ON choices    FOR SELECT USING (true);

-- ============================================================
-- Seed: Categories
-- ============================================================

INSERT INTO categories (name) VALUES
    ('Elementary'),
    ('High School'),
    ('College/Adults');
