# Create tables in db.

-- CREATE DATABASE sdc;
-- USE sdc;

CREATE TABLE questions(
  product_id INT,
  id SERIAL UNIQUE,
  date_written DATE NOT NULL,
  body VARCHAR(1000) NOT NULL,
  asker_name VARCHAR(60) NOT NULL,
  asker_email VARCHAR(60),
  helpful INT DEFAULT 0,
  reported BOOLEAN DEFAULT false,
  PRIMARY KEY(id)
);

CREATE TABLE answers(
  id SERIAL UNIQUE,
  question_id INT NOT NULL,
  body VARCHAR(1000) NOT NULL,
  date_written DATE NOT NULL,
  answerer_name VARCHAR(60) NOT NULL,
  answerer_email VARCHAR(60) NOT NULL,
  helpful INT DEFAULT 0,
  reported BOOLEAN DEFAULT false,
  PRIMARY KEY (id)
);

CREATE TABLE photos(
 id SERIAL UNIQUE,
 answer_id INT NOT NULL,
 url VARCHAR(1000) NOT NULL,
 PRIMARY KEY (id)
);