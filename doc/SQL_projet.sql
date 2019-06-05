--Requete :

-- 01 - Récupérer l’ensemble des serveurs Discord ayant invité le bot.
SELECT * FROM serveur;

-- 02 - Récupérer l’ensemble des grades liés à la modération d’un serveur Discord.
SELECT * FROM role_moderateur;

-- 03 - Mettre à jour le rôle d’un membre à grade lié à la modération.
UPDATE moderateur SET role_id = ? WHERE moderateur.id= ?;

-- 04 - Récupérer l’ensemble des modérateurs liés à un serveur Discord.
SELECT * FROM moderateur WHERE serveur_id = ?;

-- 05 - Appliquer une sanction à un utilisateur sur un serveur Discord.
INSERT INTO sanction_membre (reason, duration, user, author, cmd_id) VALUES
("sans raison", "0-0-3 12:00:00", 41771983423143937, 7877198353213996, 3);

-- 06 - Récupérer l’ensemble des sanctions appliquées sur un serveur Discord.
SELECT sm.* FROM sanction_membre AS sm INNER JOIN 

-- 07 - Récupérer la liste des joueurs dont les sanctions sont toujours actives sur un serveur Discord.

-- 08 - Récupérer la liste des joueurs étant connectés sur au moins deux serveurs Discords.

-- 09 - Récupérer les sanctions liées à un joueur, et leur nombre.

-- 10 - Récupérer la liste de sanctions infligées à un joueur par un modérateur.

-- 11 - Récupérer la liste de sanctions infligées par un modérateur et leur nombre.

-- 13 - Afficher la liste de sanctions infligées sur un serveur

-- 15 - Récupérer les joueurs ayant des sanctions sur plusieurs serveurs.

-- 16 - Récupérer la liste de joueur ayant des sanctions sur différents serveurs partageant une temporalité commune.

-- 17 - Récupér