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
    if (isset($_POST['category_name'], $_POST['category_color'], $_POST['csrf_token']) && $_POST['csrf_token'] === $_SESSION['csrf_token']) {
		$category_name = mysqli_real_escape_string($conn, $_POST['category_name']);
        $category_color = $_POST['category_color'];

        // Sprawdzenie, czy taka kategoria już istnieje
        $check_query = "SELECT category_id FROM categories WHERE category_name = '$category_name'";
        $result = mysqli_query($conn, $check_query);

        if (mysqli_num_rows($result) > 0) {
            echo "Taka kategoria już istnieje.";
			header('Location: ../html/manageCategories.html?message=Taka%20kategoria%20już%20istnieje.');
        } else {
            // Kategoria nie istnieje, można ją dodać
            $insert_query = "INSERT INTO categories (category_name, category_color) VALUES ('$category_name', '$category_color')";

            if (mysqli_query($conn, $insert_query)) {
				header('Location: ../html/manageCategories.html?message=Kategoria%20została%20dodana.');
            } else {
                echo "Błąd podczas dodawania kategorii: " . mysqli_error($conn);
            }
        }
    } else {
        echo "Błąd CSRF. Żądanie odrzucone.";
    }
}

mysqli_close($conn);
?>
