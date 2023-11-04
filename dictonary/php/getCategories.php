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

// Zapytanie SQL do pobrania wszystkich kategorii
$sql = "SELECT * FROM categories";
$result = mysqli_query($conn, $sql);

$categoriesData = array();

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $categoriesData[] = $row;
    }
}

// Zamknięcie połączenia z bazą danych
mysqli_close($conn);

// Ustawienie nagłówka Content-Type na JSON
header('Content-Type: application/json');

// Zwróć wyniki jako JSON
echo json_encode($categoriesData);
?>
