CREATE TABLE serveur (
	id INTEGER PRIMARY KEY,
	owner_id INTEGER NOT NULL
);

CREATE TABLE role_moderateur (
	id INTEGER PRIMARY KEY,
	name VARCHAR(30) NOT NULL
);

CREATE TABLE moderateur (
	id INTEGER PRIMARY KEY,
	username VARCHAR(30) NOT NULL,
	serveur_id INTEGER NOT NULL,
	role_id INTEGER NOT NULL,
	FOREIGN KEY (serveur_id) REFERENCES serveur(id)
	FOREIGN KEY (role_id) REFERENCES role_moderateur(id)
);

CREATE TABLE channel (
	id INTEGER PRIMARY KEY,
	type INTEGER NOT NULL,
	serveur_id INTEGER NOT NULL,
	FOREIGN KEY (serveur_id) REFERENCES serveur(id)
);

CREATE TABLE cmd (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	commande VARCHAR(200) NOT NULL,
	type VARCHAR(30) NOT NULL CHECK (type IN ("BAN", "KICK", "MUTE", "SOURD", "AVERTISSEMENT"))
);

CREATE TABLE sanction_membre (
	id INTEGER PRIMARY KEY,
	reason TEXT,
	duration DATETIME DEFAULT NULL,
	date DATETIME DEFAULT CURRENT_TIMESTAMP,
	user INTEGER NOT NULL,
	author INTEGER NOT NULL,
	cmd_id INTEGER NOT NULL,
	serveur_id INTEGER NOT NULL,
	FOREIGN KEY (cmd_id) REFERENCES cmd(id),
	FOREIGN KEY (author) REFERENCES moderateur(id),
	FOREIGN KEY (serveur_id) REFERENCES serveur(id)
);

CREATE TABLE channel_concerne (
	channel_id INTEGER NOT NULL,
	cmd_id INTEGER NOT NULL,
	PRIMARY KEY(channel_id, cmd_id),
	FOREIGN KEY (channel_id) REFERENCES channel(id),
	FOREIGN KEY (cmd_id) REFERENCES cmd(id)
);

CREATE TABLE role_cmd (
	role_id INTEGER NOT NULL,
	cmd_id INTEGER NOT NULL,
	PRIMARY KEY (role_id, cmd_id),
	FOREIGN KEY (cmd_id) REFERENCES cmd(id),
	FOREIGN KEY (role_id) REFERENCES role(id)
);
