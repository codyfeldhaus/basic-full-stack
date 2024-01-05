--Command to create 'users' table
--Three columns: id, which will auto increment and function as the primary key
--And then a first_name and last_name column that are varchar's less than 100 and last name 
--cannot be null.

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100) NOT NULL
);

-- CREATE TABLE users (
--   id SERIAL,
--   first_name VARCHAR(100),
--   last_name VARCHAR(100),
--   PRIMARY KEY (id),
--   CONSTRAINT last_name_not_null CHECK (last_name IS NOT NULL) //last_name != null
-- );

--fails because last_name would be null
INSERT INTO users (first_name) VALUES ('Cody');


INSERT INTO users (last_name) VALUES ('Smith');

--Using ChatGPT, generate a SQL command to insert at least
--20 names into your table at once. Some of the first names
--can and should be null, last names cannot be null.
--at least some last names should be reused

INSERT INTO users (first_name, last_name) VALUES 
(NULL, 'Smith'),
('John', 'Doe'),
('Jane', 'Doe'),
(NULL, 'Johnson'),
('Emily', 'Clark'),
('Michael', 'Smith'),
('Linda', 'Davis'),
(NULL, 'Miller'),
('Patricia', 'Taylor'),
('David', 'Anderson'),
('Jennifer', 'Doe'),
('Richard', 'Jackson'),
('Barbara', 'White'),
('Joseph', 'Harris'),
('Susan', 'Miller'),
('Charles', 'Thompson'),
('Angela', 'Garcia'),
('Thomas', 'Martinez'),
(NULL, 'Robinson'),
('Christopher', 'Smith');

--write a query to select all rows with last name Smith
SELECT * 
FROM users 
WHERE last_name = 'Smith';

--write a query to select all rows with last name Smith and non null first name
SELECT *
FROM users
WHERE last_name = 'Smith' AND first_name IS NOT NULL; 

--Command to create our registrations table
--Columns: username and password as varchar and reg_time as TIMESTAMP
CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,
  username VARCHAR(20) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  reg_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);