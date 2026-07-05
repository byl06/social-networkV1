

# 📄 README.md - SocialWave


# 🌊 SocialWave - Réseau Social Web

## 📝 Description du projet

SocialWave est une application web de type réseau social développée dans le cadre du TP Examen Final. L'application s'inspire fortement du modèle Facebook et intègre toutes les fonctionnalités d'un réseau social moderne :

- Authentification complète (inscription, connexion, confirmation email, mot de passe oublié)
- Fil d'actualité avec publications, likes, commentaires
- Gestion des amis (invitations, acceptation, refus)
- Profil utilisateur personnalisable
- Messagerie instantanée (chat)
- Back Office avec rôles (Administrateur / Modérateur)

## 🛠️ Technologies utilisées

| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| HTML5 | - | Structure des pages |
| CSS3 | - | Design et mise en page |
| JavaScript (Vanilla) | ES6+ | Interactions côté client |
| PHP | 8.x | API RESTful |
| MySQL | 5.7+ | Base de données |
| AJAX (Fetch API) | - | Communications asynchrones |

## 🚀 Mode de fonctionnement

### Prérequis

- XAMPP / WAMP / MAMP (Apache + MySQL + PHP)
- Navigateur web moderne (Chrome, Firefox, Edge)

### Installation

1. Cloner le dépôt
   
   git clone https://github.com/votre-utilisateur/social-network.git
   

2. Copier le projet dans le dossier htdocs**
   
   cp -r social-network C:\xampp\htdocs\
   

3. Démarrer XAMPP**
   - Apache : Start
   - MySQL : Start

4. Créer la base de données**
   - Accéder à phpMyAdmin : `http://localhost/phpmyadmin`
   - Créer une base `socialwave_db`
   - Importer le fichier `database/social_network.sql`

5. Configurer la connexion à la base**
   - Modifier `api/config.php` si nécessaire
   - Par défaut : utilisateur `root`, mot de passe vide

6. Accéder à l'application**
   
   http://localhost/social-network/index.html
   


## 🔐 Identifiants de test

| Rôle                | Email                 | Mot de passe |
|---------------------|-----------------------|--------------|
| **Administrateur**  | byl@gmail.com         | Password12    |
| **Modérateur**      | bylgaitb@gmail.com    | Password123  |
| **Utilisateur**     | billie096@gmail.com   | password111  |

## 📋 Fonctionnalités implémentées

### Module Authentification
- ✅ Inscription avec confirmation email (HTML)
- ✅ Connexion avec session
- ✅ Mot de passe oublié avec email HTML
- ✅ Déconnexion

### Fil d'actualité
- ✅ Publication de contenu (texte + image)
- ✅ Affichage des publications
- ✅ Système de likes/dislikes
- ✅ Commentaires en AJAX (sans rechargement)

### Gestion des amis
- ✅ Affichage des utilisateurs
- ✅ Envoi d'invitations
- ✅ Acceptation / Refus des invitations
- ✅ Consultation des profils

### Profil utilisateur
- ✅ Modification des informations personnelles
- ✅ Changement de photo de profil
- ✅ Changement de mot de passe

### Chat
- ✅ Liste des conversations
- ✅ Envoi de messages textuels
- ✅ Auto-refresh toutes les 3 secondes
- ✅ Messages non lus avec badge

### Back Office
- ✅ Connexion distincte (admin/modo)
- ✅ Dashboard avec statistiques
- ✅ Gestion des utilisateurs (consultation, suppression)
- ✅ Gestion des rôles (admin uniquement)
- ✅ Gestion des publications

## 👥 Membres du groupe
|Membres             |  Rôles               | Partie concernés                    |
|--------------------|----------------------|-------------------------------------|
|BACHIROU  Bylgait   |  BACKEND & Frontend  | gestion de Auth & Post Design UI/UX | 
|SAVINGNONOUGBO Marc |  BACKEND & Frontend  | gestion de Chat & Friends           |  
|DJOSSOU Thomas      |  BACKEND & Frontend  | gestion de Comment & Porfile        | 
|BABADOUNDE Billie   |  BACKEND & Frontend  | gestion de Notification & test      |

## Problème rencontrée

Pour la réalisation du projet nous étions confronté a un manques d'équipement . Pour 04 étudiants nous n'avons que 2 PC , et le fait que nos amis également étais dans la même condition que nous dans la realisation du projet, nous étions de nous contenté des 02 PC, ce qui ne nous as permis de réalisation la partie github du projet . 
Raison pour laquelle nous étions obligé de notifié la participation de chacun dans le README.

Veuillez sincerement nous excuser.

## Comment sommes nous organisés?
Avec les deux PC, chaques jours nous nous reunissons pour travaillez sur le projet et chaque membre s'occupent de faire sa partie au jours le jours.

## 🎯 Exigences techniques respectées

- ✅ Aucun rechargement de page après chargement initial (AJAX)
- ✅ Gestion des sessions avec `sessionStorage`
- ✅ Emails au format HTML bien conçus
- ✅ Code structuré, commenté et sécurisé
- ✅ Architecture MVC simplifiée

---

**© 2026 SocialWave - Projet réalisé dans le cadre du TP Examen Final**


