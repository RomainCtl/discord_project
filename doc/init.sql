/* TABLES */
CREATE TABLE serveur (
	id INTEGER PRIMARY KEY,
	owner_id INTEGER NOT NULL
);

CREATE TABLE role (
	id INTEGER PRIMARY KEY,
	name VARCHAR(30) NOT NULL,
	priority INTEGER DEFAULT 1,
	serveur_id INTEGER NOT NULL,
	FOREIGN KEY (serveur_id) REFERENCES serveur(id)
);

CREATE TABLE moderateur (
	uid INTEGER PRIMARY KEY,
	username VARCHAR(30) NOT NULL,
	lock_is_delete BOOLEAN DEFAULT 0, -- 0: false, 1: true
	serveur_id INTEGER NOT NULL,
	FOREIGN KEY (serveur_id) REFERENCES serveur(id)
);

CREATE TABLE role_moderateur (
	uid_mod INTEGER NOT NULL,
	role_id INTEGER NOT NULL,
	PRIMARY KEY (uid_mod, role_id),
	FOREIGN KEY (uid_mod) REFERENCES moderateur(uid),
	FOREIGN KEY (role_id) REFERENCES role(id)
);

CREATE TABLE command (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	command VARCHAR(200) NOT NULL
);

CREATE TABLE sanction (
	id INTEGER PRIMARY KEY,
	reason TEXT,
	duration INTEGER DEFAULT NULL,
	date DATETIME DEFAULT CURRENT_TIMESTAMP,
	channels VARCHAR DEFAULT NULL,
	user INTEGER NOT NULL,
	author INTEGER NOT NULL,
	serveur_id INTEGER NOT NULL,
	cmd VARCHAR NOT NULL,
	FOREIGN KEY (author) REFERENCES moderateur(uid),
	FOREIGN KEY (serveur_id) REFERENCES serveur(id)
);

CREATE TABLE custom_command (
	id INTEGER PRIMARY KEY,
	command VARCHAR NOT NULL,
	regex VARCHAR NOT NULL
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

CREATE TABLE panel_white_list (
	uid INTEGER PRIMARY KEY,
	serveur_id INTEGER NOT NULL,
	FOREIGN KEY (serveur_id) REFERENCES serveur(id)
);

/* VIEWS */
-- toutes les commandes d'un rôle (custom et normal)
CREATE VIEW command_role AS
SELECT role_id, cmd.*, "" AS regex FROM command AS cmd INNER JOIN role_cmd ON cmd_id=cmd.id
UNION SELECT role_id, cmd.* FROM custom_command AS cmd INNER JOIN role_custom_cmd ON cmd_id=cmd.id;

-- Sanctions en cours
CREATE VIEW active_sanction AS
SELECT * FROM sanction + WHERE duration <> NULL OR duration + strftime('%s', date) > strftime('%s', 'now');

-- liste des ban
CREATE VIEW ban AS
SELECT * FROM sanction WHERE SUBSTR(cmd, 2, 3) = "ban";

-- liste des kick
CREATE VIEW kick AS
SELECT * FROM sanction WHERE SUBSTR(cmd, 2, 4) = "kick";

-- liste des deaf
CREATE VIEW deaf AS
SELECT * FROM sanction WHERE SUBSTR(cmd, 2, 4) = "deaf";

-- liste des mute
CREATE VIEW mute AS
SELECT * FROM sanction WHERE SUBSTR(cmd, 2, 4) = "mute";

-- liste des warn
CREATE VIEW warn AS
SELECT * FROM sanction WHERE SUBSTR(cmd, 2, 4) = "warn";


/* INSERTS */
INSERT INTO serveur (id, owner_id) VALUES
(1,35),
(2,64);

INSERT INTO role (id, name, priority, serveur_id) VALUES
(1, "Modérateur", 1, 2),
(2, "Modérateur RP", 3, 1),
(3, "Modérateur", 1, 1),
(4, "Modérateur vocal", 2, 1),
(5, "Administrateur", 0, 1);

INSERT INTO moderateur (uid, username, lock_is_delete, serveur_id) VALUES
(35, "Vault Boy", 0, 1),
(42, "Mary Sue", 0, 2),
(64, "Yolo18XXX", 0, 2),
(72, "Yolo", 0, 1);

INSERT INTO role_moderateur VALUES
(35,5),
(42,3),
(64,5),
(64,3);

INSERT INTO command (command) VALUES
("!ban @<user> <reason:text> [-d <duration:time(sec)>, -c <channels:list>]"),
("!kick @<user> <reason:text>"),
("!deaf @<user> <reason:text> [-d <duration:time(sec)>, -c <channels:list>]"),
("!mute @<user> <reason:text> [-d <duration:time(sec)>, -c <channels:list>]"),
("!warn @<user> <reason:text>"),
("!create (ban|kick|deaf|mute) -d <duration_restriction> -c <channels_restriction>"),
("!cancel <id_sanction>"),
("!rankup @<user> <role_id>"),
("!derank @<user> <role_id>"),
("!addrole <name>"),
("!delrole <id>"),
("!role add <role_id> <command_id>"),
("!role del <role_id> <command_id>"),
("!getto @<user>"),
("!getfrom @<modo>"),
("!lock <channels:list>"),
("!delock <channels:list>"),
("!delmsg <channel> [-d <duration>, -u @<user>]");

INSERT INTO sanction (reason, duration, date, channels, user, author, serveur_id, cmd) VALUES
("Troll", NULL, CURRENT_TIMESTAMP, ".*audio", 85, 35, 1, "!ban @85 Troll"),
("Troll", NULL, CURRENT_TIMESTAMP, ".*texte", 85, 42, 2, "!ban @85 Troll"),
("Annoyed me", 86400, CURRENT_TIMESTAMP, NULL, 15, 64, 2, "!mute @user3 Annoyed me -d 86400"),
("Test", 3600, CURRENT_TIMESTAMP, NULL, 13, 64, 1, "!mute @user1 Test -d 3600");

INSERT INTO custom_command (command, regex) VALUES
("!ban @<user> <reason:text> -d <duration: time(sec)<3600> -c <channel: IN (chan1,chan2,*general)>", "^!ban[ ]+@([^ ]+)[ ]+((?:(?!-d|-c).)+)(-d[ ]+(3600|3[0-5][0-9]{2}|[0-2][0-9]{3}|[0-9]{0,3}))?([ ]*-c[ ]+(?:(chan1|chan2|\\*general|,))+)?[ ]*$"),
("!mute @<user> <reason:text> -d <duration: time(sec)>60> -c <channel: NOT IN (.text)>", "^!ban[ ]+@([^ ]+)[ ]+((?:(?!-d|-c).)+)(-d[ ]+(3[6-9][0-9]{2}|[0-9]{4,}))?([ ]*-c[ ]+(?:(?!chan1|chan2|\\*general)[0-9a-z,.*])+)?[ ]*$");

INSERT INTO role_cmd VALUES
(4,1),
(2,2),
(1,4);

INSERT INTO role_custom_cmd VALUES
(3,2),
(1,2);