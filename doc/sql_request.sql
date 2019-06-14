--Requete : (SQLITE3)

-- 01 - Récupérer l’ensemble des serveurs Discord ayant invité le bot.
SELECT * FROM serveur;

-- 02 - Récupérer l’ensemble des grades liés à la modération d’un serveur Discord.
SELECT * FROM role;

-- 03 - Mettre à jour le rôle d’un membre à grade lié à la modération.
UPDATE moderateur SET role_id = 1 WHERE moderateur.uid= 41771983423143937;

-- 04 - Récupérer l’ensemble des modérateurs liés à un serveur Discord.
SELECT * FROM moderateur WHERE serveur_id = ? AND lock_is_delete = 0;

-- 05 - Appliquer une sanction à un utilisateur sur un serveur Discord.
INSERT INTO sanction (reason, duration, user, author, cmd_id, serveur_id) VALUES
("sans raison", 3600, 41771983423143937, 7877198353213996, 3, 1);

-- 06 - Récupérer l’ensemble des sanctions appliquées sur un serveur Discord.
SELECT sm.* FROM sanction AS sm INNER JOIN serveur ON serveur.id = serveur_id WHERE serveur_id = 1;

-- 07 - Récupérer la liste des joueurs dont les sanctions sont toujours actives sur un serveur Discord.
SELECT user FROM active_sanction WHERE serveur_id = 1; -- on utilise la view

-- 8 - Récupérer la liste des joueurs étant connectés sur au moins deux serveurs Discords.
-- Changement de consigne : Ne pas la faire

-- 09 - Récupérer les sanctions liées à un joueur, et leur nombre.
SELECT * FROM sanction WHERE user = 41771983423143937;
SELECT COUNT(*) FROM sanction WHERE user = 41771983423143937 GROUP BY user;

-- 10 - Récupérer la liste de sanctions infligées à un joueur par un modérateur.
SELECT * FROM sanction WHERE user = 41771983423143937 and author = 12771983423143989;

-- 11 - Récupérer la liste de sanctions infligées par un modérateur et leur nombre.
SELECT * FROM sanction WHERE author = 12771983423143989;
SELECT COUNT(*) FROM sanction WHERE author = 12771983423143989 GROUP BY author;

-- 13 - Afficher la liste de sanctions infligées sur un serveur
-- Même question que le Q°6

-- 15 - Récupérer les joueurs ayant des sanctions sur plusieurs serveurs.
SELECT user FROM sanction GROUP BY user HAVING COUNT(serveur_id) > 1;

-- 16 - Récupérer la liste de joueur ayant des sanctions sur différents serveurs partageant une temporalité commune.
SELECT DISTINCT sm1.user FROM sanction AS sm1
INNER JOIN sanction AS sm2
ON sm1.user = sm2.user AND sm1.id <> sm2.id
WHERE sm1.serveur_id <> sm2.serveur_id
AND sm1.date BETWEEN strftime('YYYY-MM-DD HH:MM:SS.SSS', sm2.date, '-1 day') AND strftime('YYYY-MM-DD HH:MM:SS.SSS', sm2.date, '+1 day');

-- 17 - Récupérer la liste de joueur ayant des sanctions similaires sur différents serveur

--- Sans prise en compte de la date
SELECT sm1.user, sm1.duration, sm1.date, sm1.cmd, sm2.user, sm2.duration, sm2.date, sm2.cmd FROM sanction AS sm1
INNER JOIN sanction AS sm2 ON sm1.user = sm2.user AND sm1.id <> sm2.id AND sm1.serveur_id <> sm2.serveur_id
WHERE SUBSTR(sm1.cmd, 1, 5) = SUBSTR(sm2.cmd, 1, 5)
AND sm1.duration IS NULL OR sm1.duration BETWEEN sm2.duration*0.6 AND sm2.duration*1.4;

--- Avec prise en compte de la date (equivalence sur 2 semaines)
SELECT sm1.user, sm1.duration, sm1.date, sm1.cmd, sm2.user, sm2.duration, sm2.date, sm2.cmd FROM sanction AS sm1
INNER JOIN sanction AS sm2 ON sm1.user = sm2.user AND sm1.id <> sm2.id AND sm1.serveur_id <> sm2.serveur_id
WHERE SUBSTR(sm1.cmd, 1, 5) = SUBSTR(sm2.cmd, 1, 5)
AND sm1.duration IS NULL OR sm1.duration BETWEEN sm2.duration*0.6 AND sm2.duration*1.4
AND sm1.date BETWEEN strftime('YYYY-MM-DD HH:MM:SS.SSS', sm2.date, '-7 day') AND strftime('YYYY-MM-DD HH:MM:SS.SSS', sm2.date, '+7 day');


/* Autres requetes */

-- Récupérer la liste des commandes accessible par un moderateur
SELECT cmd.* FROM command_role AS cmd INNER JOIN role_moderateur AS rm ON rm.role_id = cmd.role_id WHERE uid_mod = 64;