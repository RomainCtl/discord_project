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
	cmd_id INTEGER NOT NULL,
	serveur_id INTEGER NOT NULL,
	FOREIGN KEY (cmd_id) REFERENCES command(id),
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
