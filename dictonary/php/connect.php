<?php
require_once('database_config.php');

session_start(); // Rozpocznij sesję

// Uzyskaj dane dostępowe
$database_config = getDatabaseConfig();

$host = $database_config['db_host'];
$username = $database_config['db_user'];
$password = $database_config['db_password'];
$database = $database_config['db_name'];

// Nawiązanie połączenia z bazą danych
$conn = mysqli_connect($host, $username, $password, $database);

// Sprawdzenie połączenia
if (!$conn) {
    die("Błąd połączenia z bazą danych: " . mysqli_connect_error());
}

if (isset($_POST['username']) && isset($_POST['password'])) {
    $username = mysqli_real_escape_string($conn, $_POST['username']);
    $password = $_POST['password'];

    // Znajdź użytkownika w bazie danych
    $query = "SELECT user_id, username, password FROM users WHERE username = '$username'";
    $result = mysqli_query($conn, $query);

    if (mysqli_num_rows($result) === 1) {
        // Użytkownik istnieje, sprawdź hasło
        $row = mysqli_fetch_assoc($result);
        $hashed_password = $row['password'];

        if (password_verify($password, $hashed_password)) {
            // Hasło poprawne, zaloguj użytkownika i nawiąż sesję
            $_SESSION['user_id'] = $row['user_id'];

            // Generuj unikalny token sesji (przykład)
            $session_token = md5(uniqid(rand(), true));

            // Wpisz rekord do tabeli user_sessions
            $insert_session_query = "INSERT INTO user_sessions (user_id, session_token) VALUES ('{$row['user_id']}', '$session_token')";
            if (mysqli_query($conn, $insert_session_query)) {
                // Sesja nawiązana
                echo "Sesja została nawiązana.";
            } else {
                echo "Błąd podczas tworzenia sesji: " . mysqli_error($conn);
            }
        } else {
            echo "Nieprawidłowe hasło.";
        }
    } else {
        echo "Użytkownik o podanej nazwie nie istnieje.";
    }
}

// Zamykanie połączenia z bazą danych
mysqli_close($conn);
?>
