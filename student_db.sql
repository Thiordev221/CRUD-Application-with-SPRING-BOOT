-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 21 nov. 2025 à 11:52
-- Version du serveur : 10.4.20-MariaDB
-- Version de PHP : 8.0.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `student_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `etudiant`
--

CREATE TABLE `etudiant` (
  `id` bigint(20) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `etudiant`
--

INSERT INTO `etudiant` (`id`, `nom`, `prenom`, `email`) VALUES
(1, 'Faye', 'Mamadou', 'mamadou@gmail.com'),
(2, 'ibrahima', 'Bâ', 'Baibrahima@gmail.com'),
(3, 'thior', 'abdoulaye', 'thiorinho@gmail.com'),
(4, 'Fall', 'Issa', 'ISSA@gmail.com'),
(5, 'Thior', 'Cheikh Mooussa', 'Moussa@gmail.com');

-- --------------------------------------------------------

--
-- Structure de la table `formation`
--

CREATE TABLE `formation` (
  `id` bigint(20) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `formateur` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `formation`
--

INSERT INTO `formation` (`id`, `titre`, `description`, `formateur`) VALUES
(2, 'JAVASCRIPT', 'C\'est une formation dans laquelle on apprend l\'élève le monde du developpement web en partant de la conception, la programmation, au déploiement et à la maintenance de l\'application.', 'M. Diassé');

-- --------------------------------------------------------

--
-- Structure de la table `inscription`
--

CREATE TABLE `inscription` (
  `id` bigint(20) NOT NULL,
  `prix` int(6) NOT NULL,
  `etudiant_id` bigint(20) NOT NULL,
  `formation_id` bigint(20) NOT NULL,
  `statut` varchar(255) DEFAULT NULL,
  `date_inscription` date DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `inscription`
--

INSERT INTO `inscription` (`id`, `prix`, `etudiant_id`, `formation_id`, `statut`, `date_inscription`) VALUES
(9, 250000, 2, 2, 'EN_COURS', '2025-11-11'),
(10, 100000, 2, 2, 'EN_COURS', '2025-11-20');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `etudiant`
--
ALTER TABLE `etudiant`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `formation`
--
ALTER TABLE `formation`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `inscription`
--
ALTER TABLE `inscription`
  ADD PRIMARY KEY (`id`),
  ADD KEY `etudiant_id` (`etudiant_id`),
  ADD KEY `formation_id` (`formation_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `etudiant`
--
ALTER TABLE `etudiant`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `formation`
--
ALTER TABLE `formation`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `inscription`
--
ALTER TABLE `inscription`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `inscription`
--
ALTER TABLE `inscription`
  ADD CONSTRAINT `inscription_ibfk_1` FOREIGN KEY (`etudiant_id`) REFERENCES `etudiant` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inscription_ibfk_2` FOREIGN KEY (`formation_id`) REFERENCES `formation` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
