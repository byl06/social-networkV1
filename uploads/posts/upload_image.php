<?php
// api/posts/upload_image.php - Uploader une image pour une publication

require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Méthode non autorisée'], 405);
}

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['error' => 'Non authentifié'], 401);
}

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    jsonResponse(['error' => 'Aucun fichier ou erreur d\'upload'], 400);
}

// Vérifier le type de fichier
$allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
if (!in_array($_FILES['image']['type'], $allowed)) {
    jsonResponse(['error' => 'Format non autorisé. Utilisez JPG, PNG, GIF ou WEBP'], 400);
}

// Vérifier la taille (max 5MB)
if ($_FILES['image']['size'] > 5 * 1024 * 1024) {
    jsonResponse(['error' => 'Fichier trop volumineux. Maximum 5MB'], 400);
}

$upload_dir = '../uploads/posts/';

if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

$extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
$filename = 'post_' . time() . '_' . bin2hex(random_bytes(8)) . '.' . $extension;
$target_path = $upload_dir . $filename;

if (move_uploaded_file($_FILES['image']['tmp_name'], $target_path)) {
    $db_path = 'uploads/posts/' . $filename;
    jsonResponse([
        'success' => true,
        'image_url' => $db_path,
        'message' => 'Image uploadée avec succès'
    ]);
} else {
    jsonResponse(['error' => 'Erreur lors de l\'upload'], 500);
}
?>