<?php
require_once('databaseConfig.php');
session_start();

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
    if (isset($_POST['event_name'], $_POST['start_date'], $_POST['end_date'], $_POST['description'], $_POST['category_id'], $_FILES['image'], $_POST['csrf_token'])) {
		if ($_POST['csrf_token'] === $_SESSION['csrf_token']) {
			$event_name = mysqli_real_escape_string($conn, $_POST['event_name']);
			$start_date = mysqli_real_escape_string($conn, $_POST['start_date']);
			$end_date = mysqli_real_escape_string($conn, $_POST['end_date']);
			$description = mysqli_real_escape_string($conn, $_POST['description']);
			$category_id = mysqli_real_escape_string($conn, $_POST['category_id']);

			$image = $_FILES['image'];
			$imageData = file_get_contents($image['tmp_name']);
			$imageData = mysqli_real_escape_string($conn, $imageData);

			$insert_query = "INSERT INTO events (event_name, start_date, end_date, description, image_url, category_id) VALUES (?, ?, ?, ?, ?, ?)";
			$stmt = mysqli_prepare($conn, $insert_query);

			if ($stmt) {
				mysqli_stmt_bind_param($stmt, "sssssi", $event_name, $start_date, $end_date, $description, $imageData, $category_id);

				if (mysqli_stmt_execute($stmt)) {
					header('Location: ../html/manageEvents.html?message=Wydarzenie%20zostało%20dodane.');
					exit;
				} else {
					echo "Błąd podczas dodawania wydarzenia: " . mysqli_error($conn);
				}

				mysqli_stmt_close($stmt);
			} else {
				echo "Błąd przygotowywania zapytania: " . mysqli_error($conn);
			}
		} else {
			echo "Błąd CSRF. Żądanie odrzucone.";
		}
    } else {
        echo "Brak wymaganych parametrów sesji.";
    }
}


mysqli_close($conn);
?>
