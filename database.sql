CREATE DATABASE safeRide;

CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    user_name varchar(100) NOT NULL,
    user_surname varchar(100) NOT NULL,
    user_email varchar(100) NOT NULL UNIQUE,
    user_phone varchar(100) NOT NULL UNIQUE,
    user_password varchar(100) NOT NULL,
    user_role varchar(100) NOT NULL,
    user_country varchar(100) NOT NULL,
    user_city varchar(100) NOT NULL,
    user_address varchar(100) NOT NULL,
    user_birthdate varchar(100) NOT NULL
);

CREATE TABLE children (
    id int PRIMARY KEY NOT NULL UNIQUE,
    name varchar(100) NOT NULL,
    surname varchar(100) NOT NULL,
    email varchar(100) NOT NULL UNIQUE,
    phone varchar(100) NOT NULL UNIQUE
);

CREATE TABLE company (
    id int PRIMARY KEY NOT NULL UNIQUE,
    name varchar(100) NOT NULL,
    date_joined DATE NOT NULL,
    email varchar(100) NOT NULL UNIQUE,
    phone varchar(100) NOT NULL,
    password varchar(100) NOT NULL,
    role varchar(100) NOT NULL,
    country varchar(100) NOT NULL,
    city varchar(100) NOT NULL,
    address varchar NOT NULL
);

CREATE TABLE companyAdmin (
    name varchar(100) NOT NULL,
    surname varchar(100) NOT NULL,
    email varchar(100) NOT NULL UNIQUE,
    phone varchar(100) NOT NULL,
    password varchar(100) NOT NULL,
    role varchar(100) NOT NULL,
    country varchar(100) NOT NULL,
    city varchar(100) NOT NULL,
    address varchar(100) NOT NULL,
    birthdate date NOT NULL,
    company_id int PRIMARY KEY NOT NULL UNIQUE
);

CREATE TABLE trips (
    id int NOT NULL UNIQUE,
    date_started DATE NOT NULL,
    bus_id int NOT NULL UNIQUE,
    bus_driver_id int NOT NULL UNIQUE,
    passenger int[],
    PRIMARY KEY (id, bus_id, bus_driver_id)
);

CREATE TABLE bus (
    id int NOT NULL UNIQUE,
    model varchar(100) NOT NULL,
    company_id integer NOT NULL UNIQUE,
    bus_driver_id varchar(100) NOT NULL UNIQUE,
    PRIMARY KEY (id, company_id, bus_driver_id)
);

CREATE TABLE busDriver (
    id int PRIMARY KEY,
    name varchar(100) NOT NULL,
    surname varchar(100) NOT NULL,
    email varchar(100) NOT NULL,
    phone varchar(100) NOT NULL
);

--psql -U postgres
--\c safeRide
--\dt
--heroku pg:psql