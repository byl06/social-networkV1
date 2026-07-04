<?php
// api/auth/register.php - Inscription utilisateur

require_once '../config.php';

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
    
    // 🔥 Envoyer l'email de confirmation
    $confirm_link = "http://localhost/social-network/api/auth/verify_email.php?token=" . $token_verification;
    
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation d\'inscription</title>
        <style>
            body { font-family: Arial, sans-serif; background: #0a0a0f; color: #f0f0f8; margin: 0; padding: 0; }
            .container { max-width: 500px; margin: 50px auto; background: #12121a; border-radius: 16px; padding: 40px; border: 1px solid rgba(255,255,255,0.08); }
            .logo { text-align: center; font-size: 28px; font-weight: 700; color: #7c6fff; margin-bottom: 20px; }
            .title { font-size: 22px; font-weight: 700; text-align: center; margin-bottom: 16px; }
            .content { color: #8888aa; text-align: center; line-height: 1.6; margin-bottom: 30px; }
            .btn { display: inline-block; background: #7c6fff; color: white !important; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; }
            .btn:hover { background: #6b5cdb; }
            .footer { text-align: center; font-size: 12px; color: #555577; margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 20px; }
            .text-center { text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">🌊 SocialWave</div>
            <div class="title">Bienvenue sur SocialWave !</div>
            <div class="content">
                Bonjour <strong>' . htmlspecialchars($prenom) . '</strong>,<br><br>
                Merci de vous être inscrit sur SocialWave !<br>
                Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous.
            </div>
            <div class="text-center">
                <a href="' . $confirm_link . '" class="btn">Confirmer mon inscription</a>
            </div>
            <div class="content" style="font-size:12px; color:#555577; margin-top:20px;">
                Si vous n\'êtes pas à l\'origine de cette inscription, ignorez cet email.
            </div>
            <div class="footer">
                © 2026 SocialWave - Tous droits réservés
            </div>
        </div>
    </body>
    </html>
    ';
    
    mail($to, $subject, $message, $headers);
    
    jsonResponse([
        'success' => true,
        'message' => 'Inscription réussie ! Un email de confirmation vous a été envoyé.',
        'user_id' => $user_id,
        'debug_link' => $confirm_link // Pour le développement
    ], 201);
    
} catch(PDOException $e) {
    jsonResponse(['error' => 'Erreur lors de l\'inscription : ' . $e->getMessage()], 500);
}
?>