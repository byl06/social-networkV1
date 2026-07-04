

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
   

### Architecture du projet


social-network/
│
├── index.html                 # Point d'entrée de l'application
│
├── assets/
│   ├── css/
│   │   └── style.css         # Styles globaux
│   └── js/
│       └── app.js            # Logique frontend
│
├── api/                       # API RESTful
│   ├── config.php            # Configuration (DB, session)
│   ├── auth/                 # Authentification
│   │   ├── register.php
│   │   ├── login.php
│   │   ├── logout.php
│   │   ├── check.php
│   │   ├── forgot_password.php
│   │   ├── reset_password.php
│   │   └── verify_email.php
│   ├── posts/                # Publications
│   │   ├── get_posts.php
│   │   ├── create_post.php
│   │   ├── like_post.php
│   │   └── upload_image.php
│   ├── comments/             # Commentaires
│   │   ├── add_comment.php
│   │   └── get_comments.php
│   ├── friends/              # Amis
│   │   ├── get_users.php
│   │   ├── send_request.php
│   │   ├── get_requests.php
│   │   ├── accept_request.php
│   │   ├── refuse_request.php
│   │   ├── get_friends.php
│   │   └── search_users.php
│   ├── profile/              # Profil
│   │   ├── get_profile.php
│   │   ├── update_profile.php
│   │   ├── update_password.php
│   │   ├── upload_avatar.php
│   │   └── get_stats.php
│   ├── chat/                 # Messagerie
│   │   ├── get_conversations.php
│   │   ├── get_messages.php
│   │   ├── send_message.php
│   │   └── create_conversation.php
│   ├── admin/                # Administration
│   │   ├── check_admin.php
│   │   ├── get_stats.php
│   │   ├── get_users.php
│   │   ├── update_user_role.php
│   │   ├── delete_user.php
│   │   ├── get_posts.php
│   │   └── delete_post.php
│   └── notifications/        # Notifications
│       └── get_notifications.php
│
├── vues/
│   ├── clients/
│   │   ├── confirm.html      # Page de confirmation email
│   │   ├── loading.html      # Écran de chargement
│   │   ├── success.html      # Succès confirmation
│   │   └── reset_password.html
│   └── back-office/
│       └── (intégré dans index.html)
│
├── uploads/                   # Fichiers uploadés
│   ├── profiles/             # Photos de profil
│   └── posts/                # Images des publications
│
├── database/
│   └── social_network.sql    # Script SQL
│
├── .gitignore
└── README.md


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


BACHIROU  Bylgait | Développeur Backend / Database |
SAVINGNONOUGBO Marc & DJOSSOU Thomas Développeur Frontend |
BABADOUNDE Billie Intégrateur / UI Designer  & |



## 🎯 Exigences techniques respectées

- ✅ Aucun rechargement de page après chargement initial (AJAX)
- ✅ Gestion des sessions avec `sessionStorage`
- ✅ Emails au format HTML bien conçus
- ✅ Code structuré, commenté et sécurisé
- ✅ Architecture MVC simplifiée

---

**© 2026 SocialWave - Projet réalisé dans le cadre du TP Examen Final**


