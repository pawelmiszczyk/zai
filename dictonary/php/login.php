<?php
session_start();
require_once('databaseConfig.php');

if (!isset($_SESSION['csrf_token'])) {
    $csrf_token = bin2hex(random_bytes(32)); // Generowanie losowego tokena
    $_SESSION['csrf_token'] = $csrf_token;
}

// Sprawdź, czy użytkownik jest już zalogowany
if (isset($_SESSION['user_id'])) {
    header('Location: ../html/index.html'); // Przekieruj zalogowanego użytkownika do strony głównej
}

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
    if (isset($_POST['username'], $_POST['password'], $_POST['csrf_token'])) {
        $username = mysqli_real_escape_string($conn, $_POST['username']);
        $password = mysqli_real_escape_string($conn, $_POST['password']);

        // Wyszukaj użytkownika w bazie danych na podstawie nazwy użytkownika
        $select_query = "SELECT user_id, username, password, role FROM users WHERE username = ?";
        $stmt = mysqli_prepare($conn, $select_query);

        if ($stmt) {
            mysqli_stmt_bind_param($stmt, "s", $username);

            if (mysqli_stmt_execute($stmt)) {
                $result = mysqli_stmt_get_result($stmt);
                $user = mysqli_fetch_assoc($result);

                if ($user) {
                    if (password_verify($password, $user['password'])) {
                        // Zalogowano użytkownika
                        session_start();
                        $_SESSION['user_id'] = $user['user_id'];
                        $_SESSION['username'] = $user['username'];
						$_SESSION['role'] = $user['role'];
                        header('Location: ../html/index.html?message=Pomyślnie zalogowano.'); // Przekierowanie do strony głównej po zalogowaniu
                    } else {
                        header('Location: ../html/login.html?message=Błędne hasło');
                    }
                } else {
                    header('Location: ../html/login.html?message=Brak użytkownika o podanej nazwie');
                }
            } else {
                echo "Błąd podczas wykonania zapytania: " . mysqli_error($conn);
            }

            mysqli_stmt_close($stmt);
        } else {
            echo "Błąd przygotowywania zapytania: " . mysqli_error($conn);
        }
    } else {
        echo "Błąd CSRF. Żądanie odrzucone.";
    }
}


mysqli_close($conn);

?>
