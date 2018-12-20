#drop database banco;

create database banco
default character set utf8
default collate utf8_general_ci;
use banco;


use banco;
#################### Tabela de usuários ###################
create table usuario(
id int not null auto_increment,
nome varchar(30) not null,
email varchar(30) not null,
senha varchar(12) not null,
primary key(id)
)default charset = utf8;


#################### tabela de mercado ####################
create table mercado(
id  int not null auto_increment,
nome  varchar(30) not null,
endereco  varchar(100) not null,
foto varchar(100) not null,
primary key(id)
) default charset = utf8;

################### tabela de produtos######################
create table produto(
id  int not null auto_increment,
nome  varchar(30) not null,
marca varchar(30),
valor  decimal(7,2) not null,
categoria varchar(30),
mercadoId int,
primary key(id),
constraint fk_produto_mercado FOREIGN KEY (mercadoId) REFERENCES mercado (id)
) default charset = utf8;


################## tabela de categorias ######################
create table categoria(
id  int not null auto_increment,
categoria varchar(100),
primary key(id)
) default charset = utf8;


#use banco;
#select produto.nome, mercado.nome, mercado.endereco from produto
#INNER JOIN mercado ON produto.mercadoId = mercado.id
-- select produto.nome, mercadoId, mercado.nome from produto
-- INNER JOIN mercado ON produto.mercadoId = mercado.id


#create table `mercadoproduto` (
#`id`  int not null auto_increment,
#`id_produto` int,
#`id_mercado` int,
#primary key  (id),
#foreign key  (id_produto) references produto(id),
#foreign key  (id_mercado) references mercado(id)
#)default charset = utf8;

###### Insere mercado
#insert into mercado(id,nome,endereco,foto)  values (default,'Dona de casa','Rua 10','foto1');
#insert into mercado(id,nome,endereco,foto)  values (default,'Extra','Rua 12','foto2');


##### Insere produto
#insert into produto(id,nome,marca,valor,categoria,mercadoid)  values (default,'Geleia','aurora','12.50','Geleia','1');
#insert into produto(id,nome,marca,valor,categoria,mercadoid)  values (default,'Arroz','da casa','23.50','Arroz','2');


#####
#insert into mercadoproduto(id,id_produto,id_mercado)  values (default,'1','1');
#insert into mercadoproduto(id,id_produto,id_mercado)  values (default,'1','2');


##### Insere categoria
-- insert into categoria(id,categoria)  values (default,'Suplementos');
-- insert into categoria(id,categoria)  values (default,'Bebidas');
-- insert into categoria(id,categoria)  values (default,'Biscoitos, Bolos e Bolachas');
-- insert into categoria(id,categoria)  values (default,'Carnes');
-- insert into categoria(id,categoria)  values (default,'Congelados');
-- insert into categoria(id,categoria)  values (default,'Conservas');
-- insert into categoria(id,categoria)  values (default,'Doces, Balas, Chocolates e Cia');
-- insert into categoria(id,categoria)  values (default,'Farinhas, Cereais e Complementos');
-- insert into categoria(id,categoria)  values (default,'Fast-Food, Aperitivos e Petiscos');
-- insert into categoria(id,categoria)  values (default,'Frios e Embutidos');
-- insert into categoria(id,categoria)  values (default,'Frutas');
-- insert into categoria(id,categoria)  values (default,'Legumes, Verduras e Grãos');
-- insert into categoria(id,categoria)  values (default,'Manteiga, Óleos e Cia');
-- insert into categoria(id,categoria)  values (default,'Molhos, Caldos e Condimentos');
-- insert into categoria(id,categoria)  values (default,'Ovos, Leite, Queijo e Cia');
-- insert into categoria(id,categoria)  values (default,'Pães');
-- insert into categoria(id,categoria)  values (default,'Sopas & Cremes');
-- insert into categoria(id,categoria)  values (default,'Outros');






#select * from mercado m;

#select g.nome, c.nome from mercado g
#join mercadoproduto a 
#on g.id=a.id_mercado
#join produto c 
#on c.id = a.id_produto;
#use banco;

-- select * from produto;
# select * from mercado;
 #select * from usuario;
#select * from categoria;

### deleta um determinado id
-- DELETE FROM usuario
-- WHERE id = 2;

#### deleta todos os registros de uma tabela
-- TRUNCATE TABLE tbl_teste_incremento;

#select * from usuario;
#use banco;
# select email, senha from usuario;
