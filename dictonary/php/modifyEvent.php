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
    if (isset($_POST['event_id']) && isset($_POST['event_name']) && isset($_POST['start_date']) && isset($_POST['end_date']) && isset($_POST['description']) && isset($_POST['category'])) {
        $event_id = mysqli_real_escape_string($conn, $_POST['event_id']);
        $event_name = mysqli_real_escape_string($conn, $_POST['event_name']);
        $start_date = mysqli_real_escape_string($conn, $_POST['start_date']);
        $end_date = mysqli_real_escape_string($conn, $_POST['end_date']);
        $description = mysqli_real_escape_string($conn, $_POST['description']);
        $category = mysqli_real_escape_string($conn, $_POST['category']);

        // Modyfikacja wydarzenia w tabeli events
        $update_query = "UPDATE events SET event_name = '$event_name', start_date = '$start_date', end_date = '$end_date', description = '$description', category = '$category' WHERE event_id = $event_id";

        if (mysqli_query($conn, $update_query)) {
            echo "Wydarzenie zostało zaktualizowane.";
        } else {
            echo "Błąd podczas aktualizacji wydarzenia: " . mysqli_error($conn);
        }
    }
}

mysqli_close($conn);
?>
