<?php
require_once('database_config.php');

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
    if (isset($_POST['event_name']) && isset($_POST['start_date']) && isset($_POST['end_date']) && isset($_POST['description']) && isset($_POST['category'])) {
        $event_name = mysqli_real_escape_string($conn, $_POST['event_name']);
        $start_date = mysqli_real_escape_string($conn, $_POST['start_date']);
        $end_date = mysqli_real_escape_string($conn, $_POST['end_date']);
        $description = mysqli_real_escape_string($conn, $_POST['description']);
        $category = mysqli_real_escape_string($conn, $_POST['category']);

        // Dodawanie wydarzenia do tabeli events
        $insert_query = "INSERT INTO events (event_name, start_date, end_date, description, category) VALUES ('$event_name', '$start_date', '$end_date', '$description', '$category')";

        if (mysqli_query($conn, $insert_query)) {
            echo "Wydarzenie zostało dodane.";
        } else {
            echo "Błąd podczas dodawania wydarzenia: " . mysqli_error($conn);
        }
    }
}

mysqli_close($conn);
?>
