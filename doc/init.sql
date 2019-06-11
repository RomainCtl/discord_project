CREATE TABLE serveur (
	id INTEGER PRIMARY KEY,
	owner_id INTEGER NOT NULL
);

CREATE TABLE role (
	id INTEGER PRIMARY KEY,
	name VARCHAR(30) NOT NULL
);

CREATE TABLE moderateur (
	uid INTEGER PRIMARY KEY,
	username VARCHAR(30) NOT NULL,
	lock_is_delete BOOLEAN DEFAULT FALSE,
	serveur_id INTEGER NOT NULL,
	FOREIGN KEY (serveur_id) REFERENCES serveur(id)
);

CREATE TABLE role_moderateur (
	uid_mod INTEGER NOT NULL,
	role_id INTEGER NOT NULL,
	priority INTEGER DEFAULT 1,
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
	duration DATETIME DEFAULT NULL,
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


INSERT INTO serveur VALUES (1,35),(2,64);

INSERT INTO role_moderateur VALUES (1, "Modérateur RP"),(2, "Modérateur"), (3, "Modérateur vocal"), (4, "Administrateur");

INSERT INTO moderateur VALUES (35, "Vault Boy",1,4),(42, "Mary Sue", 2, 2),(64, "Yolo18XXX", 2, 4), (64,"Yolo",1,2);

INSERT INTO command VALUES
(1,"!ban @<user> <reason:text> [-d <duration:time(sec)>, -c <channels:list>]"),
(2,"!kick @<user> <reason:text> [-c <channels:list>]"),
(3,"!deaf @<user> <reason:text> [-d <duration:time(sec)>, -c <channels:list>]"),
(4,"!mute @<user> <reason:text> [-d <duration:time(sec)>, -c <channels:list>]"),
(5,"!warn @<user> <reason:text>"),
(6,"!create (ban|kick|deaf|mute) -d <duration_restriction> -c <channels_restriction>"),
(7,"!!cancel <id_sanction>"),
(8,"!rankup @<user> <role_id>"),
(9,"!derank @<user> <role_id>"),
(10,"!addrole <name>"),
(11,"!delrole <id>"),
(12,"!role add <role_id> <command_id>"),
(13,"!role del <role_id> <command_id>"),
(14,"!getto @<user>"),
(15,"!getfrom @<modo>"),
(16,"!lock <channels:list>"),
(17,"!delock <channels:list>"),
(18,"!delmsg <channel> [-d <duration>, -u @<user>]");

INSERT INTO sanction VALUES (1, "Troll", NULL, CURRENT_TIMESTAMP, ".*audio", 85, 35, 1, "!ban @85 Troll"),
							(2, "Troll", NULL, CURRENT_TIMESTAMP, ".*texte", 85, 42, 2, "!ban @85 Troll"),
							(3, "Annoyed me", "0-0-1 00:00:00", CURRENT_TIMESTAMP, 15, 64, 2, "!mute @15 Annoyed me -d 0-0-1 00:00:00"),
							(4, "Test", "0-0-1 12:00:00", CURRENT_TIMESTAMP, 39, 64, 1, "!mute @39 Test -d 0-0-1 12:00:00");

INSERT INTO custom_command VALUES (1,"!ban @<user> <reason:text> -d <duration> <3600 -c <channel> IN (chan1,chan2,*general)", "test"),
								  (2,"!mute @<user> <reason:text> -d <duration> >60 -c <channel> NOT IN (.text)", "test");

INSERT INTO role_cmd VALUES (4,1),(2,2);

INSERT INTO role_custom_cmd VALUES (3,2),(1,2);