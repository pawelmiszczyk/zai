<?php
require_once('databaseConfig.php');
session_start();

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
    if (isset($_POST['event_id'], $_POST['new_event_name'], $_POST['new_start_date'], $_POST['new_end_date'], $_POST['new_description'], $_POST['new_category_id'], $_POST['csrf_token'])) {
        $event_id = mysqli_real_escape_string($conn, $_POST['event_id']);
        $new_event_name = mysqli_real_escape_string($conn, $_POST['new_event_name']);
        $new_start_date = mysqli_real_escape_string($conn, $_POST['new_start_date']);
        $new_end_date = mysqli_real_escape_string($conn, $_POST['new_end_date']);
        $new_description = mysqli_real_escape_string($conn, $_POST['new_description']);
        $new_category_id = mysqli_real_escape_string($conn, $_POST['new_category_id']);

        // Obsługa przesłanego obrazka
		$new_image = $_FILES['new_image'];

		// TODO $imageData = file_get_contents($new_image['tmp_name']);
		// TODO $imageData = mysqli_real_escape_string($conn, $imageData);

		// Aktualizacja wydarzenia w tabeli events z nowym obrazkiem
		// TODO $update_query = "UPDATE events SET event_name = ?, start_date = ?, end_date = ?, description = ?, image_url = ?, category_id = ? WHERE event_id = ?";
		$update_query = "UPDATE events SET event_name = ?, start_date = ?, end_date = ?, description = ?, category_id = ? WHERE event_id = ?";
		$stmt = mysqli_prepare($conn, $update_query);

		if ($stmt) {
			// TODO mysqli_stmt_bind_param($stmt, "ssssbii", $new_event_name, $new_start_date, $new_end_date, $new_description, $imageData, $new_category_id, $event_id);
			mysqli_stmt_bind_param($stmt, "ssssii", $new_event_name, $new_start_date, $new_end_date, $new_description, $new_category_id, $event_id);

			if (mysqli_stmt_execute($stmt)) {
				header('Location: ../html/manageEvents.html?message=Wydarzenie%20został%20zaktualizowane.');
			} else {
				echo "Błąd podczas aktualizacji wydarzenia: " . mysqli_error($conn);
			}

			mysqli_stmt_close($stmt);
		} else {
			echo "Błąd przygotowywania zapytania: " . mysqli_error($conn);
		}
    } else {
        echo "Błąd CSRF. Żądanie odrzucone.";
    }
}

mysqli_close($conn);
?>
