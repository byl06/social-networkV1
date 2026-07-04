<?php
// api/auth/register.php - Inscription utilisateur

require_once '../config.php';

// Désactiver l'affichage des erreurs
error_reporting(0);
ini_set('display_errors', 0);
ob_clean();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Méthode non autorisée'], 405);
}

$data = json_decode(file_get_contents('php://input'), true);

// Valider les champs requis
$required = ['nom', 'prenom', 'email', 'mot_de_passe', 'confirm_mot_de_passe'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        jsonResponse(['error' => "Le champ $field est requis"], 400);
    }
}

$nom = trim(htmlspecialchars($data['nom']));
$prenom = trim(htmlspecialchars($data['prenom']));
$email = trim(filter_var($data['email'], FILTER_SANITIZE_EMAIL));
$mot_de_passe = $data['mot_de_passe'];
$confirm = $data['confirm_mot_de_passe'];

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['error' => 'Email invalide'], 400);
}

if ($mot_de_passe !== $confirm) {
    jsonResponse(['error' => 'Les mots de passe ne correspondent pas'], 400);
}

if (strlen($mot_de_passe) < 6) {
    jsonResponse(['error' => 'Le mot de passe doit contenir au moins 6 caractères'], 400);
}

// Vérifier si l'email existe déjà
$stmt = $pdo->prepare("SELECT id_user FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    jsonResponse(['error' => 'Cet email est déjà utilisé'], 409);
}

// Hasher le mot de passe
$hashed_password = password_hash($mot_de_passe, PASSWORD_DEFAULT);

// Générer un token de vérification
$token_verification = bin2hex(random_bytes(32));
$bio = "Nouveau membre de SocialWave !";

// Insérer l'utilisateur
$sql = "INSERT INTO users (nom, prenom, email, mot_de_passe, token_verification, bio, email_verifie) 
        VALUES (?, ?, ?, ?, ?, ?, 0)";
$stmt = $pdo->prepare($sql);

try {
    $stmt->execute([$nom, $prenom, $email, $hashed_password, $token_verification, $bio]);
    $user_id = $pdo->lastInsertId();
    
    // Lien de confirmation
    $confirm_link = "http://localhost/social-network/api/auth/verify_email.php?token=" . $token_verification;
    
    // Envoyer l'email
    $to = $email;
    $subject = "Confirmez votre inscription - SocialWave";
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: SocialWave <no-reply@socialwave.com>" . "\r\n";
    
    $message = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Confirmation SocialWave</title>
        <style>
            body { font-family: Arial; background: #0a0a0f; color: #f0f0f8; margin: 0; padding: 0; }
            .container { max-width: 500px; margin: 50px auto; background: #12121a; border-radius: 16px; padding: 40px; border: 1px solid rgba(255,255,255,0.08); text-align: center; }
            .logo { font-size: 28px; font-weight: 700; color: #7c6fff; margin-bottom: 20px; }
            .title { font-size: 22px; font-weight: 700; margin-bottom: 16px; }
            .content { color: #8888aa; line-height: 1.6; margin-bottom: 30px; }
            .btn { display: inline-block; background: #7c6fff; color: white; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 600; }
            .footer { font-size: 12px; color: #555577; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.06); }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">🌊 SocialWave</div>
            <div class="title">Bienvenue ' . htmlspecialchars($prenom) . ' !</div>
            <div class="content">
                Merci de vous être inscrit sur SocialWave !<br>
                Cliquez sur le bouton ci-dessous pour activer votre compte.
            </div>
            <a href="' . $confirm_link . '" class="btn">Confirmer mon inscription</a>
            <div class="footer">© 2026 SocialWave</div>
        </div>
    </body>
    </html>
    ';
    
    // Envoyer l'email
    mail($to, $subject, $message, $headers);
    
    // Réponse JSON (sans debug_link pour éviter les erreurs)
    echo json_encode([
        'success' => true,
        'message' => 'Inscription réussie ! Un email de confirmation vous a été envoyé.',
        'user_id' => $user_id
    ]);
    exit();
    
} catch(PDOException $e) {
    echo json_encode(['error' => 'Erreur lors de l\'inscription'], 500);
    exit();
}
?>