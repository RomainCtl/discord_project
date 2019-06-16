CREATE SCHEMA IF NOT EXISTS bot_moderation;
SET search_path TO bot_moderation; -- use schema

/* TABLES */
CREATE TABLE serveur (
	id BIGINT PRIMARY KEY,
	owner_id BIGINT NOT NULL
);

CREATE TABLE role (
	id SERIAL PRIMARY KEY,
	name VARCHAR(30) NOT NULL,
	priority INTEGER DEFAULT 1,
	serveur_id BIGINT NOT NULL,
	UNIQUE(name, serveur_id),
	FOREIGN KEY (serveur_id) REFERENCES serveur(id) ON DELETE CASCADE
);

CREATE TABLE moderateur (
	id BIGINT PRIMARY KEY,
	username VARCHAR(30) NOT NULL
);

CREATE TABLE role_moderateur (
	id_mod INTEGER NOT NULL,
	role_id BIGINT NOT NULL,
	PRIMARY KEY (id_mod, role_id),
	FOREIGN KEY (id_mod) REFERENCES moderateur(id) ON DELETE CASCADE,
	FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE
);

CREATE TABLE staff (
	id_mod BIGINT NOT NULL,
	serveur_id BIGINT NOT NULL,
	PRIMARY KEY (id_mod, serveur_id),
	FOREIGN KEY (id_mod) REFERENCES moderateur(id) ON DELETE CASCADE,
	FOREIGN KEY (serveur_id) REFERENCES serveur(id) ON DELETE CASCADE
);

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

CREATE TABLE command (
	id SERIAL PRIMARY KEY,
	command VARCHAR NOT NULL,
	regex VARCHAR NOT NULL,
	serveur_id BIGINT DEFAULT NULL, -- les commandes globales
	FOREIGN KEY (serveur_id) REFERENCES serveur(id) ON DELETE CASCADE
);

CREATE TABLE role_cmd (
	role_id INTEGER NOT NULL,
	cmd_id INTEGER NOT NULL,
	PRIMARY KEY (role_id, cmd_id),
	FOREIGN KEY (cmd_id) REFERENCES command(id) ON DELETE CASCADE,
	FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE
);

CREATE TABLE panel_white_list (
	user_id BIGINT NOT NULL,
	serveur_id BIGINT NOT NULL,
	PRIMARY KEY (user_id, serveur_id),
	FOREIGN KEY (serveur_id) REFERENCES serveur(id) ON DELETE CASCADE
);

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