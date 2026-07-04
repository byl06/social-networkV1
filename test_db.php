<?php
// test_db.php

echo "=== TEST CONNEXION DB ===\n";

try {
    $pdo = new PDO("mysql:host=127.0.0.1;dbname=socialwave_db;charset=utf8mb4", "root", "");
    echo "✅ Connexion réussie !\n";
    
    // Vérifier les tables
    $tables = $pdo->query("SHOW TABLES");
    echo "📊 Tables trouvées:\n";
    while ($row = $tables->fetch(PDO::FETCH_NUM)) {
        echo "  - " . $row[0] . "\n";
    }
} catch(PDOException $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}
?>