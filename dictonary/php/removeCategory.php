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
    if (isset($_POST['category_id'])) {
        $category_id = mysqli_real_escape_string($conn, $_POST['category_id']);

        // Sprawdź, czy istnieją powiązane wydarzenia
        $check_events_query = "SELECT * FROM events WHERE category = $category_id";
        $result = mysqli_query($conn, $check_events_query);

        if (mysqli_num_rows($result) > 0) {
            echo "Nie można usunąć kategorii, ponieważ istnieją powiązane wydarzenia.";
        } else {
            // Usuń kategorię z tabeli categories
            $delete_query = "DELETE FROM categories WHERE category_id = $category_id";

            if (mysqli_query($conn, $delete_query)) {
                echo "Kategoria została usunięta.";
            } else {
                echo "Błąd podczas usuwania kategorii: " . mysqli_error($conn);
            }
        }
    }
}

mysqli_close($conn);
?>
