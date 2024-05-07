create database banco;
\c banco;

create table transferencias(
    id serial primary key,
    descripcion varchar(50),
    fecha varchar(10),
    monto decimal,
    cuanta_origen int,
    cuenta_destino int,
    foreign key(cuanta_origen) references cuentas(id),
    foreign key(cuenta_destino) references cuentas(id) 
);

create table cuentas(
    id int primary key,
    saldo decimal check (saldo >=0)
);

insert into cuentas values(1,20000);
insert into cuentas values(2,10000);
