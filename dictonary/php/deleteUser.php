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

if (isset($_POST['user_id'])) {
    $user_id = mysqli_real_escape_string($conn, $_POST['user_id']);

    // Sprawdź, czy użytkownik o podanym identyfikatorze istnieje
    $check_query = "SELECT user_id FROM users WHERE user_id = $user_id";
    $result = mysqli_query($conn, $check_query);

    if (mysqli_num_rows($result) > 0) {
        // Użytkownik istnieje, można go usunąć
        $delete_query = "DELETE FROM users WHERE user_id = $user_id";

        if (mysqli_query($conn, $delete_query)) {
            echo "Użytkownik został usunięty.";
        } else {
            echo "Błąd podczas usuwania użytkownika: " . mysqli_error($conn);
        }
    } else {
        echo "Użytkownik o podanym identyfikatorze nie istnieje.";
    }
}

mysqli_close($conn);
?>
