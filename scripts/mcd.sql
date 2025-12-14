-- Active: 1747692028292@@mysql-ychnightder.alwaysdata.net@3306@ychnightder_bloomfund
CREATE TABLE utilisateur (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(355) NOT NULL,
    role VARCHAR(30) NOT NULL,
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (role IN ('citoyen', 'porteur_projet', 'admin'))
);


CREATE TABLE categorie (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description TEXT
);


CREATE TABLE projet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    objectif_financier DECIMAL(10,2) NOT NULL,
    montant_collecte DECIMAL(10,2) DEFAULT 0,
    localisation VARCHAR(150),
    statut VARCHAR(30) DEFAULT 'publie',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_fin DATE,
    porteur_id INT NOT NULL,
    categorie_id INT,
    FOREIGN KEY (porteur_id) REFERENCES utilisateur(id) ON DELETE CASCADE,
    FOREIGN KEY (categorie_id) REFERENCES categorie(id) ON DELETE CASCADE
);


CREATE TABLE commentaire (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contenu TEXT NOT NULL,
    date_commentaire TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    utilisateur_id INT NOT NULL,
    projet_id INT NOT NULL,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id) ON DELETE CASCADE,
    FOREIGN KEY (projet_id) REFERENCES projet(id) ON DELETE CASCADE
);



CREATE TABLE contribution (
    id INT AUTO_INCREMENT PRIMARY KEY,
    montant DECIMAL(10,2) NOT NULL,
    date_contribution TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    utilisateur_id INT NOT NULL,
    projet_id INT NOT NULL,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id) ON DELETE CASCADE,
    FOREIGN KEY (projet_id) REFERENCES projet(id) ON DELETE CASCADE
);
