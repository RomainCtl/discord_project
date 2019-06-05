CREATE TABLE Serveur(
	id integer NOT NULL,
	owner_id integer NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE mode_role(
	id integer NOT NULL,
	name varchar(30) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE Moderateur(
	id integer NOT NULL,
	username varchar(30) NOT NULL,
	serveur integer NOT NULL,
	role integer NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY (serveur) REFERENCES Serveur(id)
	FOREIGN KEY (role) REFERENCES mode_role(id)
);

CREATE TABLE Channel(
	id integer NOT NULL,
	type integer NOT NULL,
	serveur integer NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (serveur) REFERENCES Serveur(id)
);

CREATE TABLE cmd(
	id integer NOT NULL,
	commande varchar(200) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE Sanction_membre(
	id integer NOT NULL,
	user integer NOT NULL,
	reason text,
	duration datetime DEFAULT NULL,
	sanction_date datetime NOT NULL,
	cmd_id integer NOT NULL,
	author integer NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (cmd_id) REFERENCES cmd(id),
	FOREIGN KEY (author) REFERENCES Moderateur(id),
);

CREATE TABLE Channel_concerned(
	channel_id integer NOT NULL,
	cmd_id integer NOT NULL,
	PRIMARY KEY(channel_id, sm_id),
	FOREIGN KEY (channel_id) REFERENCES Channel(id),
	FOREIGN KEY (cmd_id) REFERENCES cmd(id),
);

CREATE TABLE role_cmd(
	id_role integer NOT NULL,
	id_cmd integer NOT NULL,
	PRIMARY KEY (id_role, id_cmd),
	FOREIGN KEY (id_cmd) REFERENCES cmd(id),
	FOREIGN KEY (id_role) REFERENCES role(id),
);

CREATE TABLE Ban(
	
);

CREATE TABLE Muet(

);

CREATE TABLE Kick(

);

CREATE TABLE Sourd(

);

CREATE TABLE Avertissement(

);

CREATE VIEW Ban_user(
	SELECT sm.* 
	FROM sanction_membre sm INNER JOIN cmd ON sm.cmd_id = cmd.id 
	WHERE 
);



#Requete :

#1
SELECT serveur.* 
FROM serveur;

#2
SELECT *
FROM mode_role;

#3
UPDATE Moderateur
SET role = 
WHERE Moderateur.id = ;

#4
SELECT *
FROM Moderateur;

#5
INSERT INTO sanction_membre VALUES (1,1,'reason','2019-06-06','2021-12-10',10,3);
