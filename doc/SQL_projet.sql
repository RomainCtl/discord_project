--Requete : (SQLITE3)

-- 01 - Récupérer l’ensemble des serveurs Discord ayant invité le bot.
SELECT * FROM serveur;

-- 02 - Récupérer l’ensemble des grades liés à la modération d’un serveur Discord.
SELECT * FROM role_moderateur;

-- 03 - Mettre à jour le rôle d’un membre à grade lié à la modération.
UPDATE moderateur SET role_id = 1 WHERE moderateur.uid= 41771983423143937;

-- 04 - Récupérer l’ensemble des modérateurs liés à un serveur Discord.
SELECT * FROM moderateur WHERE serveur_id = ?;

-- 05 - Appliquer une sanction à un utilisateur sur un serveur Discord.
INSERT INTO sanction (reason, duration, user, author, cmd_id, serveur_id) VALUES
("sans raison", "0-0-3 12:00:00", 41771983423143937, 7877198353213996, 3, 1);

-- 06 - Récupérer l’ensemble des sanctions appliquées sur un serveur Discord.
SELECT sm.* FROM sanction AS sm INNER JOIN serveur ON serveur.id = serveur_id WHERE serveur_id = 1;

-- 07 - Récupérer la liste des joueurs dont les sanctions sont toujours actives sur un serveur Discord.
SELECT sm.user FROM sanction AS sm INNER JOIN serveur ON serveur.id = serveur_id WHERE serveur_id = 1 AND duration <> NULL OR strftime('%s',duration) + strftime('%s', date) < strftime('%s', 'now');

-- 09 - Récupérer les sanctions liées à un joueur, et leur nombre.
SELECT * FROM sanction WHERE user = 41771983423143937;
SELECT COUNT(*) FROM sanction WHERE user = 41771983423143937 GROUP BY user;

-- 10 - Récupérer la liste de sanctions infligées à un joueur par un modérateur.
SELECT * FROM sanction WHERE user = 41771983423143937 and author = 12771983423143989;

-- 11 - Récupérer la liste de sanctions infligées par un modérateur et leur nombre.
SELECT * FROM sanction WHERE author = 12771983423143989;
SELECT COUNT(*) FROM sanction WHERE author = 12771983423143989 GROUP BY author;

-- 13 - Afficher la liste de sanctions infligées sur un serveur
-- C'est la meme que la 6 ? (ou le type de sanction ?)

-- 15 - Récupérer les joueurs ayant des sanctions sur plusieurs serveurs.
SELECT user FROM sanction WHERE COUNT(serveur_id) > 1 GROUP BY user;

-- 16 - Récupérer la liste de joueur ayant des sanctions sur différents serveurs partageant une temporalité commune.
SELECT DISTINCT sm1.user FROM sanction AS sm1
INNER JOIN sanction AS sm2
ON sm1.user = sm2.user AND sm1.id <> sm2.id
WHERE sm1.serveur_id <> sm2.serveur_id
AND sm1.date BETWEEN strftime('YYYY-MM-DD HH:MM:SS.SSS', sm2.date) AND strftime('YYYY-MM-DD HH:MM:SS.SSS', sm2.date);

-- 17 - Récupérer la liste de joueur ayant des sanctions similaires sur différents serveur
SELECT DISTINCT sm1.user FROM sanction AS sm1
INNER JOIN sanction AS sm2 ON sm1.user = sm2.user AND sm1.id <> sm2.id