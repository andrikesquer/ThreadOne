-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- CREACION DE LA BASE DE DATOS

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

create database ThreadOneFV;

use ThreadOneFV;

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- CREACION DE TABLAS Y RELACIONES

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

create table generos(
    id_genero int auto_increment primary key,
    genero varchar(100) not null
);

create table usuarios(
    id_usuario int auto_increment primary key,
    nombre_usuario varchar(50) not null,
    apellido_usuario varchar(50) not null,
    fecha_nacimiento_usuario date not null,
    fk_genero int,
    email_usuario varchar(50) not null unique,
    telefono_usuario varchar(10) not null unique,
    contrasena_usuario varchar(100) not null,
    fecha_registro_usuario timestamp default current_timestamp,
    codigo_unico varchar(10),
    bloqueo boolean default false,
    foreign key (fk_genero) references generos(id_genero)
);

create table auditoria_cambio_info_usuario(
    id_auditoria_c_i_u int auto_increment primary key,
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
    foreign key (id_usuario) references usuarios(id_usuario) on delete cascade
);

create table auditoria_eliminacion_usuarios(
	id_auditoria_eliminacion_usuario int primary key auto_increment,
	fecha_eliminacion timestamp default current_timestamp,
	eliminado_por varchar(50),
	accion varchar(20),
	id_usuario int,
	nombre_usuario varchar(50),
	apellido_usuario varchar(50), 
	fecha_nacimiento_usuario date,
	fk_genero int,
	email_usuario varchar (50),
	telefono_usuario varchar(10),
    contrasena_usuario varchar(8),
	fecha_registro_usuario timestamp default current_timestamp,
    codigo_unico varchar(10),
    bloqueo tinyint(1)
);

create table intentos_login(
	id_intento int primary key auto_increment,
	fk_usuario int,
	tiempo_intento datetime,
	success boolean,
	foreign key (fk_usuario) references usuarios(id_usuario) on delete cascade
);

create table notificacion(
    id_notificacion int primary key auto_increment,
    destinatario varchar(100),
    subject varchar(100),
    mensaje text,
    tiempo_envio datetime default now()
);

create table direcciones(
	id_direccion int auto_increment primary key,
	calle varchar(50) not null, 
	numero_exterior varchar(6) not null,
	colonia varchar(50) not null,
	cp varchar(5) not null
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
    stock_minimo int not null default 10,
	cantidad_stock int not null,
    foreign key (fk_talla) references tallas(id_talla),
    foreign key (fk_color) references colores(id_color),
    foreign key (fk_precio) references precios(id_precio),
    foreign key (fk_proveedor) references proveedores(id_proveedor)
);

create table alertas_stock(
    id_alerta int auto_increment primary key,
    alerta varchar(200),
    fecha timestamp default current_timestamp
);

create table tamanos_diseno(
	id_tamano_diseno int auto_increment primary key,
	largo float not null,
	ancho float not null
);

create table disenos(
    id_diseno int auto_increment primary key,
    nombre_diseno varchar(30) not null,
    descripcion_diseno varchar(150),
    fk_color int not null,
    fk_tamano_diseno int not null,
    fk_precio int not null,
    personalizado boolean not null, -- personalizado indica si el diseño fue proporcionado por el cliente o no
    foreign key (fk_color) references colores(id_color),
    foreign key (fk_tamano_diseno) references tamanos_diseno(id_tamano_diseno),
    foreign key (fk_precio) references precios(id_precio)
);

create table playeras_disenos(
	id_playera_diseno int auto_increment primary key,
    fk_playera int not null,
    fk_diseno int not null,
    precio_unitario float,
    foreign key (fk_playera) references playeras(id_playera) on delete cascade,
    foreign key (fk_diseno) references disenos(id_diseno) on delete cascade
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
    foreign key (fk_playera_diseno) references playeras_disenos(id_playera_diseno) on delete cascade,
    foreign key (fk_sticker) references stickers(id_sticker) on delete cascade,
    foreign key (fk_categoria) references categorias(id_categoria)
);

create table registro_cambios_stock(
    id_cambio int auto_increment primary key,
    id_producto int not null,
    tabla_producto varchar (50) not null,
    cantidad_anterior int not null,
    cantidad_nueva int not null,
    fecha_cambio timestamp default current_timestamp,
    comentario varchar (255)
);

create table favoritos(
	id_favorito int auto_increment primary key,
    fk_usuario int not null,
    foreign key (fk_usuario) references usuarios(id_usuario) on delete cascade
);

create table favoritos_detalles(
	id_favorito_detalle int auto_increment primary key,
    fk_favorito int not null,
    fk_producto int not null,
    foreign key (fk_favorito) references favoritos(id_favorito) on delete cascade,
    foreign key (fk_producto) references productos(id_producto) on delete cascade
);

create table carrito_compras(
    id_carrito int auto_increment primary key,
    fk_usuario int not null, 
    total_carrito float,
    foreign key (fk_usuario) references usuarios(id_usuario) on delete cascade
);

create table carrito_compra_detalles(
    id_carrito_compra_detalle int auto_increment primary key,
    fk_carrito int not null, 
    fk_producto int not null,
    cantidad int not null,
    subtotal float,
    foreign key (fk_carrito) references carrito_compras(id_carrito) on delete cascade,
    foreign key (fk_producto) references productos(id_producto) on delete cascade
);

create table autoria_carrito_detalles(
	id_auditoria_carrito_detalles int auto_increment primary key,
    fk_carrito_compra int not null,
    fk_producto int not null,
    cantidad_anterior int not null,
    cantidad_nueva int not null,
    fecha timestamp default current_timestamp
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
    total_orden decimal (10, 2),
    total_final decimal (10, 2),
    fk_metodo_pago int not null,
    fk_estado_pago int not null, 
    fk_estado_orden int not null,
    foreign key (fk_usuario) references usuarios(id_usuario) on delete cascade,
    foreign key (fk_sucursal) references sucursales(id_sucursal) on delete cascade,
    foreign key (fk_metodo_pago) references metodos_pago(id_metodo_pago),
    foreign key (fk_estado_pago) references estados_pago(id_estado_pago),
    foreign key (fk_estado_orden) references estados_orden(id_estado_orden)
);

create table registro_cambio_estado_orden(
	id_registro_c_e_o int auto_increment primary key,
	id_orden int,
    estado_anterior int, 
    estado_actual int,
	fecha_actualizacion timestamp default current_timestamp,
	foreign key(id_orden) references ordenes(id_orden) on delete cascade
);

create table ordenes_detalles(
    id_orden_detalle int auto_increment primary key, 
    fk_orden int not null, 
    fk_producto int not null, 
    cantidad int not null,
    subtotal float,
    foreign key (fk_orden) references ordenes(id_orden) on delete cascade,
    foreign key (fk_producto) references productos(id_producto) on delete cascade
);

create table cuentas_threadone(
	id_cuenta_threadone int primary key,
	saldo decimal(15, 2),
    descripcion varchar (100)
);

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- INSERSION DE DATOS

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- generos
insert into generos (genero) values
('Femenino'), ('Masculino'), ('No binario'), ('Otro');

-- generacion de un codigo unico: genera automáticamente un código único para cada cliente basado en su nombre y apellido
delimiter //
create function pepinogenerador(nombre varchar(50), apellido varchar(50)) returns varchar(50) deterministic
begin
    declare codigo varchar(50);
    declare numero_aleatorio int;
    declare codigo_existe int;
    
    set codigo_existe = 1;-- inicializamos la variable para verificar si el código existe
    
    while codigo_existe > 0 do
        set numero_aleatorio = floor(1000 + (rand() * 9000)); -- numero aleatorio
        set codigo = concat(left(nombre, 1), left(apellido, 1), numero_aleatorio); -- concatena caracteres con el numero
        
        select count(*) into codigo_existe from usuarios where codigo_unico = codigo; -- verificamos si el código generado ya existe en la tabla
    end while;
    
    return codigo;
end //
delimiter ;

delimiter //
create trigger pepino before insert on usuarios
for each row 
begin
	set new.codigo_unico = pepinogenerador(new.nombre_usuario, new.apellido_usuario);
end // 
delimiter ;

-- bloqueo de cuenta
delimiter //
create trigger despues_intentos_login
after insert on intentos_login
for each row
begin
    declare intento_fallido int;
    -- contar intentos en 15 min
    select count(*)
    into intento_fallido
    from intentos_login
    where fk_usuario = new.fk_usuario and success = false and tiempo_intento > now() - interval 15 minute;
    
    -- verificar fallo
    if intento_fallido >= 3 then
        update usuarios
        set bloqueo = true
        where id_usuario = new.fk_usuario;

        -- enviar email al administrador
        call enviar_notificacion_admin(new.fk_usuario);
    end if;
end //
delimiter ;

delimiter //
create procedure enviar_notificacion_admin(in p_fk_usuario int)
begin
	declare email_admin varchar(255);
    -- correo del administrador
    set email_admin = 'admin@gmail.com';
    
	insert into notificacion (destinatario, subject, mensaje)
	values (email_admin, 'Cuenta bloqueada', concat('La cuenta del usuario: ', p_fk_usuario, ' ha sido bloqueada después de muchos intentos de iniciar sesión.'));
end //
delimiter ;

-- usuarios
insert into usuarios(nombre_usuario, apellido_usuario, fecha_nacimiento_usuario, fk_genero, email_usuario, telefono_usuario, contrasena_usuario) values
('Juan', 'Perez', '2005-01-15', 2, 'juan.perez@gmail.com', '6141234567', 'passwrd1'),
('Maria', 'Lopez', '2000-03-22', 1,'maria.lopez@gmail.com', '6149876543', 'passwrd2'),
('Carlos', 'Gomez', '2004-07-11', 3, 'carlos.gomez@gmail.com', '6186781234', 'passwrd3'),
('Ana', 'Martinez', '2006-01-30', 4, 'ana.martinez@gmail.com', '6564321987', 'passwrd4'),
('Luis', 'Fernandez', '2001-12-05', 2, 'luis.fernandez@gmail.com', '6143217890', 'passwrd5');

insert into intentos_login (fk_usuario, tiempo_intento, success) values (1, now(), false);
insert into intentos_login (fk_usuario, tiempo_intento, success) values (1, now(), false);
insert into intentos_login (fk_usuario, tiempo_intento, success) values (1, now(), false);

-- direcciones -- 3 proveedores, 3 sucursales
insert into direcciones(calle, numero_exterior, colonia, cp) values
-- sucursales
('Perif. de la Juventud', 401, 'Paseos de Chihuahua', 31119),
('C. Libertad', 109, 'Zona Centro', 31000),
('Av. Prol Teófilo Borunda', 11400, 'Labor de terrazas', 31207),
-- proveedores
('Miguel Sigala', 608, '20 Aniversario', 31137),
('C. Monte Everest', 14902, 'Quintas Carolinas', 31146),
('Av, Instituto Tecnológico de Chihuahua', 8501, 'Tierra y Libertad', 31126);

-- sucursales
insert into sucursales (nombre_sucursal, fk_direccion) values
('Centro', 1),
('Norte', 2),
('Sur', 3);

-- proveedores
insert into proveedores(nombre_proveedor, nombre_contacto_proveedor, apellido_contacto_proveedor, telefono_contacto_proveedor, email_contacto_proveedor, fk_direccion) values
('StarCamisetas', 'Maria', 'Garcia', '6149876543', 'maria.garcia@starcamisetas.com', 4),
('PapeleriaExpress', 'Ana', 'Martinez', '6564321987', 'ana.martinez@papeleriaexpress.com', 5),
('Serigrafita', 'Luis', 'Fernandez', '6143217890', 'luis.fernandez@serigrafita.com', 6);

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

-- playeras
-- se verifica si la nueva cantidad es menor que el stock mínimo establecido para ese producto y, si lo es, envia una notificación al departamento de compras para reabastecer el producto.
delimiter $$
create trigger verificar_stock_minimo
after update on playeras
for each row
begin
    declare mensaje varchar(200);
    if new.cantidad_stock < new.stock_minimo then
        set mensaje = concat('El producto ', new.descripcion_playera,' está por debajo del stock mínimo. Cantidad actual: ', new.cantidad_stock,', stock mínimo: ', new.stock_minimo);
        
        -- insertar el mensaje en la tabla de alertas
        insert into alertas_stock (alerta) values (mensaje);
    end if;
end$$
delimiter ;

insert into playeras (descripcion_playera, fk_talla, fk_color, fk_precio, fk_proveedor, cantidad_stock, stock_minimo) values ('Playera prueba', 1, 1, 1, 1, 15, 20);
update playeras set cantidad_stock = 5 where descripcion_playera = 'Playera prueba';

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
('Kirby Zelda', 'https://i0.wp.com/mynintendonews.com/wp-content/uploads/2017/11/kirby_battle_royale_character_art.png?fit=1886%2C2614&ssl=1', 1, 2, 3, true),
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
('Tarjeta de débito'),
('Tarjeta de crédito'),
('PayPal'),
('Efectivo en punto de pago OXXO'),
('Efectivo en punto de pago Circle K'),
('Efectivo en punto de pago Soriana'),
('Transferencia Bancaria'),
('Apple Pay');

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

    -- verificar si el usuario se registró y realizó la compra el mismo día, si es así, se hará un descuento del 15% del total
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

insert into cuentas_threadone (id_cuenta_threadone, saldo, descripcion) values
(1, 0, 'Cuenta para ingresos por ordenes pagadas');

-- Registro de ingresos de ThreadOne: Actualización del saldo de la empresa mediante las ordenes con pagos realizados
delimiter //
create trigger t_ingresos_threadone
after update on ordenes
for each row
begin
    declare t_total_final decimal(10, 2);
    declare t_fk_estado_pago int;

    -- obtener los valores actualizados usando new
    set t_total_final = new.total_final;
    set t_fk_estado_pago = new.fk_estado_pago;

    if t_fk_estado_pago = 2 then 
        update cuentas_threadone 
        set saldo = saldo + t_total_final
        where id_cuenta_threadone = 1;
    end if;
end //
delimiter ;
-- select * from cuentas_threadone;

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- Procedimientos almacenados

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- Procedimiento almacenado que genera un informe de inventario que incluye el nombre, la cantidad disponible y el precio de todos los productos en stock.

-- PLAYERAS
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
-- call inventario_playeras(8);

-- STICKERS
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
-- call inventario_stickers(8);

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- Procedimiento almacenado que calcula la edad promedio de todos los clientes.

delimiter //
create procedure p_edad_promedio_usuarios()
begin 
	select avg(timestampdiff(year, fecha_nacimiento_usuario, now()))
    as edad_promedio_usuarios
    from usuarios ;
end //
delimiter ;
-- call p_edad_promedio_usuarios;

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- Procedimiento almacenado que devuelve la lista de pedidos que aún no se han completado.

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
-- Call ObtenerPedidosPendientes();

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- Transacciones

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- Actualización de inventario y registro de transacción

delimiter //
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
    case tabla_producto
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
    
end //
DELIMITER ;

call ActualizarStock('stickers', 1, +5, 'stock rellenado');
call ActualizarStock('playeras', 2, -3, 'venta realizada');
-- select * from registro_cambios_stock order by fecha_cambio desc;

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- Cambio de estado de un pedido y actualización de registros

Delimiter //
create procedure actualizar_estado_pedido(
    in p_id_orden int,
    in p_nuevo_estado int
)
begin
    declare p_estado_anterior int;
    select fk_estado_orden into p_estado_anterior from ordenes where id_orden = p_id_orden;
   
    start transaction; -- inicio

		-- actualización el estado de la orden
		update ordenes
		set fk_estado_orden = p_nuevo_estado
		where id_orden = p_id_orden;

		-- verificación primera operación
		if row_count() = 0 then
			rollback;
		end if;

		insert into registro_cambio_estado_orden (id_orden, estado_anterior, estado_actual, fecha_actualizacion)
		values (p_id_orden,  p_estado_anterior, p_nuevo_estado, now());

		-- verificación segunda operación
		if row_count() = 0 then
			rollback;
		end if;

		-- confirmación de ambas operaciones
    commit;
    
end //
delimiter ;

call actualizar_estado_pedido(1, 1);
call actualizar_estado_pedido(2, 1);
call actualizar_estado_pedido(3, 2); -- Reemplazar 1 por las opciones: 1 o 2
-- select * from registro_cambio_estado_orden;

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- Actualización de información del usuario y registro de auditoría

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
    insert into auditoria_cambio_info_usuario (id_usuario, nombre_anterior, nombre_nuevo, apellido_anterior, apellido_nuevo, email_anterior, email_nuevo, telefono_anterior, telefono_nuevo)
    values (p_id_usuario, v_nombre_anterior, p_nombre_nuevo, v_apellido_anterior, p_apellido_nuevo, v_email_anterior, p_email_nuevo, v_telefono_anterior, p_telefono_nuevo);
    
    commit;
end$$
delimiter ;

call actualizar_usuario(1, 'Mike', 'Tyson', 'miketyson@gmail.com', '6141592653');
-- select * from auditoria_cambio_info_usuario;

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- Disparador que registra la eliminación de un usuario
delimiter //
create trigger t_auditoria_eliminacion_usuarios
after delete on usuarios
for each row
begin 
	insert into auditoria_eliminacion_usuarios(
												eliminado_por, accion, id_usuario, nombre_usuario, apellido_usuario, fecha_nacimiento_usuario,
												fk_genero, email_usuario, telefono_usuario, contrasena_usuario, fecha_registro_usuario, codigo_unico, bloqueo
                                                )
	values(
			current_user(), 'elimino a', old.id_usuario, old.nombre_usuario, old.apellido_usuario, old.fecha_nacimiento_usuario, 
            old.fk_genero, old.email_usuario, old.telefono_usuario, old.contrasena_usuario, old.fecha_registro_usuario, old.codigo_unico, old.bloqueo
            );
end //
delimiter ;

-- Procedimiento almacenado para la eliminación de un usuario
delimiter //
create procedure p_eliminar_usuario(in p_id_usuario int)
begin
	start transaction;
        delete from usuarios where id_usuario = p_id_usuario;
        
        if row_count() = 0 then
			rollback;
		else 
			commit;
		end if;
end //
delimiter ;

call p_eliminar_usuario(5);
-- select * from auditoria_eliminacion_usuarios;

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- Actualización del carrito de compras y registro de acción

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
    
	commit;
        
end //
delimiter ;

call p_actualizar_cantidad_producto(3, 1234, 2);
-- select * from autoria_carrito_detalles;

CREATE TABLE juan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  shirtId VARCHAR(255) NOT NULL,
  color INT NOT NULL,
  size INT NOT NULL,
  quantity INT NOT NULL
);