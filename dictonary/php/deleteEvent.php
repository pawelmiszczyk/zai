<?php
require_once('databaseConfig.php');
session_start();

// Uzyskaj dane dostępowe do bazy danych
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
    //if (isset($_POST['event_id'], $_POST['csrf_token']) && $_POST['csrf_token'] === $_SESSION['csrf_token']) {
        if (isset($_POST['event_id'], $_POST['csrf_token'])) {
			$event_id = mysqli_real_escape_string($conn, $_POST['event_id']);

        // Sprawdź, czy istnieje wydarzenie o podanym identyfikatorze
        $check_query = "SELECT * FROM events WHERE event_id = $event_id";
        $result = mysqli_query($conn, $check_query);

        if (mysqli_num_rows($result) > 0) {
            // Usuń wydarzenie z tabeli events
            $delete_query = "DELETE FROM events WHERE event_id = $event_id";

            if (mysqli_query($conn, $delete_query)) {
				header('Location: ../html/manageEvents.html?message=Wydarzenie zostało usunięte.');
            } else {
                echo "Błąd podczas usuwania wydarzenia: " . mysqli_error($conn);
            }
        } else {
			header('Location: ../html/manageEvents.html?message=Wydarzenie o podanym identyfikatorze nie istnieje.');
        }
    } else {
        echo "Błąd CSRF. Żądanie odrzucone.";
    }
}

mysqli_close($conn);
?>
