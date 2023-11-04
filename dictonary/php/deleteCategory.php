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
    if (isset($_POST['category_id'], $_POST['csrf_token'])) {
        $category_id = mysqli_real_escape_string($conn, $_POST['category_id']);

        // Sprawdzenie, czy kategoria o podanym ID istnieje
        $check_query = "SELECT category_id FROM categories WHERE category_id = $category_id";
        $result = mysqli_query($conn, $check_query);

        if (mysqli_num_rows($result) > 0) {
            // Kategoria istnieje, sprawdź, czy istnieją wydarzenia z tą kategorią
            $events_query = "SELECT event_id FROM events WHERE category_id = $category_id";
            $events_result = mysqli_query($conn, $events_query);

            if (mysqli_num_rows($events_result) > 0) {
				header('Location: ../html/manageCategories.html?message=Nie można usunąć kategorii, ponieważ istnieją wydarzenia z tą kategorią.');
            } else {
                // Brak wydarzeń z tą kategorią, można ją usunąć
                $delete_query = "DELETE FROM categories WHERE category_id = $category_id";

                if (mysqli_query($conn, $delete_query)) {
					header('Location: ../html/manageCategories.html?message=Kategoria została usunięta.');
                } else {
                    echo "Błąd podczas usuwania kategorii: " . mysqli_error($conn);
                }
            }
        } else {
			header('Location: ../html/manageCategories.html?message=Kategoria o podanym ID nie istnieje.');
        }
    } else {
        echo "Błąd CSRF. Żądanie odrzucone.";
    }
}

mysqli_close($conn);
?>
