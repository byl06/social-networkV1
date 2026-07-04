<?php
// api/auth/verify_email.php - Confirmer l'email

require_once '../config.php';

$token = isset($_GET['token']) ? $_GET['token'] : '';

if (empty($token)) {
    die('Token manquant');
}

// Vérifier le token
$stmt = $pdo->prepare("SELECT id_user, email FROM users WHERE token_verification = ? AND email_verifie = 0");
$stmt->execute([$token]);
$user = $stmt->fetch();

if (!$user) {
    die('Token invalide ou déjà utilisé');
}

// Mettre à jour l'utilisateur
$stmt = $pdo->prepare("UPDATE users SET email_verifie = 1, token_verification = NULL WHERE id_user = ?");
$stmt->execute([$user['id_user']]);

// Rediriger vers la page de connexion avec un message
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Email confirmé - SocialWave</title>
    <style>
        body { font-family: Arial, sans-serif; background: #0a0a0f; color: #f0f0f8; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .container { text-align: center; background: #12121a; padding: 40px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); max-width: 400px; }
        .icon { font-size: 64px; margin-bottom: 20px; }
        .title { font-size: 24px; font-weight: 700; margin-bottom: 10px; color: #10d98c; }
        .subtitle { color: #8888aa; margin-bottom: 20px; }
        .btn { display: inline-block; background: #7c6fff; color: white; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">✅</div>
        <div class="title">Email confirmé !</div>
        <div class="subtitle">
            Votre adresse email a été vérifiée avec succès.<br>
            Vous pouvez maintenant vous connecter à SocialWave.
        </div>
        <a href="../../index.html" class="btn">Se connecter</a>
    </div>
</body>
</html>
<?php
exit();
?>