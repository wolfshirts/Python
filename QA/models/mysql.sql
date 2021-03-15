# Create tables in db.

CREATE DATABASE sdc;
USE sdc;

CREATE TABLE questions(
  product_id INT NOT NULL UNIQUE,
  question_id INT NOT NULL AUTO_INCREMENT UNIQUE,
  question_date DATE NOT NULL,
  question_body VARCHAR(1000) NOT NULL,
  asker_name VARCHAR(60) NOT NULL,
  asker_email VARCHAR(60),
  question_helpfulness INT DEFAULT 0,
  reported BOOLEAN DEFAULT false,
  PRIMARY KEY(question_id)
);

CREATE TABLE answers(
  product_id INT NOT NULL UNIQUE,
  answer_id INT NOT NULL AUTO_INCREMENT UNIQUE,
  question_id INT NOT NULL,
  body VARCHAR(1000) NOT NULL,
  answer_date DATE NOT NULL,
  answerer_name VARCHAR(60) NOT NULL,
  helpfulness INT DEFAULT 0,
  reported BOOLEAN DEFAULT false,
  photos BOOLEAN DEFAULT false,
  PRIMARY KEY (answer_id)
);

CREATE TABLE photos(
  answer_id INT NOT NULL UNIQUE,
  photo_1 VARCHAR(1000),
  photo_2 VARCHAR(1000),
  photo_3 VARCHAR(1000),
  photo_4 VARCHAR(1000),
  photo_5 VARCHAR(1000)
);