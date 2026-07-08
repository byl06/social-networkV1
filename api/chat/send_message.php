<?php
// api/chat/send_message.php - Envoyer un message (texte ou image)

require_once '../config.php';

// Désactiver l'affichage des erreurs
error_reporting(0);
ini_set('display_errors', 0);
ob_clean();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Méthode non autorisée'], 405);
}

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['error' => 'Non authentifié'], 401);
}

$data = json_decode(file_get_contents('php://input'), true);
$user_id = $_SESSION['user_id'];

// Vérifier les paramètres
if (empty($data['conversation_id']) && empty($data['receiver_id'])) {
    jsonResponse(['error' => 'conversation_id ou receiver_id requis'], 400);
}

if (empty($data['contenu']) && empty($data['image'])) {
    jsonResponse(['error' => 'Message ou image requis'], 400);
}

$contenu = isset($data['contenu']) ? trim(htmlspecialchars($data['contenu'])) : null;
$image = $data['image'] ?? null;

// Si pas de conversation_id, en créer une nouvelle
if (empty($data['conversation_id'])) {
    $receiver_id = intval($data['receiver_id']);
    
    // Vérifier que l'utilisateur existe
    $checkUser = $pdo->prepare("SELECT id_user FROM users WHERE id_user = ? AND statut = 'actif'");
    $checkUser->execute([$receiver_id]);
    if (!$checkUser->fetch()) {
        jsonResponse(['error' => 'Utilisateur introuvable'], 404);
    }
    
    // Vérifier que les deux sont amis
    $checkFriend = $pdo->prepare("SELECT id_friend FROM friends WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)");
    $checkFriend->execute([$user_id, $receiver_id, $receiver_id, $user_id]);
    if (!$checkFriend->fetch()) {
        jsonResponse(['error' => 'Vous devez être amis pour discuter'], 403);
    }
    
    // Créer une nouvelle conversation
    $pdo->beginTransaction();
    
    $createConv = $pdo->prepare("INSERT INTO conversations () VALUES ()");
    $createConv->execute();
    $conversation_id = $pdo->lastInsertId();
    
    // Ajouter les participants
    $addParticipant = $pdo->prepare("INSERT INTO conversation_participants (id_conversation, id_user) VALUES (?, ?)");
    $addParticipant->execute([$conversation_id, $user_id]);
    $addParticipant->execute([$conversation_id, $receiver_id]);
    
    $pdo->commit();
}

$conversation_id = $data['conversation_id'] ?? $conversation_id;

// Insérer le message
$sql = "INSERT INTO messages (id_conversation, id_sender, contenu, image, date_envoi) VALUES (?, ?, ?, ?, NOW())";
$stmt = $pdo->prepare($sql);
$stmt->execute([$conversation_id, $user_id, $contenu, $image]);
$message_id = $pdo->lastInsertId();

// Récupérer le message créé avec les infos de l'utilisateur
$sql2 = "SELECT m.*, u.prenom, u.nom, u.photo_profil
         FROM messages m
         JOIN users u ON m.id_sender = u.id_user
         WHERE m.id_message = ?";
$stmt2 = $pdo->prepare($sql2);
$stmt2->execute([$message_id]);
$message = $stmt2->fetch();

if (!$message) {
    jsonResponse(['error' => 'Erreur lors de la récupération du message'], 500);
}

// Formater la date
$message['date_envoi_formatted'] = date('H:i', strtotime($message['date_envoi']));

jsonResponse([
    'success' => true,
    'message' => 'Message envoyé avec succès',
    'data' => $message,
    'conversation_id' => $conversation_id
], 201);
?>