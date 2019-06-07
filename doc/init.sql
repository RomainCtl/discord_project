CREATE TABLE serveur (
	id INTEGER PRIMARY KEY,
	owner_id INTEGER NOT NULL
);

CREATE TABLE role_moderateur (
	id INTEGER PRIMARY KEY,
	name VARCHAR(30) NOT NULL
);

CREATE TABLE moderateur (
	uid INTEGER PRIMARY KEY,
	username VARCHAR(30) NOT NULL,
	serveur_id INTEGER NOT NULL,
	role_id INTEGER NOT NULL,
	FOREIGN KEY (serveur_id) REFERENCES serveur(id)
	FOREIGN KEY (role_id) REFERENCES role_moderateur(id)
);

CREATE TABLE command (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	command VARCHAR(200) NOT NULL
);

CREATE TABLE sanction (
	id INTEGER PRIMARY KEY,
	reason TEXT,
	duration DATETIME DEFAULT NULL,
	date DATETIME DEFAULT CURRENT_TIMESTAMP,
	user INTEGER NOT NULL,
	author INTEGER NOT NULL,
	serveur_id INTEGER NOT NULL,
	cmd VARCHAR NOT NULL,
	FOREIGN KEY (author) REFERENCES moderateur(id),
	FOREIGN KEY (serveur_id) REFERENCES serveur(id)
);

CREATE TABLE custom_command (
	id INTEGER PRIMARY KEY,
	command VARCHAR NOT NULL
);

CREATE TABLE role_cmd (
	role_id INTEGER NOT NULL,
	cmd_id INTEGER NOT NULL,
	PRIMARY KEY (role_id, cmd_id),
	FOREIGN KEY (cmd_id) REFERENCES command(id),
	FOREIGN KEY (role_id) REFERENCES role(id)
);

CREATE TABLE role_custom_cmd (
	role_id INTEGER NOT NULL,
	cmd_id INTEGER NOT NULL,
	PRIMARY KEY (role_id, cmd_id),
	FOREIGN KEY (cmd_id) REFERENCES custom_command(id),
	FOREIGN KEY (role_id) REFERENCES role(id)
);


INSERT INTO serveur VALUES (1,35),(2,64);

INSERT INTO role_moderateur VALUES (1, "Modérateur RP"),(2, "Modérateur"), (3, "Modérateur vocal"), (4, "Administrateur");

INSERT INTO moderateur VALUES (35, "Vault Boy",1,4),(42, "Mary Sue", 2, 2),(64, "Yolo18XXX", 2, 4), (64,"Yolo",1,2);

INSERT INTO command VALUES (1,"!ban @<user> <reason:text> [-d <duration:time(sec)>, -c <channels:list>]"),(2,"!kick @<user> <reason:text> [-c <channels:list>]");

INSERT INTO sanction VALUES (1, "Troll", NULL, CURRENT_TIMESTAMP, 85, 35, 1, "!ban @85 Troll"),
							(2, "Troll", NULL, CURRENT_TIMESTAMP, 85, 42, 2, "!ban @85 Troll"),
							(3, "Annoyed me", "0-0-1 00:00:00", CURRENT_TIMESTAMP, 15, 64, 2, "!mute @15 Annoyed me -d 0-0-1 00:00:00"),
							(4, "Test", "0-0-1 12:00:00", CURRENT_TIMESTAMP, 39, 64, 1, "!mute @39 Test -d 0-0-1 12:00:00");

INSERT INTO custom_command VALUES (1,"!ban @<user> <reason:text> -d <duration> <3600 -c <channel> IN (chan1,chan2,*general)"),(2,"!mute @<user> <reason:text> -d <duration> >60 -c <channel> NOT IN (.text)");

INSERT INTO role_cmd VALUES (4,1),(2,2);

INSERT INTO role_custom_cmd VALUES (3,2),(1,2);