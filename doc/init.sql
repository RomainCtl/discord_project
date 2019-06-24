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
	id BIGINT PRIMARY KEY
);

/* role_moderateur : le moderateur et le role qui lui est attribué */
CREATE TABLE role_moderateur (
	id_mod BIGINT NOT NULL,
	role_id INTEGER NOT NULL,
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
	-- FOREIGN KEY (author) REFERENCES moderateur(id) ON DELETE RESTRICT, -- author peut aussi etre le owner d'un serveur
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
CREATE OR REPLACE FUNCTION user_can_use_cmd(IN userid BIGINT, IN cmdid INTEGER, IN serveurid BIGINT)
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

-- ajouter un role a un moderateur
CREATE OR REPLACE FUNCTION rankup_user(IN userid BIGINT, IN roleid INTEGER, IN serveurid BIGINT)
RETURNS void AS $$
BEGIN
	-- check if exist in moderateur table
	PERFORM * FROM moderateur WHERE id=userid;
	IF NOT FOUND THEN
		INSERT INTO moderateur VALUES (userid);
	END IF;
	-- check if exist in staff table
	PERFORM * FROM staff WHERE id_mod=userid AND serveur_id=serveurid;
	IF NOT FOUND THEN
		INSERT INTO staff VALUES (userid, serveurid);
	END IF;
	INSERT INTO role_moderateur VALUES (userid, roleid);
END;
$$ LANGUAGE plpgsql;

-- supprimer un role a un moderateur
CREATE OR REPLACE FUNCTION derank_user(IN userid BIGINT, IN roleid INTEGER, IN serveurid BIGINT)
RETURNS void AS $$
BEGIN
	DELETE FROM role_moderateur WHERE id_mod = userid AND role_id = roleid;

	-- check if user have another role on this serveur, if not delete from staff
	PERFORM * FROM role_moderateur INNER JOIN role ON role_id=id WHERE id_mod=userid AND serveur_id=serveurid;
	IF NOT FOUND THEN
		DELETE FROM staff WHERE id_mod=userid AND serveur_id=serveurid;
	END IF;
END;
$$ LANGUAGE plpgsql;

/* TRIGGERS */

-- check coherence serveur_id entre role et cmd
CREATE OR REPLACE FUNCTION check_role_cmd() RETURNS trigger AS $$
DECLARE serv_id BIGINT;
BEGIN
	SELECT serveur_id INTO serv_id FROM command WHERE id=new.cmd_id;
	PERFORM * FROM role WHERE id=new.role_id AND (serveur_id=serv_id OR serv_id IS NULL);
	IF NOT FOUND THEN
		RAISE EXCEPTION 'Unknown role_cmd in serveur' USING DETAIL = 'Impossible d''ajouter une commande à un rôle s''ils proviennent d''un serveur différent !';
	END IF;
	RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trig_check_role_cmd
BEFORE INSERT
ON role_cmd FOR EACH ROW EXECUTE PROCEDURE check_role_cmd();

-- check coherence serveur_id entre staff et role
CREATE OR REPLACE FUNCTION check_role_moderateur() RETURNS trigger AS $$
DECLARE serv_id BIGINT;
BEGIN
	SELECT serveur_id INTO serv_id FROM staff AS s WHERE s.id_mod=new.id_mod;
	PERFORM * FROM role WHERE id=new.role_id AND serveur_id=serv_id;
	IF NOT FOUND THEN
		RAISE EXCEPTION 'Unknown role_moderateur in serveur' USING DETAIL = 'Impossible d''ajouter un role à un moderateur s''ils proviennent d''un serveur différent !';
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
	RETURN old;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trig_staff_remove
AFTER DELETE
ON staff FOR EACH ROW EXECUTE PROCEDURE staff_remove();

/* INSERTS global commands */

INSERT INTO command (id, command, regex, serveur_id) VALUES
(1, '!ban @<user> <reason:text> [-d <duration:time(sec)>, -c <channels:list>]', '', NULL),
(2, '!kick @<user> <reason:text>', '', NULL),
(3, '!deaf @<user> <reason:text> [-d <duration:time(sec)>, -c <channels:list>]', '', NULL),
(4, '!mute @<user> <reason:text> [-d <duration:time(sec)>, -c <channels:list>]', '', NULL),
(5, '!warn @<user> <reason:text>', '', NULL),
(6, '!create (ban|kick|deaf|mute) -d <duration_restriction> -c <channels_restriction>', '', NULL),
(7, '!cancel <id_sanction>', '', NULL),
(8, '!rankup @<user> <role_id>', '', NULL),
(9, '!derank @<user> <role_id>', '', NULL),
(10, '!addrole <name>', '^!', NULL),
(11, '!delrole <id>', '', NULL),
(12, '!role add <role_id> <command_id>', '', NULL),
(13, '!role del <role_id> <command_id>', '', NULL),
(14, '!getto @<user>', '', NULL),
(15, '!getfrom @<modo>', '', NULL),
(16, '!lock <channels:list>', '', NULL),
(17, '!delock <channels:list>', '', NULL),
(18, '!delmsg <channel> [-d <duration>, -u @<user>]', '', NULL);
ALTER SEQUENCE command_id_seq RESTART WITH 19;
