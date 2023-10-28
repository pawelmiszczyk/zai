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
    if (isset($_POST['category_name'])) {
        $category_name = mysqli_real_escape_string($conn, $_POST['category_name']);

        // Dodawanie kategorii do tabeli categories
        $insert_query = "INSERT INTO categories (category_name) VALUES ('$category_name')";

        if (mysqli_query($conn, $insert_query)) {
            echo "Kategoria została dodana.";
        } else {
            echo "Błąd podczas dodawania kategorii: " . mysqli_error($conn);
        }
    }
}

mysqli_close($conn);
?>
