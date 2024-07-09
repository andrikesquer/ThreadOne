-- CREACION DE LA BASE DE DATOS

create database ThreadOne;

use ThreadOne;

-- CREACION DE TABLAS Y RELACIONES

create table generos(
    id_genero int auto_increment primary key,
    genero varchar(100) not null
);

create table usuarios(
    id_usuario int auto_increment primary key,
    nombre_usuario varchar(50) not null,
    apellido_usuario varchar(50) not null,
    fecha_nacimiento_usuario date not null, -- interesa comprobar que el usuario sea mayor de edad o conocer su edad para estadisticas
    fk_genero int, -- interesa conocer el genero del usuario para estadisticas
    email_usuario varchar(50) not null unique,
    telefono_usuario varchar(10) not null unique,
    contrasena_usuario varchar(8) not null,
    fecha_registro_usuario timestamp default current_timestamp,
    foreign key (fk_genero) references generos(id_genero)
);

alter table usuarios add bloqueo boolean default false; -- MODIFICACION DISPARADOR 2

create table direcciones(
	id_direccion int auto_increment primary key,
	calle varchar(50) not null, 
	numero_exterior varchar(6) not null,
	colonia varchar(50) not null,
	cp varchar(5) not null
);

create table departamentos(
	id_departamento int auto_increment primary key,
	departamento varchar(50) not null
);

create table puestos(
	id_puesto int auto_increment primary key,
    puesto varchar(50) not null
);

create table empleados(
    id_empleado int primary key auto_increment,
    nombre_empleado varchar(50) not null,
    apellido_empleado varchar(50) not null, 
    fecha_nacimiento_empleado date not null,
    fk_genero int,
    correo_empleado varchar (50) not null,
    telefono_empleado varchar(10) not null,
    fk_direccion int not null,
    fk_departamento int not null,
    fk_puesto int not null,
    horas_trabajadas_mes int,
    salario float not null,
    fecha_contratacion timestamp default current_timestamp,
    estado boolean not null, -- activo/inactivo
    foreign key (fk_genero) references generos(id_genero),
    foreign key(fk_direccion) references direcciones(id_direccion),
    foreign key (fk_departamento) references departamentos(id_departamento),
    foreign key (fk_puesto) references puestos(id_puesto)
);

create table sucursales(
    id_sucursal int auto_increment primary key, 
    nombre_sucursal varchar(50) not null,
    fk_direccion int not null,
    foreign key(fk_direccion) references direcciones(id_direccion)
);

create table proveedores(
	id_proveedor int auto_increment primary key,
	nombre_proveedor varchar(50) not null,
	nombre_contacto_proveedor varchar (50) not null,
	apellido_contacto_proveedor varchar (50) not null,
	telefono_contacto_proveedor varchar(10) not null,
    email_contacto_proveedor varchar(50) not null,
    fk_direccion int not null, 
    foreign key(fk_direccion) references direcciones(id_direccion)
);

create table tallas(
    id_talla int auto_increment primary key,
    talla varchar(3) not null
);

create table colores(
    id_color int auto_increment primary key,
    color varchar (50) not null
);

create table precios(
	id_precio int auto_increment primary key,
    precio float not null,
    descripcion_articulos varchar (100) not null
);

create table playeras(
    id_playera int auto_increment primary key,
    descripcion_playera varchar(100) not null,
    fk_talla int not null,
    fk_color int not null,
    fk_precio int not null,
    fk_proveedor int not null,
	cantidad_stock int not null,
    foreign key (fk_talla) references tallas(id_talla),
    foreign key (fk_color) references colores(id_color),
    foreign key (fk_precio) references precios(id_precio),
    foreign key (fk_proveedor) references proveedores(id_proveedor)
);

create table tamanos_diseno (
	id_tamano_diseno int auto_increment primary key,
	largo float not null,
	ancho float not null
);

create table disenos(
    id_diseno int auto_increment primary key,
    nombre_diseno varchar(30) not null,
    descripcion_diseno varchar(100),
    fk_color int not null,
    fk_tamano_diseno int not null,
    fk_precio int not null,
    personalizado boolean not null, -- personalizado indica si el diseño fue proporcionado por el cliente o no
    foreign key (fk_color) references colores(id_color),
    foreign key (fk_tamano_diseno) references tamanos_diseno(id_tamano_diseno),
    foreign key (fk_precio) references precios(id_precio)
);

create table playeras_disenos (
	id_playera_diseno int auto_increment primary key,
    fk_playera int not null,
    fk_diseno int not null,
    precio_unitario float,
    foreign key (fk_playera) references playeras(id_playera),
    foreign key (fk_diseno) references disenos(id_diseno)
);

create table tamanos_sticker(
    id_tamano_sticker int auto_increment primary key,
    largo float not null,
    ancho float not null
);

create table stickers(
    id_sticker int auto_increment primary key,
    nombre_sticker varchar(30) not null,
    descripcion_sticker varchar(100),
    fk_tamano_sticker int not null,
    fk_precio int not null,
    cantidad_stock int not null,
    foreign key (fk_tamano_sticker) references tamanos_sticker(id_tamano_sticker),
    foreign key (fk_precio) references precios(id_precio)
);

create table categorias(
	id_categoria int auto_increment primary key, 
	categoria varchar(30) not null -- 'Sticker', 'Playera diseño original', 'Playera diseño personalizado'
);

create table productos(
    id_producto int primary key auto_increment,
    fk_playera_diseno int,
    fk_sticker int,
    fk_categoria int,
    precio_unitario float,
    foreign key (fk_playera_diseno) references playeras_disenos(id_playera_diseno),
    foreign key (fk_sticker) references stickers(id_sticker),
    foreign key (fk_categoria) references categorias(id_categoria)
);

create table favoritos(
	id_favorito int auto_increment primary key,
    fk_usuario int not null,
    foreign key (fk_usuario) references usuarios(id_usuario)
);

create table favoritos_detalles(
	id_favorito int auto_increment primary key,
    fk_favorito int not null,
    fk_producto int not null,
    foreign key (fk_favorito) references favoritos(id_favorito),
    foreign key (fk_producto) references productos(id_producto)
);

create table carrito_compras(
    id_carrito int auto_increment primary key,
    fk_usuario int not null, 
    total_carrito float,
    foreign key (fk_usuario) references usuarios(id_usuario)
);

create table carrito_compra_detalles(
    id_carrito_compra_detalle int auto_increment primary key,
    fk_carrito int not null, 
    fk_producto int not null,
    cantidad int not null,
    subtotal float,
    foreign key (fk_carrito) references carrito_compras(id_carrito),
    foreign key (fk_producto) references productos(id_producto)
);

create table metodos_pago(
	id_metodo_pago int auto_increment primary key,
	metodo_pago varchar(50) not null
);

create table estados_pago(
    id_estado_pago int auto_increment primary key,
    estado_pago varchar(20) not null
);

create table estados_orden(
    id_estado_orden int auto_increment primary key,
    estado_orden varchar(20) not null
);

create table ordenes(
    id_orden int auto_increment primary key,
    fk_usuario int not null, 
    fecha_orden timestamp default current_timestamp,
    fk_sucursal int not null,
    total_orden float,
    fk_metodo_pago int not null,
    fk_estado_pago int not null, 
    fk_estado_orden int not null,
    foreign key (fk_usuario) references usuarios(id_usuario),
    foreign key (fk_sucursal) references sucursales(id_sucursal),
    foreign key (fk_metodo_pago) references metodos_pago(id_metodo_pago),
    foreign key (fk_estado_pago) references estados_pago(id_estado_pago),
    foreign key (fk_estado_orden) references estados_orden(id_estado_orden)
);

create table ordenes_detalles(
    id_orden_detalle int auto_increment primary key, 
    fk_orden int not null, 
    fk_producto int not null, 
    cantidad int not null,
    subtotal float,
    foreign key (fk_orden) references ordenes(id_orden),
    foreign key (fk_producto) references productos(id_producto)
);

-- INSERSION DE DATOS

-- generos
insert into generos (genero) values
('Femenino'), ('Masculino'), ('No binario'), ('Otro');

-- usuarios
insert into usuarios(nombre_usuario, apellido_usuario, fecha_nacimiento_usuario, fk_genero, email_usuario, telefono_usuario, contrasena_usuario) values
('Juan', 'Perez', '2005-01-15', 2, 'juan.perez@gmail.com', '6141234567', 'passwrd1'),
('Maria', 'Lopez', '2000-03-22', 1,'maria.lopez@gmail.com', '6149876543', 'passwrd2'),
('Carlos', 'Gomez', '2004-07-11', 3, 'carlos.gomez@gmail.com', '6186781234', 'passwrd3'),
('Ana', 'Martinez', '2006-01-30', 4, 'ana.martinez@gmail.com', '6564321987', 'passwrd4'),
('Luis', 'Fernandez', '2001-12-05', 2, 'luis.fernandez@gmail.com', '6143217890', 'passwrd5');

-- direcciones -- 6 empleados, 3 proveedores, 3 sucursales
insert into direcciones(calle, numero_exterior, colonia, cp) values
-- empleados
('Avenida de las Flores', 404, 'Prados del Virrey', '31070'),
('Calle Rio Aros y Cholula', 7101, 'San Ignacio', '31100'),
('Calle del Sol', 7430, 'Puerta del Sol', '31060'),
('Av. Tecnológico', 2909, 'Tecnológico', 31200),
('Vialidad Ch-P', 408, 'Desarrollo urbano', 31063),
('Av. Independencia', 5404, 'Santa Rosa', 31050),
-- sucursales
('Perif. de la Juventud', 401, 'Paseos de Chihuahua', 31119),
('C. Libertad', 109, 'Zona Centro', 31000),
('Av. Prol Teófilo Borunda', 11400, 'Labor de terrazas', 31207),
-- proveedores
('Miguel Sigala', 608, '20 Aniversario', 31137),
('C. Monte Everest', 14902, 'Quintas Carolinas', 31146),
('Av, Instituto Tecnológico de Chihuahua', 8501, 'Tierra y Libertad', 31126);

-- departamentos
insert into departamentos(departamento) values
('Recursos humanos'), -- 1
('Marketing y publicidad'), -- 2
('Ventas y atencion al cliente'), -- 3
('Operaciones'), -- 4 gestion de inventarios, logistica y envios, produccion
('Tecnologia'), -- 5 desarrollo y seguridad
('Finanzas'), -- 6
('Diseño y desarrollo de producto'), -- 7
('Gerencia'), -- 8
('Servicios legales'), -- 9
('Limpieza'); -- 10

-- puestos
insert into puestos(puesto) values
('Gerente'),
('Desarrollador'),
('Diseñador'),
('Analista'),
('Vendedor');

-- empleados
insert into empleados (nombre_empleado, apellido_empleado, fecha_nacimiento_empleado, fk_genero, correo_empleado, telefono_empleado, fk_puesto, fk_direccion, fk_departamento, horas_trabajadas_mes, salario, estado) values
('Santiago', 'Medellin', '2005-04-10', 2, 'santiagomed@gmail.com', '6146547890', 2, 1, 8, 160, 50000.00, true),
('Oliver', 'Manriquez', '2005-08-20', 3, 'oliman@gmail.com', '6141421262', 3, 2, 5, 160, 45000.00, true),
('Jorge', 'Chavira', '2004-06-20', 2, 'jorgech@gmail.com', '6147894561', 2, 3, 5, 160, 45000.00, true),
('Brenda', 'Ramos', '2005-02-15', 1, 'brendaram@gmail.com', '6141237894', 1, 4, 7, 160, 40000.00, true),
('Andrik', 'Rivera', '2005-08-25', 2, 'andrikriv@gmail.com', '6149873214', 4, 5, 4, 160, 42000.00, true),
('Alonso', 'Vazquez', '2005-11-30', 2, 'alonsov@example.com', '6146541237', 5, 6, 3, 160, 38000.00, true);

-- sucursales
insert into sucursales (nombre_sucursal, fk_direccion) values
('Centro', 7),
('Norte', 8),
('Sur', 9);

-- proveedores
insert into proveedores(nombre_proveedor, nombre_contacto_proveedor, apellido_contacto_proveedor, telefono_contacto_proveedor, email_contacto_proveedor, fk_direccion) values
('StarCamisetas', 'Maria', 'Garcia', '6149876543', 'maria.garcia@starcamisetas.com', 10),
('PapeleriaExpress', 'Ana', 'Martinez', '6564321987', 'ana.martinez@papeleriaexpress.com', 11),
('Serigrafita', 'Luis', 'Fernandez', '6143217890', 'luis.fernandez@serigrafita.com', 12);

-- tallas
insert into tallas (talla) values
('S'), ('M'), ('L'), ('XL'), ('XXL');

-- colores
insert into colores (color) values
('Blanco'), ('Negro'), ('Gris');

-- precios
insert into precios(precio, descripcion_articulos) values
(200, 'Precio para playeras lisas'),
(100, 'Precio para diseños originales'),
(135, 'Precio para diseños personalizados'),
(20, 'Precio para stickers');

-- playeras
insert into playeras (descripcion_playera, fk_talla, fk_color, fk_precio, fk_proveedor, cantidad_stock) values
-- talla S, 3 colores
('Playera lisa', 1, 1, 1, 1, 0),
('Playera lisa', 1, 2, 1, 1, 6),
('Playera lisa', 1, 3, 1, 1, 7),
-- talla M, 3 colores
('Playera lisa', 2, 1, 1, 1, 60),
('Playera lisa', 2, 2, 1, 1, 35),
('Playera lisa', 2, 3, 1, 1, 10),
-- talla L, 3 colores
('Playera lisa', 3, 1, 1, 1, 91),
('Playera lisa', 3, 2, 1, 1, 52),
('Playera lisa', 3, 3, 1, 1, 0),
-- talla XL, 3 colores
('Playera lisa', 4, 1, 1, 1, 11),
('Playera lisa', 4, 2, 1, 1, 1),
('Playera lisa', 4, 3, 1, 1, 70),
-- talla XXL, 3 colores
('Playera lisa', 5, 1, 1, 1, 81),
('Playera lisa', 5, 2, 1, 1, 20),
('Playera lisa', 5, 3, 1, 1, 56);

-- tamanos_diseno
insert into tamanos_diseno(largo, ancho) values 
(20, 20), -- cm
(30, 20),
(20, 30);

-- playeras_disenos
-- al agregar un nuevo registro a la tabla de diseños, este trigger inserta en la tabla playeras_disenos todas las combinaciones de ese diseño con los registros en la tabla de playeras.
delimiter $$
create trigger generar_playeras_disenos
after insert on disenos
for each row
begin
    declare done int default 0;
    declare playera_id int;
    declare playera_precio float;
    declare diseno_precio float;
    declare cur cursor for select id_playera, fk_precio from playeras;
    declare continue handler for not found set done = 1;

    -- obter el precio del diseño del nuevo registro
    select precio into diseno_precio from precios where id_precio = new.fk_precio;

    open cur;

    read_loop: loop
        fetch cur into playera_id, playera_precio;
        if done then
			leave read_loop;
        end if;

        -- insertar en playeras_disenos sumando los precios de la playera y del diseño
        insert into playeras_disenos (fk_playera, fk_diseno, precio_unitario)
        values (playera_id, new.id_diseno, (select precio from precios where id_precio = playera_precio) + diseno_precio);
    end loop;

    close cur;
end$$
delimiter ;

-- categorias
insert into categorias (categoria) values
('Playera diseño original'),
('Playera diseño personalizado'),
('Sticker');

-- productos
-- al agregar un nuevo registro a la tabla de playeras_disenos, este trigger inserta los datos en productos, añadiendo categoria y precio_unitario.
delimiter $$
create trigger insertar_productos_playeras_disenos
after insert on playeras_disenos
for each row
begin
    declare categoria_id int;
    declare precio float;

    -- obtener el precio del diseño de playera desde la tabla playeras_disenos
    set precio = (select precio_unitario from playeras_disenos where id_playera_diseno = new.id_playera_diseno);

    -- determinar la categoría en función de si el diseño es personalizado o no
    if (select personalizado from disenos where id_diseno = new.fk_diseno) then
        set categoria_id = 2; -- playera diseño personalizado
    else
        set categoria_id = 1; -- playera diseño original
    end if;
    
    -- insertar en la tabla productos
    insert into productos (fk_playera_diseno, fk_categoria, precio_unitario)
    values (new.id_playera_diseno, categoria_id, precio);
end$$
delimiter ;

-- productos
-- al agregar un nuevo registro a la tabla de stickers, este trigger inserta los datos en productos, añadiendo categoria y precio_unitario.
delimiter $$
create trigger insertar_productos_stickers
after insert on stickers
for each row
begin
    declare categoria_id int;
    declare precio float;

	-- obtener el precio del sticker desde la tabla precios usando el fk_precio
    set precio = (select p.precio from precios p join stickers s on p.id_precio = s.fk_precio where s.id_sticker = new.id_sticker);
    
    -- asignar la categoría para stickers
    set categoria_id = 3; -- Sticker

    -- insertar en la tabla productos
    insert into productos (fk_sticker, fk_categoria, precio_unitario)
    values (new.id_sticker, categoria_id, precio);
end$$
delimiter ;

-- disenos
insert into disenos (nombre_diseno, descripcion_diseno, fk_color, fk_tamano_diseno, fk_precio, personalizado) values
-- diseño 'Nar', 3 colores, 3 tamaños
('Nar', 'Iguana;', 1, 1, 2, false),
('Nar', 'Iguana;', 1, 2, 2, false),
('Nar', 'Iguana;', 1, 3, 2, false),
('Nar', 'Iguana;', 2, 1, 2, false),
('Nar', 'Iguana;', 2, 2, 2, false),
('Nar', 'Iguana;', 2, 3, 2, false),
('Nar', 'Iguana;', 3, 1, 2, false),
('Nar', 'Iguana;', 3, 2, 2, false),
('Nar', 'Iguana;', 3, 3, 2, false),
-- diseño 'Anar', 3 colores, 3 tamaños
('Anar', 'Prenda el cerebro, ingeniero', 1, 1, 2, false),
('Anar', 'Prenda el cerebro, ingeniero', 1, 2, 2, false),
('Anar', 'Prenda el cerebro, ingeniero', 1, 3, 2, false),
('Anar', 'Prenda el cerebro, ingeniero', 2, 1, 2, false),
('Anar', 'Prenda el cerebro, ingeniero', 2, 2, 2, false),
('Anar', 'Prenda el cerebro, ingeniero', 2, 3, 2, false),
('Anar', 'Prenda el cerebro, ingeniero', 3, 1, 2, false),
('Anar', 'Prenda el cerebro, ingeniero', 3, 2, 2, false),
('Anar', 'Prenda el cerebro, ingeniero', 3, 3, 2, false),
-- diseño 'Granat', 3 colores, 3 tamaños
('Granat', 'CSS: Cant style shit', 1, 1, 2, false),
('Granat', 'CSS: Cant style shit', 1, 2, 2, false),
('Granat', 'CSS: Cant style shit', 1, 3, 2, false),
('Granat', 'CSS: Cant style shit', 2, 1, 2, false),
('Granat', 'CSS: Cant style shit', 2, 2, 2, false),
('Granat', 'CSS: Cant style shit', 2, 3, 2, false),
('Granat', 'CSS: Cant style shit', 3, 1, 2, false),
('Granat', 'CSS: Cant style shit', 3, 2, 2, false),
('Granat', 'CSS: Cant style shit', 3, 3, 2, false),
-- diseño 'Ródi', 3 colores, 3 tamaños
('Ródi', 'Contexto {}', 1, 1, 2, false),
('Ródi', 'Contexto {}', 1, 2, 2, false),
('Ródi', 'Contexto {}', 1, 3, 2, false),
('Ródi', 'Contexto {}', 2, 1, 2, false),
('Ródi', 'Contexto {}', 2, 2, 2, false),
('Ródi', 'Contexto {}', 2, 3, 2, false),
('Ródi', 'Contexto {}', 3, 1, 2, false),
('Ródi', 'Contexto {}', 3, 2, 2, false),
('Ródi', 'Contexto {}', 3, 3, 2, false),
-- diseño 'Grenade', 3 colores, 3 tamaños
('Grenade', 'Wr', 1, 1, 2, false),
('Grenade', 'Wr', 1, 2, 2, false),
('Grenade', 'Wr', 1, 3, 2, false),
('Grenade', 'Wr', 2, 1, 2, false),
('Grenade', 'Wr', 2, 2, 2, false),
('Grenade', 'Wr', 2, 3, 2, false),
('Grenade', 'Wr', 3, 1, 2, false),
('Grenade', 'Wr', 3, 2, 2, false),
('Grenade', 'Wr', 3, 3, 2, false),
-- diseño 'Rumman', 3 colores, 3 tamaños
('Rumman', 'Puro Linux', 1, 1, 2, false),
('Rumman', 'Puro Linux', 1, 2, 2, false),
('Rumman', 'Puro Linux', 1, 3, 2, false),
('Rumman', 'Puro Linux', 2, 1, 2, false),
('Rumman', 'Puro Linux', 2, 2, 2, false),
('Rumman', 'Puro Linux', 2, 3, 2, false),
('Rumman', 'Puro Linux', 3, 1, 2, false),
('Rumman', 'Puro Linux', 3, 2, 2, false),
('Rumman', 'Puro Linux', 3, 3, 2, false),
-- diseño 'Magraner', 3 colores, 3 tamaños
('Magraner', '; Survivor', 1, 1, 2, false),
('Magraner', '; Survivor', 1, 2, 2, false),
('Magraner', '; Survivor', 1, 3, 2, false),
('Magraner', '; Survivor', 2, 1, 2, false),
('Magraner', '; Survivor', 2, 2, 2, false),
('Magraner', '; Survivor', 2, 3, 2, false),
('Magraner', '; Survivor', 3, 1, 2, false),
('Magraner', '; Survivor', 3, 2, 2, false),
('Magraner', '; Survivor', 3, 3, 2, false),
-- diseño 'Melagrana', 3 colores, 3 tamaños
('Melagrana', 'Hello, word', 1, 1, 2, false),
('Melagrana', 'Hello, word', 1, 2, 2, false),
('Melagrana', 'Hello, word', 1, 3, 2, false),
('Melagrana', 'Hello, word', 2, 1, 2, false),
('Melagrana', 'Hello, word', 2, 2, 2, false),
('Melagrana', 'Hello, word', 2, 3, 2, false),
('Melagrana', 'Hello, word', 3, 1, 2, false),
('Melagrana', 'Hello, word', 3, 2, 2, false),
('Melagrana', 'Hello, word', 3, 3, 2, false),
-- diseño 'Zakuro', 3 colores, 3 tamaños
('Zakuro', 'need a <br>', 1, 1, 2, false),
('Zakuro', 'need a <br>', 1, 2, 2, false),
('Zakuro', 'need a <br>', 1, 3, 2, false),
('Zakuro', 'need a <br>', 2, 1, 2, false),
('Zakuro', 'need a <br>', 2, 2, 2, false),
('Zakuro', 'need a <br>', 2, 3, 2, false),
('Zakuro', 'need a <br>', 3, 1, 2, false),
('Zakuro', 'need a <br>', 3, 2, 2, false),
('Zakuro', 'need a <br>', 3, 3, 2, false),
-- diseños personalizados
('Kirby Zelda', 'https://shre.ink/DROv', 1, 2, 3, true),
('Yoshi sentado', 'https://ih1.redbubble.net/image.2219996370.0418/st,small,507x507-pad,600x600,f8f8f8.jpg', 2, 1, 3, true);

-- tamaños_sticker
insert into tamanos_sticker(largo, ancho) values
(5, 8), -- cm 
(8, 11),
(11, 14);

-- stickers
insert into stickers (nombre_sticker, descripcion_sticker, fk_tamano_sticker, fk_precio, cantidad_stock) values
-- Sticker 'Nar', 3 tamaños
('Nar', 'Sticker Granada', 1, 4, 5),
('Nar', 'Sticker Granada', 2, 4, 15),
('Nar', 'Sticker Granada', 3, 4, 48),
-- Sticker 'Nar', 3 tamaños
('Anar', 'Sticker Prenda el cerebro, ingeniero', 1, 4, 2),
('Anar', 'Sticker Prenda el cerebro, ingeniero', 2, 4, 10),
('Anar', 'Sticker Prenda el cerebro, ingeniero', 3, 4, 0),
-- Sticker 'Granat', 3 tamaños
('Granat', 'CSS: Cant style shit', 1, 4, 5),
('Granat', 'CSS: Cant style shit', 2, 4, 10),
('Granat', 'CSS: Cant style shit', 3, 4, 40),
-- Sticker 'Ródi', 3 tamaños
('Ródi', 'Contexto {}', 1, 4, 64),
('Ródi', 'Contexto {}', 2, 4, 61),
('Ródi', 'Contexto {}', 3, 4, 70),
-- Sticker 'Genade', 3 tamaños
('Grenade', 'Wr', 1, 4, 27),
('Grenade', 'Wr', 2, 4, 20),
('Grenade', 'Wr', 3, 4, 41),
-- Sticker 'Rumman', 3 tamaños
('Rumman', 'Puro Linux', 1, 4, 5),
('Rumman', 'Puro Linux', 2, 4, 15),
('Rumman', 'Puro Linux', 3, 4, 42),
-- Sticker 'Magraner', 3 tamaños
('Magraner', '; Survivor', 1, 4, 17),
('Magraner', '; Survivor', 2, 4, 19),
('Magraner', '; Survivor', 3, 4, 26),
-- Sticker 'Melagrana', 3 tamaños
('Melagrana', 'Hello, word', 1, 4, 81),
('Melagrana', 'Hello, word', 2, 4, 85),
('Melagrana', 'Hello, word', 3, 4, 77),
--  Sticker 'Zakuro', 3 tamaños
('Zakuro', 'need a <br>', 1, 4, 22),
('Zakuro', 'need a <br>', 2, 4, 16),
('Zakuro', 'need a <br>', 3, 4, 6);

-- favoritos
insert into favoritos (fk_usuario) values
(1), (2), (3), (4), (5);

-- favoritos_detalles
insert into favoritos_detalles (fk_favorito, fk_producto) values
(1, 11), 
(2, 83),
(3, 1226),
(4, 1236),
(5, 1272);

-- calculo subtotal carrito_compra_detalles
delimiter $$
create trigger calcular_subtotal_carrito_compra_detalles
before insert on carrito_compra_detalles
for each row
begin
    declare precio float;

    -- obtener el precio unitario del producto desde la tabla productos
    set precio = (select precio_unitario from productos where id_producto = new.fk_producto);

    -- calcular el subtotal multiplicando la cantidad por el precio unitario
    set new.subtotal= new.cantidad * precio;
end$$
delimiter ;

-- calculo total_carrito
delimiter $$
create trigger calcular_total_carrito_carrito_compras
after insert on carrito_compra_detalles
for each row
begin
    -- variable para almacenar el total del carrito
    declare total_carrito float;

    -- calcular el total del carrito sumando los subtotales en carrito_compra_detalles
    select sum(subtotal)
    into total_carrito
    from carrito_compra_detalles
    where fk_carrito = NEW.fk_carrito;

    -- actualizar el total en la tabla carrito_compras
    update carrito_compras
    set total_carrito = total_carrito
    where id_carrito = new.fk_carrito;
end$$
delimiter ;

-- carrito_compras
insert into carrito_compras (fk_usuario) values
(1), (2), (3), (4), (5);

-- carrito_compra_detalles
insert into carrito_compra_detalles (fk_carrito, fk_producto, cantidad) values
(1, 1, 1),
(1, 42, 1),
(2, 96, 1),
(3, 1234, 3),
(4, 1237, 4),
(5, 1270, 6);

-- metodos_pago
insert into metodos_pago(metodo_pago) values 
('Tarjeta de Crédito'),
('Tarjeta de Débito'),
('PayPal'),
('Transferencia Bancaria'),
('Efectivo');

-- estados_pagos
insert into estados_pago(estado_pago) values
('Pendiente'),
('Realizado'),
('Rechazado'),
('Cancelado');

-- estado_ordenes
insert into estados_orden(estado_orden) values
('Pendiente'),
('Recogida');

-- calculo subtotal en orden_detalles 
delimiter $$
create trigger calcular_subtotal_orden_detalles
before insert on ordenes_detalles
for each row
begin
    declare precio float;

    -- obtener el precio unitario del producto desde la tabla productos
    set precio = (select precio_unitario from productos where id_producto = new.fk_producto);

    -- calcular el subtotal multiplicando la cantidad por el precio unitario
    set new.subtotal= new.cantidad * precio;
end$$
delimiter ;

-- calculo total_orden en ordenes
delimiter $$
create trigger calcular_total_orden
after insert on ordenes_detalles
for each row
begin
    -- variable para almacenar el total de la orden
    declare total_orden float;

    -- calcular el total del carrito sumando los subtotales en ordenes_detalles
    select sum(subtotal)
    into total_orden
    from ordenes_detalles
    where fk_orden = new.fk_orden;

    -- actualizar el total en ordenes
    update ordenes
    set total_orden = total_orden
    where id_orden = new.fk_orden;
end$$
delimiter ;

-- Adhesión de la columna total_orden, que almacenará el monto que pagará el usuario en última instancia
alter table ordenes add column total_final float;

-- 6. Descuento para usuarios registrados y compradores en el mismo día
-- calculo total_final en ordenes
delimiter $$
create trigger calcular_total_final
after insert on ordenes_detalles
for each row
begin
    -- variables para almacenar el total final de la orden y las fechas
    declare total_final float;
    declare fecha_registro date;
    declare fecha_orden date;

    -- calcular el total del carrito sumando los subtotales en ordenes_detalles
    select sum(subtotal)
    into total_final
    from ordenes_detalles
    where fk_orden = new.fk_orden;

    -- obtener la fecha de registro del usuario y la fecha de la orden
    select date(u.fecha_registro_usuario), date(o.fecha_orden)
    into fecha_registro, fecha_orden
    from usuarios u
    join ordenes o on u.id_usuario = o.fk_usuario
    where o.id_orden = new.fk_orden;

    -- verificar si el usuario se registró y realizó la compra el mismo día
    if fecha_registro = fecha_orden then
        -- aplicar un 15% de descuento
        set total_final = total_final * 0.85;
    end if;

    -- actualizar el total en ordenes
    update ordenes
    set total_final = total_final
    where id_orden = new.fk_orden;
end$$
delimiter ;

-- ordenes
insert into ordenes(fk_usuario, fk_sucursal, fk_metodo_pago, fk_estado_pago, fk_estado_orden) values
(1, 1, 1, 1, 1),
(2, 2, 2, 2, 2),
(3, 3, 3, 3, 1),
(4, 2, 4, 4, 1),
(5, 1, 5, 2, 2);

-- orden_detalles
insert into ordenes_detalles (fk_orden, fk_producto, cantidad) values
(1, 42, 1),
(2, 96, 1),
(3, 1234, 3),
(4, 1237, 4),
(5, 1270, 6);

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- PORTAFOLIO DISPARADORES

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- 1. Disparador de registro de cambios de precios

create table registro_cambios_precios(
	id_registro_cambio_precio int auto_increment primary key,
	fk_producto int not null,
	precio_anterior float not null,
	precio_nuevo float not null,
	fecha_cambio timestamp default current_timestamp,
	foreign key (fk_producto) references productos(id_producto)
);

DELIMITER //
CREATE TRIGGER AfterPriceUpdate
AFTER UPDATE ON productos
FOR EACH ROW
BEGIN
    IF OLD.precio_unitario < NEW.precio_unitario THEN
        insert into registro_cambios_precios(fk_producto,precio_anterior,precio_nuevo)
        VALUES (NEW.id_producto, OLD.precio_unitario, NEW.precio_unitario);
    END IF;
END //
DELIMITER ;

delete from productos where id_producto=2;
insert into productos (id_producto,precio_unitario) values (2,500);

update productos set precio_unitario = 600 where id_producto = 2;

-- Resultado
select *  from registro_cambios_precios;

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- 2. Disparador de bloqueo de cuenta

-- Creacion tablas adicionales para el disparador

Create table  intentosLogin(
	id_intento int primary key auto_increment,
	id_usuario int,
	tiempo_intento datetime,
	success boolean,
	foreign key (id_usuario) references usuarios(id_usuario)
);

CREATE TABLE notificacion (
    id_notificacion int primary key auto_increment,
    destinatario Varchar(255),
    subject varchar(255),
    mensaje text,
    tiempo_envio datetime default NOW()
);

-- Creacion disparador

Delimiter //
create trigger despues_intentosLogin
after insert on intentosLogin
for each row
begin
    Declare intento_fallido int;
    -- Contar intentos en 15 min
    Select COUNT(*)
    Into intento_fallido
    From intentosLogin
    Where id_usuario = NEW.id_usuario And success = false and tiempo_intento > NOW() - interval 15 minute;
    
    -- Verificar fallo
    If intento_fallido >= 3 then
        update usuarios
        set bloqueo = true
        where id_usuario = NEW.id_usuario;

        -- Enviar email al administrador
        Call enviar_notificacion_admin(NEW.id_usuario);
    End if;
End //
DELIMITER ;


DELIMITER //
Create procedure enviar_notificacion_admin(In p_id_usuario int)
Begin
	Declare email_admin varchar(255);
    -- Correo del administrador
    Set email_admin = 'admin@example.com';
    
   insert into notificacion (destinatario, subject, mensaje)
    Values (email_admin, 'Cuenta Bloqueada', CONCAT('La cuenta del usuario: ', p_id_usuario, ' ha sido bloqueada después de muchos intentos de iniciar sesión.'));
END //
DELIMITER ;

Insert into intentosLogin (id_usuario, tiempo_intento, success) Values (1, now(), false);
-- Insert into intentosLogin (id_usuario, tiempo_intento, success) Values (1, now(), false);
-- Insert into intentosLogin (id_usuario, tiempo_intento, success) Values (1, now(), false);

-- Resultado
Select bloqueo from usuarios where id_usuario= 1;

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- 3. Disparador de auditoría de eliminación de datos sensibles

/*
Crea un disparador que se active después de eliminar una fila de una tabla que contiene datos sensibles,
como información financiera o datos personales. Este disparador debería registrar automáticamente
los detalles de la eliminación en una tabla de registro de auditoría, incluyendo el usuario
que realizó la eliminación y la fecha y hora en que ocurrió.
*/

CREATE TABLE eliminacion_empleados(
	id_auditoria int primary key auto_increment,
	fecha_eliminacion timestamp default current_timestamp,
	eliminado_por varchar(50),
	accion varchar(20),
	id_empleado int,
	nombre_empleado varchar(50),
	apellido_empleado varchar(50), 
	fecha_nacimiento_empleado date,
	genero int,
	correo_empleado varchar (50),
	telefono_empleado varchar(10),
	direccion int,
	departamento int,
	puesto int,
	horas_trabajadas_mes int,
	salario float,
	fecha_contratacion timestamp,
	estado boolean
);

DELIMITER //
CREATE TRIGGER ELIMINACION_DE_EMPLEADOS
AFTER DELETE ON empleados
FOR EACH ROW
BEGIN 
	INSERT INTO eliminacion_empleados(fecha_eliminacion, eliminado_por, accion, id_empleado, nombre_empleado, apellido_empleado, 
									fecha_nacimiento_empleado, genero, correo_empleado, telefono_empleado, direccion, departamento, 
                                    puesto, horas_trabajadas_mes, salario, fecha_contratacion, estado)
	VALUES(current_timestamp(), current_user(), 'ELIMINO A', OLD.id_empleado, OLD.nombre_empleado, OLD.apellido_empleado, 
			OLD.fecha_nacimiento_empleado, OLD.fk_genero, OLD.correo_empleado, OLD.telefono_empleado, OLD.fk_direccion, 
            OLD.fk_departamento, OLD.fk_puesto, OLD.horas_trabajadas_mes, OLD.salario, OLD.fecha_contratacion, OLD.estado);
END //
DELIMITER ;
 
SELECT * FROM empleados;

DELETE FROM empleados WHERE id_empleado = 6;

SELECT * FROM empleados;

-- Resultado
SELECT * FROM eliminacion_empleados;

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- 4. Disparador de generación de código único

/*
Disparador de generación de código único: Desarrolla un disparador que se active después de insertar una nueva fila en una tabla de clientes. 
Este disparador debería generar automáticamente un código único para cada cliente basado en su nombre y apellido, 
y actualizar el campo correspondiente en la tabla con el código generado.
*/

alter table usuarios add pepino_clave varchar(255); 

DELIMITER //
CREATE FUNCTION pepinoGenerador(nombre VARCHAR(50), apellido VARCHAR(50)) RETURNS VARCHAR(50) DETERMINISTIC
BEGIN
    DECLARE codigo VARCHAR(50);
    DECLARE numero_aleatorio INT;
    DECLARE codigo_existe INT;
    
    SET codigo_existe = 1;-- Inicializamos la variable para verificar si el código existe
    
    WHILE codigo_existe > 0 DO
        SET numero_aleatorio = FLOOR(1000 + (RAND() * 9000)); -- Numero aleatorio
        SET codigo = CONCAT(LEFT(nombre, 1), LEFT(apellido, 1), numero_aleatorio); -- Concatena caracteres con el numero
        
        SELECT COUNT(*) INTO codigo_existe FROM usuarios WHERE pepino_clave = codigo; -- Verificamos si el código generado ya existe en la tabla
    END WHILE;
    
    RETURN codigo;
END //
DELIMITER ;

delimiter //
create trigger	pepino before insert on usuarios
for each row 
begin
set new.pepino_clave = pepinoGenerador(new.nombre_usuario,new.apellido_usuario);
end // 
delimiter ;

INSERT INTO usuarios (nombre_usuario, apellido_usuario, fecha_nacimiento_usuario, fk_genero, email_usuario, telefono_usuario, contrasena_usuario) VALUES
('Laura', 'Hernández', '1993-06-06', 2, 'laura.hernandez@example.com', '5556789012', 'passwrd1'),
('Pedro', 'Ramírez', '1987-07-07', 1, 'pedro.ramirez@example.com', '5557890123', 'passwrd1'),
('Sofía', 'Sánchez', '1991-08-08', 2, 'sofia.sanchez@example.com', '5558901234', 'passwrd1'),
('Miguel', 'Torres', '1989-09-09', 1, 'miguel.torres@example.com', '5559012345', 'passwrd1'),
('Elena', 'Gómez', '1994-10-10', 2, 'elena.gomez@example.com', '5550123456', 'passwrd1');

INSERT INTO usuarios (nombre_usuario, apellido_usuario, fecha_nacimiento_usuario, fk_genero, email_usuario, telefono_usuario, contrasena_usuario)
VALUES
('Ana', 'Martínez', '1995-05-05', 2, 'ana.martinez@example.com', '5252345678', 'passwrd1'),
('Carlos', 'López', '1988-04-04', 1, 'carlos.lopez@example.com', '5253456789', 'passwrd1'),
('Julia', 'García', '1990-03-03', 2, 'julia.garcia@example.com', '5254567890', 'passwrd1'),
('Roberto', 'Pérez', '1986-02-02', 1, 'roberto.perez@example.com', '5255678901', 'passwrd1'),
('María', 'Rodríguez', '1992-01-01', 2, 'maria.rodriguez@example.com', '5256789012', 'passwrd1');

-- Resultado
SELECT * FROM usuarios;

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- 5. Disparador de control de stock mínimo

/*
Crea un disparador que se active después de actualizar la cantidad disponible de un producto en una tabla de inventario.
Este disparador debería verificar si la nueva cantidad es menor que el stock mínimo establecido para ese producto y, si lo es,
enviar una notificación al departamento de compras para reabastecer el producto.
*/

alter table playeras add column stock_minimo int not null default 10;

create table log_alertas_stock (
    id int auto_increment primary key,
    mensaje varchar(255),
    fecha timestamp default current_timestamp
);

DELIMITER $$
create trigger verificar_stock_min
after update on playeras
for each row
begin
    declare mensaje varchar(255);
    if new.cantidad_stock < new.stock_minimo then
        set mensaje = CONCAT('El producto ', new.descripcion_playera,
        ' está por debajo del stock mínimo. Cantidad actual: ',new.cantidad_stock,
        ', Stock mínimo: ', new.stock_minimo);
        
        -- Insertar el mensaje en la tabla de logs
        insert into log_alertas_stock (mensaje) values (mensaje);
    end if;
end$$
DELIMITER ;

-- nueva playera con un stock mínimo 
insert into playeras (descripcion_playera, fk_talla, fk_color, fk_precio, fk_proveedor, cantidad_stock, stock_minimo)
values ('Playera prueba', 1, 1, 1, 1, 15, 20);

-- Actualizar la cantidad de stock para que sea menor al stock mínimo
update playeras set cantidad_stock = 5 where descripcion_playera = 'Playera prueba';

-- Resultado
-- Verificar los registros en la tabla de logs
select * from log_alertas_stock;

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- 6. Descuento para usuarios registrados y compradores en el mismo día

-- Disparador que se activa después de insertar una nueva fila en la tabla de ordenes_detalles.
-- Debería verificar si el cliente se registró y realizó una compra en el mismo día. Si es así,
-- debería aplicar un descuento del 15% al total de la orden e insertar el valor en la columna total_final
-- en la tabla de ordenes.

-- El disparador se ubica en la las líneas , ya que, la secuencia afecta el resultado.

/*
-- Vista de lo realizado:

-- Adhesión de la columna total_orden, que almacenará el monto que pagará el usuario en última instancia
alter table ordenes add column total_final float;

delimiter $$
create trigger calcular_total_final
after insert on ordenes_detalles
for each row
begin
    -- variables para almacenar el total final de la orden y las fechas
    declare total_final float;
    declare fecha_registro date;
    declare fecha_orden date;

    -- calcular el total del carrito sumando los subtotales en ordenes_detalles
    select sum(subtotal)
    into total_final
    from ordenes_detalles
    where fk_orden = new.fk_orden;

    -- obtener la fecha de registro del usuario y la fecha de la orden
    select date(u.fecha_registro_usuario), date(o.fecha_orden)
    into fecha_registro, fecha_orden
    from usuarios u
    join ordenes o on u.id_usuario = o.fk_usuario
    where o.id_orden = new.fk_orden;

    -- verificar si el usuario se registró y realizó la compra el mismo día
    if fecha_registro = fecha_orden then
        -- aplicar un 15% de descuento
        set total_final = total_final * 0.85;
    end if;

    -- actualizar el total en ordenes
    update ordenes
    set total_final = total_final
    where id_orden = new.fk_orden;
end$$
delimiter ;
*/

-- Resultado
select * from ordenes;

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- Procedimientos almacenados

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- 1. Procedimiento Almacenado para calcular el total de ventas por cliente:
-- Desarrolla un procedimiento almacenado que acepte el ID del cliente como parámetro de entrada y devuelva el total de ventas realizadas por ese cliente.

drop procedure if exists Ventas_Clientes;

Delimiter //
create procedure Ventas_Clientes(
Id_usuarios int
)
begin
select sum(total_orden) from ordenes where Id_usuarios = fk_usuario;
end //	
delimiter ;

call  Ventas_Clientes(5);

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- 2. Procedimiento Almacenado para obtener el nombre del departamento de un empleado:
-- Crea un procedimiento almacenado que acepte el ID del empleado como parámetro de entrada y devuelva el nombre del departamento al que pertenece ese empleado.

drop procedure if exists obtener_info_empleado;

DELIMITER //
create procedure obtener_info_empleado (in emp_id int)
begin
    select e.nombre_empleado as NombreEmpleado, d.departamento as NombreDepartamento
    from empleados e
    join departamentos d on e.fk_departamento = d.id_departamento
    where e.id_empleado = emp_id;
end//
DELIMITER ;

-- Llamar al procedimiento almacenado con el ID del empleado 1, por ejemplo.
call obtener_info_empleado(1);

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- 3. Procedimiento Almacenado para generar un informe de inventario:
-- Desarrolla un procedimiento almacenado que genere un informe de inventario que incluya el nombre, la cantidad disponible y el precio de todos los productos en stock.

-- PLAYERAS

drop procedure if exists inventario_playeras;

delimiter //
create procedure inventario_playeras(
id_playera int)
begin 
	select p.descripcion_playera as Nombre,
    p.cantidad_stock as CantidadDisponible,
    t.talla as Talla,
    c.color as Color,
    pp.precio as Precio
    from playeras p 
    join precios pp on fk_precio = id_precio
    join tallas t on fk_talla = id_talla
    join colores c on fk_color = id_color
    where id_playera = p.id_playera;
    
end //
delimiter ;

call inventario_playeras(8);

-- STICKERS

drop procedure if exists inventario_stickers;

delimiter //
create procedure inventario_stickers(
id_sticker int)
begin 
	select s.nombre_sticker as Nombre,
    s.descripcion_sticker as Descripcion,
    s.cantidad_stock as CantidadDisponible,
    ts.ancho as AnchoSticker,
    ts.largo as LargoSticker,
    pp.precio as Precio
    from stickers s 
    join precios pp on fk_precio = id_precio
    join tamanos_sticker ts on id_tamano_sticker = fk_tamano_sticker
    where id_sticker = s.id_sticker;
    
end //

delimiter ;

call inventario_stickers(8);

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- 4. Procedimiento Almacenado para calcular la edad promedio de los clientes:
-- Crea un procedimiento almacenado que calcule la edad promedio de todos los clientes.

drop procedure if exists p_edad_promedio_usuarios;

delimiter //
create procedure p_edad_promedio_usuarios()
begin 
	select avg(timestampdiff(year, fecha_nacimiento_usuario, now()))
    as edad_promedio_usuarios
    from usuarios ;
end //
delimiter ;

call p_edad_promedio_usuarios;

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- 5. Procedimiento Almacenado para obtener la lista de pedidos pendientes:
-- Desarrolla un procedimiento almacenado que devuelva la lista de pedidos que aún no se han completado.

drop procedure if exists ObtenerPedidosPendientes;

Delimiter //
Create procedure ObtenerPedidosPendientes()
begin
    select 
        o.id_orden, 
        o.fk_usuario, 
        u.nombre_usuario as Nombre_Cliente,
        o.fecha_orden, 
        o.fk_estado_orden
    from 
        ordenes o
    join
        usuarios u on o.fk_usuario = u.id_usuario
    where 
        o.fk_estado_orden = '1'; -- 1 indica que esta en estado Pendiente
end //
Delimiter ;

Call ObtenerPedidosPendientes();

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- 6. Procedimiento Almacenado para validar la disponibilidad de stock:
-- Crea un procedimiento almacenado que acepte el ID del producto y la cantidad deseada como parámetros de entrada, y verifique si hay suficiente stock disponible para satisfacer el pedido.

drop procedure if exists juanProcedimiento;

DELIMITER $$
CREATE PROCEDURE juanProcedimiento(
    IN p_id_producto INT,
    IN p_cantidad_deseada INT,
    OUT p_disponible BOOLEAN
)
BEGIN
    DECLARE v_cantidad_stock INT;

    -- Verificar si el producto es una playera
    SELECT p.cantidad_stock INTO v_cantidad_stock
    FROM playeras p
    JOIN playeras_disenos pd ON p.id_playera = pd.fk_playera
    JOIN productos pr ON pr.fk_playera_diseno = pd.id_playera_diseno
    WHERE pr.id_producto = p_id_producto;

    -- Si no se encontró en playeras, buscar en stickers
    IF v_cantidad_stock IS NULL THEN
        SELECT s.cantidad_stock INTO v_cantidad_stock
        FROM stickers s
        JOIN productos pr ON pr.fk_sticker = s.id_sticker
        WHERE pr.id_producto = p_id_producto;
    END IF;
    
    -- Verificar si hay suficiente stock
    IF v_cantidad_stock >= p_cantidad_deseada THEN
        SET p_disponible = TRUE;
    ELSE
        SET p_disponible = FALSE;
    END IF;

END$$
DELIMITER ;

CALL juanProcedimiento(1, 5, @juanResultado);
SELECT @juanResultado;

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- Transacciones

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- 1. Actualización de inventario y registro de transacción

drop table if exists registro_cambios_stock;

CREATE TABLE registro_cambios_stock (
    id_cambio int auto_increment primary key,
    id_producto int not null,
    tabla_producto varchar (50) not null,
    cantidad_anterior int not null,
    cantidad_nueva int not null,
    fecha_cambio timestamp default current_timestamp,
    comentario varchar (255)
);

drop procedure if exists ActualizarStock;

DELIMITER //
create procedure ActualizarStock(
    in tabla_producto varchar(50),
    in producto_id int,
    in cantidad_cambio int, -- Cantidad a sumar (positiva) o restar (negativa) del stock actual
    in comentario varchar (255)
)
begin
    declare cantidad_stock int;
    declare cantidad_nueva int;
    declare id_columna_producto varchar(255);

    -- Iniciar transacción
    start transaction;

    -- Determinar el nombre de la columna de identificación del producto
    CASE tabla_producto
        when 'playeras' then set id_columna_producto = 'id_playera';
        when 'stickers' then set id_columna_producto = 'id_sticker';
        -- Añadir más casos según las tablas que tengan la columna 'cantidad_stock'
        else
           signal sqlstate '45000'
            set message_text = 'Tabla no soportada';
    end case;

    -- Obtener la cantidad actual del stock
    set @sql_query = CONCAT('SELECT cantidad_stock INTO @cantidad_stock FROM ', tabla_producto, ' WHERE ', id_columna_producto, ' = ', producto_id, ' FOR UPDATE');
    prepare stmt from @sql_query;
    execute stmt;
    deallocate prepare stmt;

    set cantidad_stock = @cantidad_stock;

    -- Verificar si el producto existe
    if cantidad_stock is null then
        signal sqlstate '45000' 
        set message_text = 'Producto no encontrado';
    end if;

    -- Calcular la nueva cantidad de stock
    set cantidad_nueva = cantidad_stock + cantidad_cambio;

    -- Verificar si la cantidad nueva es válida (no negativa)
    if cantidad_nueva < 0 then
        signal sqlstate'45000' 
        set message_text = 'Stock insuficiente';
    end if;

    -- Actualizar el inventario
    set @sql_query = CONCAT('UPDATE ', tabla_producto, ' SET cantidad_stock = ', cantidad_nueva, ' WHERE ', id_columna_producto, ' = ', producto_id);
    prepare stmt from @sql_query;
    execute stmt;
    deallocate prepare stmt;

    -- Registrar el cambio en la tabla de auditoría
    insert into registro_cambios_stock (id_producto, tabla_producto, cantidad_anterior, cantidad_nueva, comentario)
    values (producto_id, tabla_producto, cantidad_stock, cantidad_nueva, comentario);

    -- Confirmar transacción
    commit;
    
    select * from registro_cambios_stock order by fecha_cambio desc;
end //
DELIMITER ;

call ActualizarStock('stickers', 1, +5, 'stock rellenado');
call ActualizarStock('playeras', 2, -3, 'venta realizada');

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- 2. Transferencia de fondos y actualización de registros

-- Creacion de tablas 

create table CuentaThreadOne(
id int primary key,
monto decimal(15, 2)
);

create table CuentasEmpleados(
id_cuenta int primary key auto_increment,
id_empleado int,
monto decimal(10, 2),
foreign key (id_empleado) references Empleados(id_empleado) on delete cascade
);

create table registroPagoEmpleados(
id_registro int primary key auto_increment,
id_empleado int,
accion varchar(50),
monto decimal(10, 2) ,
fecha_pago timestamp default current_timestamp,
foreign key (id_empleado) references Empleados(id_empleado) on delete cascade
);

-- Inserción de datos

insert into CuentaThreadOne (id, monto) values (1, 20000000);

insert into CuentasEmpleados (id_empleado, monto) values 
(1, 0), (2, 0), (3, 0), (4, 0), (5, 0);

-- Disparador Resgistro de los pagos

delimiter //
create trigger PagoNomina
after update on CuentasEmpleados
for each row
begin
	insert into registroPagoEmpleados (id_empleado, accion, monto)
    values (new.id_empleado, 'PAGO NOMINA', (new.monto-old.monto));
end //
delimiter ;

-- Procedimiento pago de sueldos

delimiter //
create procedure PagarSueldoEmpleado(in p_id_empleado int)
begin
	declare p_sueldo decimal(10, 2);
    declare p_fondo_actual decimal(10, 2);
    declare p_mensaje varchar(100);
    
    select salario into p_sueldo
    from empleados 
    where id_empleado = p_id_empleado;
    
    select monto into p_fondo_actual
    from CuentaThreadOne
    where id = 1;
		
	start transaction;
        
        if p_fondo_actual >= p_sueldo then
            		
			update CuentaThreadOne
			set monto = monto - p_sueldo
			where id = 1;
			
			if row_count() = 0 then
				rollback;
			end if;
            
			update CuentasEmpleados
            set monto = monto + p_sueldo
            where id_empleado = p_id_empleado;
			
			if row_count() = 0 then
				rollback;
			end if;
            
            commit;
        
			set p_mensaje = concat('Pago exitoso al empleado: ', p_id_empleado);
            
		elseif p_fondo_actual < p_sueldo then

			set p_mensaje = 'Fondos insuficientes';
	
		end if;
        
	select p_mensaje as mensaje;
    
    select * from registroPagoEmpleados;
    
end //
delimiter ;

call PagarSueldoEmpleado(1);
call PagarSueldoEmpleado(2);
call PagarSueldoEmpleado(3);
call PagarSueldoEmpleado(4);
call PagarSueldoEmpleado(5);

select * from CuentasEmpleados;
select * from registroPagoEmpleados;
select * from CuentaThreadOne;

call PagarSueldoEmpleado(1);

select * from CuentasEmpleados;
select * from CuentaThreadOne;

call PagarSueldoEmpleado(8);

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- 3. Cambio de estado de un pedido y actualización de registros

Create table registro(
	id_registro int auto_increment primary key,
	id_orden int,
    estado_anterior int, 
    estado_actual int,
	fecha_actualizacion timestamp default current_timestamp,
	foreign key(id_orden) references ordenes(id_orden) on delete cascade
);

Delimiter //
create procedure actualizar_estado_pedido(
    in p_id_orden int,
    in nuevo_estado_id int
)
begin
    declare estado_anterior int;
    select fk_estado_orden into estado_anterior from ordenes where id_orden=p_id_orden;
   
    start transaction; -- inicio

    -- actualización el estado de la orden
    update ordenes
    set fk_estado_orden = nuevo_estado_id
    where id_orden = p_id_orden;

    -- verificación primera operación
    if row_count() = 0 then
        rollback;
    end if;

    insert into registro (id_orden, estado_anterior, estado_actual, fecha_actualizacion)
    values (p_id_orden,  estado_anterior, nuevo_estado_id, now());

    -- verificación segunda operación
    if row_count() = 0 then
        rollback;
    end if;

    -- confirmación de ambas operaciones
    commit;
    
    select * from registro;
end //
delimiter ;

-- Modificar la tabla para establecer un valor predeterminado en fk_usuario
alter table ordenes modify fk_usuario int default 1;  
alter table ordenes modify fk_sucursal int default 1; 
alter table ordenes modify fk_metodo_pago int default 1; 
alter table ordenes modify fk_estado_pago int default 1; 

call actualizar_estado_pedido(1, 1);
call actualizar_estado_pedido(2, 1);
call actualizar_estado_pedido(3, 2); -- Reemplazar 1 por las opciones: 1 o 2

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- 4. Actualización de información del cliente y registro de auditoría

create table auditoria (
    id_auditoria int auto_increment primary key,
    id_usuario int,
    nombre_anterior varchar(50),
    nombre_nuevo varchar(50),
    apellido_anterior varchar(50),
    apellido_nuevo varchar(50),
    email_anterior varchar(50),
    email_nuevo varchar(50),
    telefono_anterior varchar(10),
    telefono_nuevo varchar(10),
    fecha_cambio timestamp default current_timestamp,
    foreign key (id_usuario) references usuarios(id_usuario)
);

delimiter $$
create procedure actualizar_usuario(
    in p_id_usuario int,
    in p_nombre_nuevo varchar(50),
    in p_apellido_nuevo varchar(50),
    in p_email_nuevo varchar(50),
    in p_telefono_nuevo varchar(10)
)
begin
    declare v_nombre_anterior varchar(50);
    declare v_apellido_anterior varchar(50);
    declare v_email_anterior varchar(50);
    declare v_telefono_anterior varchar(10);
    declare exit handler for sqlexception 
    begin
        rollback;
    end;

    start transaction;

    select nombre_usuario, apellido_usuario, email_usuario, telefono_usuario -- Obtener los valores actuales del usuario
    into v_nombre_anterior, v_apellido_anterior, v_email_anterior, v_telefono_anterior
    from usuarios
    where id_usuario = p_id_usuario;

    update usuarios -- Actualizar los valores del usuario
    set nombre_usuario = p_nombre_nuevo,
        apellido_usuario = p_apellido_nuevo,
        email_usuario = p_email_nuevo,
        telefono_usuario = p_telefono_nuevo
    where id_usuario = p_id_usuario;

    -- Insertar registro en la tabla de auditoría
    insert into auditoria (id_usuario, nombre_anterior, nombre_nuevo, apellido_anterior, apellido_nuevo, email_anterior, email_nuevo, telefono_anterior, telefono_nuevo)
    values (p_id_usuario, v_nombre_anterior, p_nombre_nuevo, v_apellido_anterior, p_apellido_nuevo, v_email_anterior, p_email_nuevo, v_telefono_anterior, p_telefono_nuevo);

	select * from auditoria;
    
    commit;
end$$
delimiter ;

call actualizar_usuario(1, 'Mike', 'Tyson', 'earBiter@gmail.com', '3141592653');
call actualizar_usuario(1, 'Juan', 'Perez ', 'juan.perez@gmail.com', '6141234567');

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- 5. Eliminación de un registro y registro de acción

drop procedure if exists p_eliminar_empleado;

delimiter //
create procedure p_eliminar_empleado(in p_id_empleado int)
begin
	start transaction;
        delete from empleados where id_empleado = p_id_empleado;
        
        if row_count() = 0 then
			rollback;
		end if;
        
        select * from eliminacion_empleados;
	commit;
end //
delimiter ;

call p_eliminar_empleado(5);

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- 6. Actualización del carrito de compras y registro de acción

drop trigger if exists calcular_subtotal_before_update_on_carrito_compra_detalles;

delimiter //
create trigger calcular_subtotal_before_update_on_carrito_compra_detalles
before update on carrito_compra_detalles
for each row
begin
    declare precio float;

	-- obtener el precio unitario del producto desde la tabla productos
	set precio = (select precio_unitario from productos where id_producto = new.fk_producto);

	-- calcular el subtotal multiplicando la cantidad por el precio unitario
	set new.subtotal = new.cantidad * precio;
end//
delimiter ;

drop trigger if exists calcular_total_before_update_on_carrito_compra_detalles;

delimiter $$
create trigger calcular_total_before_update_on_carrito_compra_detalles
before update on carrito_compra_detalles
for each row
begin
    -- variable para almacenar el total del carrito
    declare total_carrito float;

    -- calcular el total del carrito sumando los subtotales en carrito_compra_detalles
    select sum(subtotal)
    into total_carrito
    from carrito_compra_detalles
    where fk_carrito = new.fk_carrito;

    -- actualizar el total en la tabla carrito_compras
    update carrito_compras
    set total_carrito = total_carrito
    where id_carrito = new.fk_carrito;
end$$
delimiter ;

drop table if exists autoria_carrito_detalles;

create table if not exists autoria_carrito_detalles (
	id_auditoria_carrito_detalles int auto_increment primary key,
    fk_carrito_compra int not null,
    fk_producto int not null,
    cantidad_anterior int not null,
    cantidad_nueva int not null,
    fecha timestamp default current_timestamp
);

drop procedure if exists p_actualizar_cantidad_producto;

delimiter //
create procedure p_actualizar_cantidad_producto(in p_id_carrito int, in p_id_producto int, in p_nueva_cantidad int)
begin 
	declare p_cantidad_stock int;
    declare p_fk_categoria int;
    declare p_cantidad_anterior int;
    
     -- obtener la cantidad actual del producto en el carrito
    select cantidad into p_cantidad_anterior
    from carrito_compra_detalles where fk_carrito = p_id_carrito and fk_producto = p_id_producto;
    
    -- obtener el tipo de producto desde la tabla productos
    select fk_categoria into p_fk_categoria
    from productos where id_producto = p_id_producto;
    
    -- verificar el tipo de producto y obtener el stock disponible de la tabla correspondiente
    if p_fk_categoria = 1 or 2 then
       
        select p.cantidad_stock into p_cantidad_stock
        from productos prod
        join playeras_disenos pd on prod.fk_playera_diseno = pd.id_playera_diseno
        join playeras p on pd.fk_playera = p.id_playera
        where prod.id_producto = p_id_producto;
        
	elseif p_fk_categoria = 3 then
		
        select p.cantidad_stock into p_cantidad_stock
        from productos prod
        join stickers s on prod.fk_sticker = prod.fk_sticker
        where prod.id_producto = p_id_producto;
	
    end if;
    
    start transaction;
    
		if p_nueva_cantidad < 1 then
			
			update carrito_compra_detalles
			set cantidad = 0
			where fk_carrito = p_id_carrito and fk_producto = p_id_producto;
            
            if row_count() = 0 then
				rollback;
			end if;
			
			delete from carrito_compra_detalles
			where fk_carrito = p_id_carrito and fk_producto = p_id_producto;
            
			if row_count() = 0 then
				rollback;
			end if;
			
		--  verificar si la nueva cantidad excede el stock disponible
		elseif p_nueva_cantidad > p_cantidad_stock then 
			
			update carrito_compra_detalles
			set cantidad = p_cantidad_stock
			where fk_carrito = p_id_carrito and fk_producto = p_id_producto;
            
            if row_count() = 0 then
				rollback;
			end if;
		
		else
			
			-- atualizar la cantidad del producto en el carrito especificado
			update carrito_compra_detalles
			set cantidad = p_nueva_cantidad
			where fk_carrito = p_id_carrito and fk_producto = p_id_producto;
            
            if row_count() = 0 then
				rollback;
			end if;
			
		end if;
		
		-- registrar el cambio en la tabla de autoria_carrito_detalles
		insert into autoria_carrito_detalles (fk_carrito_compra, fk_producto, cantidad_anterior, cantidad_nueva)
		values (p_id_carrito, p_id_producto, p_cantidad_anterior, p_nueva_cantidad);
        
        if row_count() = 0 then
			rollback;
		end if;
		
		-- confirmación de registro de los cambios
		select * from autoria_carrito_detalles;
    
	commit;
        
end //
delimiter ;

-- llamada al procedimiento que contiene la transacción
call p_actualizar_cantidad_producto(3, 1234, 2);
