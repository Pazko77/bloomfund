CREATE TRIGGER porteur_update
    AFTER INSERT ON `Projets`
    FOR EACH ROW
BEGIN
    UPDATE `Utilisateurs` 
    SET `role` = 'porteur_projet' 
    WHERE `id` = NEW.id AND `role` = 'citoyen';
END;