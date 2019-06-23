SET search_path TO bot_moderation; -- use schema

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
('!ban @<user> <reason:text> -d <duration: time(sec)<3600> -c <channel: IN (chan1,chan2,*general)>', '^!ban[ ]+<@\!?([0-9]+)>[ ]+((?:(?!-d|-c).)+)(-d[ ]+(3600|3[0-5][0-9]{2}|[0-2][0-9]{3}|[0-9]{0,3}))?([ ]*-c[ ]+(?:(15|56|98| ))+)?[ ]*$', 1),
('!mute @<user> <reason:text> -d <duration: time(sec)>60> -c <channel: NOT IN (.text)>', '^!ban[ ]+<@\!?([0-9]+)>[ ]+((?:(?!-d|-c).)+)(-d[ ]+(3[6-9][0-9]{2}|[0-9]{4,}))?([ ]*-c[ ]+(?:<#(?!15|56|98)[0-9]+>[ ]*)+)?[ ]*$', 1); -- CHECK si le regex pour les channels est bon (NOT IN <#15> <#56> <#98>)

INSERT INTO sanction (reason, duration, channels, victim, author, serveur_id, cmd) VALUES
('Troll', NULL, '.*audio', 85, 35, 1, '!ban <@85> reason'),
('Troll', NULL, '.*texte', 85, 42, 2, '!ban <@85> other reason'),
('Annoyed me', 86400, NULL, 15, 64, 2, '!mute <@user3> Annoyed me -d 86400'),
('Test', 3600, NULL, 13, 64, 1, '!mute <@user1> Test -d 3600');

INSERT INTO role_cmd VALUES
(4,1),
(2,2),
(1,4),
(3,19),
(2,20);
