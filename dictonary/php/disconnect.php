<?php
require_once('databaseConfig.php');
session_start(); // Rozpocznij sesję

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

// Sprawdzenie, czy użytkownik jest zalogowany
if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    // Usunięcie sesji z tabeli user_sessions
    $delete_session_query = "DELETE FROM user_sessions WHERE user_id = $user_id";
    if (mysqli_query($conn, $delete_session_query)) {
        echo "Sesja została zakończona.";
    } else {
        echo "Błąd podczas usuwania sesji: " . mysqli_error($conn);
    }

    // Zakończenie sesji
    session_unset();  // Usunięcie wszystkich zmiennych sesji
    session_destroy(); // Zniszczenie sesji

    // Przekierowanie użytkownika na stronę wylogowania lub inny cel
    // header("Location: logout.php");
} else {
    echo "Użytkownik nie jest zalogowany.";
}

mysqli_close($conn);
?>
