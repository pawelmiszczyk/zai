<?php
require_once('databaseConfig.php');

// Uzyskaj dane dostępowe
$database_config = getDatabaseConfig();

$host = $database_config['db_host'];
$username = $database_config['db_user'];
$password = $database_config['db_password'];
$database = $database_config['db_name'];

$conn = mysqli_connect($host, $username, $password, $database);

if (!$conn) {
    die("Błąd połączenia z bazą danych: " . mysqli_connect_error());
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['category_id']) && isset($_POST['category_name'])) {
        $category_id = mysqli_real_escape_string($conn, $_POST['category_id']);
        $category_name = mysqli_real_escape_string($conn, $_POST['category_name']);

        // Aktualizacja kategorii w tabeli categories
        $update_query = "UPDATE categories SET category_name = '$category_name' WHERE category_id = $category_id";

        if (mysqli_query($conn, $update_query)) {
            echo "Kategoria została zaktualizowana.";
        } else {
            echo "Błąd podczas aktualizacji kategorii: " . mysqli_error($conn);
        }
    }
}

mysqli_close($conn);
?>
