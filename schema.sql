-- ============================================================
-- Bible Lesson Database Schema
-- ============================================================

CREATE TABLE categories (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE lessons (
    id          SERIAL PRIMARY KEY,
    category_id INT          NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    content     TEXT,
    created_at  TIMESTAMP    DEFAULT NOW()
);

CREATE TABLE questions (
    id         SERIAL PRIMARY KEY,
    lesson_id  INT       NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    text       TEXT      NOT NULL,
    discussion TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE choices (
    id          SERIAL PRIMARY KEY,
    question_id INT     NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    text        TEXT    NOT NULL,
    is_correct  BOOLEAN NOT NULL DEFAULT FALSE,
    explanation TEXT
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons    ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE choices    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "public read lessons"    ON lessons    FOR SELECT USING (true);
CREATE POLICY "public read questions"  ON questions  FOR SELECT USING (true);
CREATE POLICY "public read choices"    ON choices    FOR SELECT USING (true);

-- ============================================================
-- Seed: Categories
-- ============================================================

INSERT INTO categories (name) VALUES
    ('Elementary'),
    ('High School'),
    ('College/Adults');

-- ============================================================
-- Seed: Lessons (2 per category — lesson 1 is free)
-- ============================================================

INSERT INTO lessons (category_id, title, description) VALUES
    (1, 'God Made Everything', 'Learn how God created the world and everything in it.'),
    (1, 'Jesus Loves Me',      'Discover how much Jesus loves each one of us.'),
    (2, 'Who Is God?',         'Explore the nature and character of God.'),
    (2, 'The Life of Jesus',   'A deeper look at the life and ministry of Jesus Christ.'),
    (3, 'Creation and Purpose','Understanding God''s design and our purpose in His plan.'),
    (3, 'Faith and Works',     'Examining the relationship between faith and action in the Christian life.');

-- ============================================================
-- Seed: Questions & Choices
-- ============================================================

-- -------------------------------------------------------
-- ELEMENTARY — Lesson 1: God Made Everything (lesson id 1)
-- -------------------------------------------------------

INSERT INTO questions (lesson_id, text, discussion) VALUES
(1,
 'On which day did God create light?',
 'In the beginning, God created the heavens and the earth. The very first thing God spoke into existence was light. Genesis 1:3 says, "And God said, Let there be light: and there was light." This shows us that God is the source of all light — both physical and spiritual. Before God spoke, everything was dark and empty. With just His words, He brought light into the world. This reminds us that God''s Word is powerful and that He can bring light into any dark situation in our lives too.'
),
(1,
 'What did God create on the second day?',
 'After creating light on the first day, God continued His work of creation. On the second day, God made the sky — a great expanse that separated the waters above from the waters below. Genesis 1:6-8 tells us, "And God said, Let there be a firmament in the midst of the waters." God was carefully designing a world that would be perfect for life. Every detail of creation shows His wisdom and care for us.'
),
(1,
 'What did God say about everything He had made?',
 'After six days of creation, God looked at everything He had made. The Bible tells us in Genesis 1:31, "God saw all that he had made, and it was very good." God did not just say it was good — He said it was VERY good. This means that everything God creates is perfect and has a purpose. You are part of God''s creation, and that means you are very good too! God made you on purpose and with purpose.'
),
(1,
 'On which day did God rest?',
 'After creating everything in six days, God rested on the seventh day. Genesis 2:2-3 says, "By the seventh day God had finished the work he had been doing; so on the seventh day he rested from all his work." God blessed the seventh day and made it holy. This is where the idea of the Sabbath comes from — a special day of rest and worship. God set this example for us to show that rest is important and that we should take time to honor Him.'
),
(1,
 'Who did God make in His own image?',
 'The most special part of creation was when God made human beings. Genesis 1:27 says, "So God created mankind in his own image, in the image of God he created them; male and female he created them." Being made in God''s image means we are special above all other creatures. We can think, love, make choices, and have a relationship with God. This is what makes people different from animals. You are made in the image of God — that is something truly amazing!'
);

-- Choices for Elementary Lesson 1
INSERT INTO choices (question_id, text, is_correct) VALUES
-- Q1
((SELECT id FROM questions WHERE lesson_id=1 ORDER BY id LIMIT 1 OFFSET 0), 'Day 1', true),
((SELECT id FROM questions WHERE lesson_id=1 ORDER BY id LIMIT 1 OFFSET 0), 'Day 2', false),
((SELECT id FROM questions WHERE lesson_id=1 ORDER BY id LIMIT 1 OFFSET 0), 'Day 3', false),
((SELECT id FROM questions WHERE lesson_id=1 ORDER BY id LIMIT 1 OFFSET 0), 'Day 4', false),
-- Q2
((SELECT id FROM questions WHERE lesson_id=1 ORDER BY id LIMIT 1 OFFSET 1), 'Land and sea', false),
((SELECT id FROM questions WHERE lesson_id=1 ORDER BY id LIMIT 1 OFFSET 1), 'The sky', true),
((SELECT id FROM questions WHERE lesson_id=1 ORDER BY id LIMIT 1 OFFSET 1), 'Sun and moon', false),
((SELECT id FROM questions WHERE lesson_id=1 ORDER BY id LIMIT 1 OFFSET 1), 'Animals', false),
-- Q3
((SELECT id FROM questions WHERE lesson_id=1 ORDER BY id LIMIT 1 OFFSET 2), 'It was okay', false),
((SELECT id FROM questions WHERE lesson_id=1 ORDER BY id LIMIT 1 OFFSET 2), 'It was very good', true),
((SELECT id FROM questions WHERE lesson_id=1 ORDER BY id LIMIT 1 OFFSET 2), 'It was not finished', false),
((SELECT id FROM questions WHERE lesson_id=1 ORDER BY id LIMIT 1 OFFSET 2), 'It was confusing', false),
-- Q4
((SELECT id FROM questions WHERE lesson_id=1 ORDER BY id LIMIT 1 OFFSET 3), 'Day 5', false),
((SELECT id FROM questions WHERE lesson_id=1 ORDER BY id LIMIT 1 OFFSET 3), 'Day 6', false),
((SELECT id FROM questions WHERE lesson_id=1 ORDER BY id LIMIT 1 OFFSET 3), 'Day 7', true),
((SELECT id FROM questions WHERE lesson_id=1 ORDER BY id LIMIT 1 OFFSET 3), 'Day 8', false),
-- Q5
((SELECT id FROM questions WHERE lesson_id=1 ORDER BY id LIMIT 1 OFFSET 4), 'Animals', false),
((SELECT id FROM questions WHERE lesson_id=1 ORDER BY id LIMIT 1 OFFSET 4), 'Angels', false),
((SELECT id FROM questions WHERE lesson_id=1 ORDER BY id LIMIT 1 OFFSET 4), 'Human beings', true),
((SELECT id FROM questions WHERE lesson_id=1 ORDER BY id LIMIT 1 OFFSET 4), 'Plants', false);

-- -------------------------------------------------------
-- HIGH SCHOOL — Lesson 1: Who Is God? (lesson id 3)
-- -------------------------------------------------------

INSERT INTO questions (lesson_id, text, discussion) VALUES
(3,
 'Which attribute of God means He is present everywhere at all times?',
 'One of the most comforting truths about God is that He is omnipresent — meaning He is everywhere at all times. Psalm 139:7-8 asks, "Where can I go from your Spirit? Where can I flee from your presence? If I go up to the heavens, you are there; if I make my bed in the depths, you are there." No matter where you are — at school, at home, in your darkest moment — God is right there with you. You are never truly alone. This is not just a theological concept; it is a personal promise from God to you.'
),
(3,
 'What does it mean that God is omniscient?',
 'God''s omniscience means He knows everything — past, present, and future. Psalm 147:5 says, "Great is our Lord and mighty in power; his understanding has no limit." God knows every thought you have ever had, every mistake you have made, and every dream you carry. And yet, knowing all of this, He still loves you completely. His knowledge is not used to condemn us but to guide us. Proverbs 3:5-6 encourages us to trust in the Lord with all our heart and not lean on our own understanding, because His knowledge far surpasses ours.'
),
(3,
 'The Bible says God is love. Which verse directly states this?',
 'One of the most profound statements in all of Scripture is found in 1 John 4:8: "Whoever does not love does not know God, because God is love." This is not just saying God is loving — it says God IS love. Love is not just something God does; it is the very essence of who He is. Everything God does flows from His love — creation, salvation, discipline, and grace. Understanding that God is love changes how we see everything He does in our lives, even the difficult things.'
),
(3,
 'What does God''s holiness primarily mean?',
 'When we say God is holy, we mean He is completely set apart from sin and moral imperfection. Isaiah 6:3 records the angels crying out, "Holy, holy, holy is the Lord Almighty; the whole earth is full of his glory." The repetition of "holy" three times emphasizes the absolute, perfect purity of God. His holiness is not just about being morally clean — it means He is in a category entirely by Himself. Because God is holy, He cannot ignore sin. But because He is also love, He provided a way for us to be made holy through Jesus Christ.'
),
(3,
 'Which of the following best describes the Trinity?',
 'The Trinity is one of the most unique and profound doctrines of Christianity. It teaches that God is one Being who exists eternally as three distinct Persons: the Father, the Son (Jesus), and the Holy Spirit. Matthew 28:19 references all three: "baptizing them in the name of the Father and of the Son and of the Holy Spirit." Each Person is fully God, yet there is only one God. This is not three gods — it is one God in three Persons. The Trinity shows us that God is relational by nature, and that love and community exist within God Himself.'
);

INSERT INTO choices (question_id, text, is_correct) VALUES
-- Q1
((SELECT id FROM questions WHERE lesson_id=3 ORDER BY id LIMIT 1 OFFSET 0), 'Omnipotent', false),
((SELECT id FROM questions WHERE lesson_id=3 ORDER BY id LIMIT 1 OFFSET 0), 'Omniscient', false),
((SELECT id FROM questions WHERE lesson_id=3 ORDER BY id LIMIT 1 OFFSET 0), 'Omnipresent', true),
((SELECT id FROM questions WHERE lesson_id=3 ORDER BY id LIMIT 1 OFFSET 0), 'Sovereign', false),
-- Q2
((SELECT id FROM questions WHERE lesson_id=3 ORDER BY id LIMIT 1 OFFSET 1), 'God is all-powerful', false),
((SELECT id FROM questions WHERE lesson_id=3 ORDER BY id LIMIT 1 OFFSET 1), 'God knows everything', true),
((SELECT id FROM questions WHERE lesson_id=3 ORDER BY id LIMIT 1 OFFSET 1), 'God is everywhere', false),
((SELECT id FROM questions WHERE lesson_id=3 ORDER BY id LIMIT 1 OFFSET 1), 'God never changes', false),
-- Q3
((SELECT id FROM questions WHERE lesson_id=3 ORDER BY id LIMIT 1 OFFSET 2), 'John 3:16', false),
((SELECT id FROM questions WHERE lesson_id=3 ORDER BY id LIMIT 1 OFFSET 2), 'Romans 5:8', false),
((SELECT id FROM questions WHERE lesson_id=3 ORDER BY id LIMIT 1 OFFSET 2), '1 John 4:8', true),
((SELECT id FROM questions WHERE lesson_id=3 ORDER BY id LIMIT 1 OFFSET 2), 'Psalm 23:1', false),
-- Q4
((SELECT id FROM questions WHERE lesson_id=3 ORDER BY id LIMIT 1 OFFSET 3), 'God is powerful', false),
((SELECT id FROM questions WHERE lesson_id=3 ORDER BY id LIMIT 1 OFFSET 3), 'God is completely set apart from sin', true),
((SELECT id FROM questions WHERE lesson_id=3 ORDER BY id LIMIT 1 OFFSET 3), 'God is invisible', false),
((SELECT id FROM questions WHERE lesson_id=3 ORDER BY id LIMIT 1 OFFSET 3), 'God is eternal', false),
-- Q5
((SELECT id FROM questions WHERE lesson_id=3 ORDER BY id LIMIT 1 OFFSET 4), 'Three separate gods', false),
((SELECT id FROM questions WHERE lesson_id=3 ORDER BY id LIMIT 1 OFFSET 4), 'One God in three Persons', true),
((SELECT id FROM questions WHERE lesson_id=3 ORDER BY id LIMIT 1 OFFSET 4), 'God appearing in three forms at different times', false),
((SELECT id FROM questions WHERE lesson_id=3 ORDER BY id LIMIT 1 OFFSET 4), 'A mystery with no explanation', false);

-- -------------------------------------------------------
-- COLLEGE/ADULTS — Lesson 1: Creation and Purpose (lesson id 5)
-- -------------------------------------------------------

INSERT INTO questions (lesson_id, text, discussion) VALUES
(5,
 'According to Genesis 1:1, what is the very first truth the Bible establishes?',
 'The opening verse of the Bible, "In the beginning God created the heavens and the earth," is one of the most significant statements ever written. It immediately establishes that God exists, that He is the Creator, and that the universe had a beginning. This verse confronts every worldview that denies God''s existence or claims the universe is eternal. For the believer, it is the foundation of everything — if God created all things, then He has authority over all things, including our lives. Our purpose, our morality, and our destiny are all grounded in this foundational truth.'
),
(5,
 'What does the Hebrew word "bara" (used in Genesis 1:1) specifically mean?',
 'The Hebrew word "bara" used in Genesis 1:1 is a word exclusively used with God as the subject in the Old Testament. It means to create something out of nothing — what theologians call "creatio ex nihilo." This is significant because it means God did not use pre-existing material to make the universe. He spoke it into existence from nothing. This is a power that belongs to God alone. Hebrews 11:3 affirms this: "By faith we understand that the universe was formed at God''s command, so that what is seen was not made out of what was visible."'
),
(5,
 'What does being made "in the image of God" (Imago Dei) primarily mean for humanity?',
 'The concept of Imago Dei — being made in the image of God — is the theological foundation of human dignity. Genesis 1:27 states that God created humanity in His own image. This does not mean we look like God physically, but that we reflect His attributes: rationality, morality, creativity, relational capacity, and the ability to have dominion. Every human being, regardless of race, status, or ability, carries this divine image. This is why human life is sacred. It also means we were designed for relationship with God — we find our truest purpose when we live in communion with our Creator.'
),
(5,
 'In Jeremiah 29:11, what does God declare about His plans for us?',
 'Jeremiah 29:11 is one of the most beloved verses in Scripture: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future." This was spoken to the Israelites in exile — people who felt forgotten and purposeless. God was reminding them that even in suffering, His plans had not changed. For us today, this verse is a powerful reminder that our lives are not accidents. God has intentional, good plans for each of us. Our purpose is not self-invented — it is God-given and God-sustained.'
),
(5,
 'According to Colossians 1:16, what is the ultimate purpose of all creation?',
 'Colossians 1:16 gives us the clearest statement of creation''s purpose: "For in him all things were created: things in heaven and on earth, visible and invisible... all things have been created through him and for him." The phrase "for him" is the key — everything that exists was made for Jesus Christ. This means the universe is not purposeless or random. It has a destination and a reason. For human beings, this means our deepest purpose is not self-fulfillment but to glorify God and enjoy Him forever. When we align our lives with this purpose, we discover the meaning we were designed for.'
);

INSERT INTO choices (question_id, text, is_correct) VALUES
-- Q1
((SELECT id FROM questions WHERE lesson_id=5 ORDER BY id LIMIT 1 OFFSET 0), 'The earth is very old', false),
((SELECT id FROM questions WHERE lesson_id=5 ORDER BY id LIMIT 1 OFFSET 0), 'God exists and is the Creator', true),
((SELECT id FROM questions WHERE lesson_id=5 ORDER BY id LIMIT 1 OFFSET 0), 'Humans are the center of the universe', false),
((SELECT id FROM questions WHERE lesson_id=5 ORDER BY id LIMIT 1 OFFSET 0), 'Nature is divine', false),
-- Q2
((SELECT id FROM questions WHERE lesson_id=5 ORDER BY id LIMIT 1 OFFSET 1), 'To shape existing matter', false),
((SELECT id FROM questions WHERE lesson_id=5 ORDER BY id LIMIT 1 OFFSET 1), 'To create out of nothing', true),
((SELECT id FROM questions WHERE lesson_id=5 ORDER BY id LIMIT 1 OFFSET 1), 'To organize chaos', false),
((SELECT id FROM questions WHERE lesson_id=5 ORDER BY id LIMIT 1 OFFSET 1), 'To restore what was broken', false),
-- Q3
((SELECT id FROM questions WHERE lesson_id=5 ORDER BY id LIMIT 1 OFFSET 2), 'Humans look exactly like God', false),
((SELECT id FROM questions WHERE lesson_id=5 ORDER BY id LIMIT 1 OFFSET 2), 'Humans reflect God''s attributes and are designed for relationship with Him', true),
((SELECT id FROM questions WHERE lesson_id=5 ORDER BY id LIMIT 1 OFFSET 2), 'Humans are gods themselves', false),
((SELECT id FROM questions WHERE lesson_id=5 ORDER BY id LIMIT 1 OFFSET 2), 'Humans are superior to angels', false),
-- Q4
((SELECT id FROM questions WHERE lesson_id=5 ORDER BY id LIMIT 1 OFFSET 3), 'Plans to test us with hardship', false),
((SELECT id FROM questions WHERE lesson_id=5 ORDER BY id LIMIT 1 OFFSET 3), 'Plans to prosper us and give us hope and a future', true),
((SELECT id FROM questions WHERE lesson_id=5 ORDER BY id LIMIT 1 OFFSET 3), 'Plans that depend on our performance', false),
((SELECT id FROM questions WHERE lesson_id=5 ORDER BY id LIMIT 1 OFFSET 3), 'Plans that change based on our choices', false),
-- Q5
((SELECT id FROM questions WHERE lesson_id=5 ORDER BY id LIMIT 1 OFFSET 4), 'For human enjoyment', false),
((SELECT id FROM questions WHERE lesson_id=5 ORDER BY id LIMIT 1 OFFSET 4), 'For scientific discovery', false),
((SELECT id FROM questions WHERE lesson_id=5 ORDER BY id LIMIT 1 OFFSET 4), 'For and through Jesus Christ', true),
((SELECT id FROM questions WHERE lesson_id=5 ORDER BY id LIMIT 1 OFFSET 4), 'For the angels', false);

-- ============================================================
-- Migration (run on existing DB):
-- ALTER TABLE questions ADD COLUMN IF NOT EXISTS discussion TEXT;
-- ALTER TABLE lessons   ADD COLUMN IF NOT EXISTS content TEXT;
-- ALTER TABLE choices   ADD COLUMN IF NOT EXISTS explanation TEXT;
-- ============================================================
