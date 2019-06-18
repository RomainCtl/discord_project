CREATE SCHEMA IF NOT EXISTS bot_moderation;
SET search_path TO bot_moderation; -- use schema

/* TABLES */

/* Serveur : l'id du serveur et de son propriétaire */
CREATE TABLE serveur (
	id BIGINT PRIMARY KEY,
	owner_id BIGINT NOT NULL
);

/* Role : on définit les rôles propre à l'application, par défaut la priorité est élevé car le rôle n'est pas important de base */
CREATE TABLE role (
	id SERIAL PRIMARY KEY,
	name VARCHAR(30) NOT NULL,
	priority INTEGER DEFAULT 5,
	serveur_id BIGINT NOT NULL,
	UNIQUE(name, serveur_id),
	FOREIGN KEY (serveur_id) REFERENCES serveur(id) ON DELETE CASCADE
);

/* Moderateur : la liste des modérateurs que le bot reconnait */
CREATE TABLE moderateur (
	id BIGINT PRIMARY KEY,
	username VARCHAR(30) NOT NULL
);

/* role_moderateur : le moderateur et le role qui lui est attribué */
CREATE TABLE role_moderateur (
	id_mod INTEGER NOT NULL,
	role_id BIGINT NOT NULL,
	PRIMARY KEY (id_mod, role_id),
	FOREIGN KEY (id_mod) REFERENCES moderateur(id) ON DELETE CASCADE,
	FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE
);

/* Staff : le serveur auxquel le modérateur est rattaché. Un modérateur peut avoir plusieurs serveurs */
CREATE TABLE staff (
	id_mod BIGINT NOT NULL,
	serveur_id BIGINT NOT NULL,
	PRIMARY KEY (id_mod, serveur_id),
	FOREIGN KEY (id_mod) REFERENCES moderateur(id) ON DELETE CASCADE,
	FOREIGN KEY (serveur_id) REFERENCES serveur(id) ON DELETE CASCADE
);

/* Sanction : on définit les punitions, avec toutes les informations nécessaire pour le bot pour la traiter */
CREATE TABLE sanction (
	id SERIAL PRIMARY KEY,
	reason TEXT,
	duration INTEGER DEFAULT NULL,
	date TIMESTAMP DEFAULT now(),
	channels VARCHAR(200) DEFAULT NULL,
	victim BIGINT NOT NULL,
	author BIGINT NOT NULL,
	serveur_id BIGINT,
	cmd VARCHAR NOT NULL,
	FOREIGN KEY (author) REFERENCES moderateur(id) ON DELETE RESTRICT,
	FOREIGN KEY (serveur_id) REFERENCES serveur(id) ON DELETE SET NULL -- nous gardons les sanctions meme si le serveur est supprimé
);

/* Command : les types de commande original utilisable sur des serveurs spécifique */
CREATE TABLE command (
	id SERIAL PRIMARY KEY,
	command VARCHAR NOT NULL,
	regex VARCHAR NOT NULL,
	serveur_id BIGINT DEFAULT NULL, -- les commandes globales
	FOREIGN KEY (serveur_id) REFERENCES serveur(id) ON DELETE CASCADE
);

/* Role_cmd : a quel rôle une commande est liée */
CREATE TABLE role_cmd (
	role_id INTEGER NOT NULL,
	cmd_id INTEGER NOT NULL,
	PRIMARY KEY (role_id, cmd_id),
	FOREIGN KEY (cmd_id) REFERENCES command(id) ON DELETE CASCADE,
	FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE
);

/* Panel_white_list : liste des personnes autorisées sur un serveur */
CREATE TABLE panel_white_list (
	user_id BIGINT NOT NULL,
	serveur_id BIGINT NOT NULL,
	PRIMARY KEY (user_id, serveur_id),
	FOREIGN KEY (serveur_id) REFERENCES serveur(id) ON DELETE CASCADE
);

<<<<<<< HEAD

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
=======
/* VIEWS */

-- Sanctions en cours
CREATE VIEW active_sanction AS
SELECT * FROM sanction WHERE duration <> NULL OR date + duration *interval'1 second' > now();

-- liste des ban
CREATE VIEW ban AS
SELECT * FROM sanction WHERE substring(cmd, 2, 3) = 'ban';

-- liste des kick
CREATE VIEW kick AS
SELECT * FROM sanction WHERE substring(cmd, 2, 4) = 'kick';

-- liste des deaf
CREATE VIEW deaf AS
SELECT * FROM sanction WHERE substring(cmd, 2, 4) = 'deaf';

-- liste des mute
CREATE VIEW mute AS
SELECT * FROM sanction WHERE substring(cmd, 2, 4) = 'mute';

-- liste des warn
CREATE VIEW warn AS
SELECT * FROM sanction WHERE substring(cmd, 2, 4) = 'warn';


/* FUNCTIONS */

-- un moderateur peut utiliser une commande ?
CREATE OR REPLACE FUNCTION user_can_use_cmd(IN userid INTEGER, IN cmdid INTEGER, IN serveurid INTEGER)
RETURNS boolean AS $$
BEGIN
	PERFORM * FROM serveur WHERE id=serveurid AND owner_id=userid;
	IF FOUND THEN -- le owner peut utiliser toutes les commandes de son serveur
		PERFORM * FROM command WHERE serveur_id IS NULL OR serveur_id=serveurid;
	ELSE
		PERFORM * FROM role
		INNER JOIN role_moderateur AS rm ON id=rm.role_id
		INNER JOIN role_cmd AS rc ON id=rc.role_id
		WHERE serveur_id=serveurid AND id_mod=userid;
	END IF;
	RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

/* TRIGGERS */

-- check coherence serveur_id entre role et cmd
CREATE OR REPLACE FUNCTION check_role_cmd() RETURNS trigger AS $$
DECLARE serv_id INTEGER;
BEGIN
	SELECT serveur_id INTO serv_id FROM command WHERE id=new.cmd_id;
	PERFORM * FROM role WHERE id=new.role_id AND (serveur_id=serv_id OR serv_id IS NULL);
	IF NOT FOUND THEN
		RAISE EXCEPTION 'Impossible d''ajouter une commande à un rôle s''ils proviennent d''un serveur différent !';
	END IF;
	RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trig_check_role_cmd
BEFORE INSERT
ON role_cmd FOR EACH ROW EXECUTE PROCEDURE check_role_cmd();

-- check coherence serveur_id entre staff et role
CREATE OR REPLACE FUNCTION check_role_moderateur() RETURNS trigger AS $$
DECLARE serv_id INTEGER;
BEGIN
	SELECT serveur_id INTO serv_id FROM staff AS s WHERE s.id_mod=new.id_mod;
	PERFORM * FROM role WHERE id=new.role_id AND serveur_id=serv_id;
	IF NOT FOUND THEN
		RAISE EXCEPTION 'Impossible d''ajouter un role à un moderateur s''ils proviennent d''un serveur différent !';
	END IF;
	RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trig_check_role_moderateur
BEFORE INSERT
ON role_moderateur FOR EACH ROW EXECUTE PROCEDURE check_role_moderateur();

-- remove modo from staff => remove all role_moderateur from this serveur
CREATE OR REPLACE FUNCTION staff_remove() RETURNS trigger AS $$
BEGIN
	DELETE FROM role_moderateur USING role WHERE id=role_id AND serveur_id=old.serveur_id AND id_mod=old.id_mod;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trig_staff_remove
AFTER DELETE
ON staff FOR EACH ROW EXECUTE PROCEDURE staff_remove();

/* INSERTS DATA Example */
INSERT INTO serveur (id, owner_id) VALUES
(1,35),
(2,64);

INSERT INTO role (id, name, priority, serveur_id) VALUES
(1, 'Modérateur', 1, 2),
(2, 'Modérateur RP', 3, 1),
(3, 'Modérateur', 1, 1),
(4, 'Modérateur vocal', 2, 1);

INSERT INTO moderateur (id, username) VALUES
(35, 'Vault Boy'),
(42, 'Mary Sue'),
(64, 'Yolo18XXX'),
(72, 'Yolo');

INSERT INTO staff (id_mod, serveur_id) VALUES
(35, 2),
(42, 2),
(64, 1),
(72, 1);

INSERT INTO role_moderateur VALUES
(35,1),
(42,1),
(64,2),
(64,3);

INSERT INTO command (command, regex, serveur_id) VALUES
('!ban @<user> <reason:text> [-d <duration:time(sec)>, -c <channels:list>]', '', NULL),
('!kick @<user> <reason:text>', '', NULL),
('!deaf @<user> <reason:text> [-d <duration:time(sec)>, -c <channels:list>]', '', NULL),
('!mute @<user> <reason:text> [-d <duration:time(sec)>, -c <channels:list>]', '', NULL),
('!warn @<user> <reason:text>', '', NULL),
('!create (ban|kick|deaf|mute) -d <duration_restriction> -c <channels_restriction>', '', NULL),
('!cancel <id_sanction>', '', NULL),
('!rankup @<user> <role_id>', '', NULL),
('!derank @<user> <role_id>', '', NULL),
('!addrole <name>', '', NULL),
('!delrole <id>', '', NULL),
('!role add <role_id> <command_id>', '', NULL),
('!role del <role_id> <command_id>', '', NULL),
('!getto @<user>', '', NULL),
('!getfrom @<modo>', '', NULL),
('!lock <channels:list>', '', NULL),
('!delock <channels:list>', '', NULL),
('!delmsg <channel> [-d <duration>, -u @<user>]', '', NULL),
('!ban @<user> <reason:text> -d <duration: time(sec)<3600> -c <channel: IN (chan1,chan2,*general)>', '^!ban[ ]+@([^ ]+)[ ]+((?:(?!-d|-c).)+)(-d[ ]+(3600|3[0-5][0-9]{2}|[0-2][0-9]{3}|[0-9]{0,3}))?([ ]*-c[ ]+(?:(chan1|chan2|\\*general|,))+)?[ ]*$', 1),
('!mute @<user> <reason:text> -d <duration: time(sec)>60> -c <channel: NOT IN (.text)>', '^!ban[ ]+@([^ ]+)[ ]+((?:(?!-d|-c).)+)(-d[ ]+(3[6-9][0-9]{2}|[0-9]{4,}))?([ ]*-c[ ]+(?:(?!chan1|chan2|\\*general)[0-9a-z,.*])+)?[ ]*$', 1);

INSERT INTO sanction (reason, duration, channels, victim, author, serveur_id, cmd) VALUES
('Troll', NULL, '.*audio', 85, 35, 1, '!ban @85 reason'),
('Troll', NULL, '.*texte', 85, 42, 2, '!ban @85 other reason'),
('Annoyed me', 86400, NULL, 15, 64, 2, '!mute @user3 Annoyed me -d 86400'),
('Test', 3600, NULL, 13, 64, 1, '!mute @user1 Test -d 3600');

INSERT INTO role_cmd VALUES
(4,1),
(2,2),
(1,4),
(3,19),
(2,20);
>>>>>>> 58c901526aa981cd1f34cecf39c12e5571e5e57c
