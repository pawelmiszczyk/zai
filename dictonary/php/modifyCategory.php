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
    //if (isset($_POST['category_id'], $_POST['category_name'], $_POST['new_category_color'], $_POST['csrf_token']) && $_POST['csrf_token'] === $_SESSION['csrf_token']) {
    if (isset($_POST['category_id'], $_POST['new_category_name'], $_POST['new_category_color'], $_POST['csrf_token'])) {
		$category_id = mysqli_real_escape_string($conn, $_POST['category_id']);
        $new_category_name = mysqli_real_escape_string($conn, $_POST['new_category_name']);
        $new_category_color = $_POST['new_category_color'];

        // Aktualizacja kategorii w tabeli categories
        $update_query = "UPDATE categories SET category_name = '$new_category_name', category_color = '$new_category_color' WHERE category_id = $category_id";

        if (mysqli_query($conn, $update_query)) {
			header('Location: ../html/manageCategories.html?message=Kategoria%20została%20zaktualizowana.');

        } else {
            echo "Błąd podczas aktualizacji kategorii: " . mysqli_error($conn);
        }
    } else {
        echo "Błąd CSRF. Żądanie odrzucone.";
		header('Location: ../html/manageCategories.html?message=Błąd%20CSRF.%20Żądanie%20odrzucone.');
    }
}

mysqli_close($conn);
?>
