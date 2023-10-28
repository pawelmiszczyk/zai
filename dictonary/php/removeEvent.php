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
    if (isset($_POST['event_id'])) {
        $event_id = mysqli_real_escape_string($conn, $_POST['event_id']);

        // Usunięcie wydarzenia z tabeli events
        $delete_query = "DELETE FROM events WHERE event_id = $event_id";

        if (mysqli_query($conn, $delete_query)) {
            echo "Wydarzenie zostało usunięte.";
        } else {
            echo "Błąd podczas usuwania wydarzenia: " . mysqli_error($conn);
        }
    }
}

mysqli_close($conn);
?>
