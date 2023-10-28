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
// Zapytanie SQL do pobrania wszystkich wydarzeń
$sql = "SELECT * FROM events ev INNER JOIN categories cat ON (ev.category_id = cat.category_id)";
$result = $conn->query($sql);

$eventsData = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Konwertuj dane binarne obrazu na dane w formacie Base64
        $imageData = base64_encode($row['image_url']);
        $row['image_url'] = $imageData;
        $eventsData[] = $row;
    }
}

// Zamknięcie połączenia z bazą danych

// Ustawienie nagłówka Content-Type na JSON
header('Content-Type: application/json');

// Zwróć wyniki jako JSON
echo json_encode($eventsData);
?>
