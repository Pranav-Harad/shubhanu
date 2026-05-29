-- SHUBHANU PostgreSQL Microservices Databases Initialization
-- Runs automatically when the docker container starts for the first time

CREATE DATABASE shubhanu_auth;
CREATE DATABASE shubhanu_user;
CREATE DATABASE shubhanu_gamification;

-- Verification Logs
\c shubhanu_auth;
CREATE TABLE IF NOT EXISTS init_log (
  id SERIAL PRIMARY KEY,
  message VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO init_log (message) VALUES ('Auth Service Database Initialized Successfully');

\c shubhanu_user;
CREATE TABLE IF NOT EXISTS init_log (
  id SERIAL PRIMARY KEY,
  message VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO init_log (message) VALUES ('User Service Database Initialized Successfully');

\c shubhanu_gamification;
CREATE TABLE IF NOT EXISTS init_log (
  id SERIAL PRIMARY KEY,
  message VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO init_log (message) VALUES ('Gamification Service Database Initialized Successfully');
