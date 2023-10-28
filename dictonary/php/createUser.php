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

if (isset($_POST['username']) && strlen($_POST['username']) <= 255) {
    $username = mysqli_real_escape_string($conn, $_POST['username']);
    $password = $_POST['password'];

    // Sprawdzenie, czy użytkownik o podanym loginie już istnieje
    $check_query = "SELECT user_id FROM users WHERE username = '$username'";
    $result = mysqli_query($conn, $check_query);

    if (mysqli_num_rows($result) > 0) {
        echo "Użytkownik o podanym loginie już istnieje.";
    } else {
        // Użytkownik o podanym loginie nie istnieje, można go dodać
        // Przed dodaniem hasła należy użyć funkcji password_hash()
        $hashed_password = password_hash($password, PASSWORD_BCRYPT);

        $insert_query = "INSERT INTO users (username, password, role) VALUES ('$username', '$hashed_password', 'czytelnik')";

        if (mysqli_query($conn, $insert_query)) {
            echo "Nowy użytkownik został dodany.";
        } else {
            echo "Błąd podczas dodawania użytkownika: " . mysqli_error($conn);
        }
    }
}

mysqli_close($conn);
?>
