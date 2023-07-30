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
    children_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    children_name varchar(100) NOT NULL,
    children_surname varchar(100) NOT NULL,
    children_email varchar(100) NOT NULL UNIQUE,
    children_phone varchar(100) NOT NULL UNIQUE
);

CREATE TABLE company (
    company_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name varchar(100) NOT NULL,
    date_joined DATE NOT NULL,
    company_email varchar(100) NOT NULL UNIQUE,
    company_phone varchar(100) NOT NULL,
    company_password varchar(100) NOT NULL,
    company_role varchar(100) NOT NULL,
    company_country varchar(100) NOT NULL,
    company_city varchar(100) NOT NULL,
    company_address varchar(100) NOT NULL
);

CREATE TABLE busDriver (
    bus_driver_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(100) NOT NULL,
    surname varchar(100) NOT NULL,
    email varchar(100) NOT NULL,
    phone varchar(100) NOT NULL
);

CREATE TABLE companyAdmin (
    company_admin_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    company_id uuid,
    CONSTRAINT fk_company_id
        FOREIGN KEY(company_id)
        REFERENCES company(company_id)
);

CREATE TABLE bus (
    bus_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    bus_model varchar(100) NOT NULL,
    company_id uuid,
    bus_driver_id uuid,
    CONSTRAINT fk_bus_driver_id
        FOREIGN KEY(bus_driver_id)
        REFERENCES busDriver(bus_driver_id),
    CONSTRAINT fk_company_id
        FOREIGN KEY(company_id)
        REFERENCES company(company_id)
);

CREATE TABLE trips (
    trip_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    date_started DATE NOT NULL,
    bus_id uuid,
    bus_driver_id uuid,
    passenger int[],
    CONSTRAINT fk_bus_id
        FOREIGN KEY(bus_id)
        REFERENCES bus(bus_id),
    CONSTRAINT fk_bus_driver_id
        FOREIGN KEY(bus_driver_id)
        REFERENCES busDriver(bus_driver_id)
);

--psql -U postgres
--\c safeRide
--\dt
--heroku pg:psql