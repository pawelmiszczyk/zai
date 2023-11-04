<?php
require_once('databaseConfig.php');
session_start(); // Rozpoczęcie sesji

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
    if (isset($_POST['username'], $_POST['password'], $_POST['confirm_password']) && strlen($_POST['username']) <= 255) {
        $username = mysqli_real_escape_string($conn, $_POST['username']);
        $password = $_POST['password'];
        $confirm_password = $_POST['confirm_password'];

        // Sprawdzenie, czy użytkownik o podanym loginie już istnieje
        $check_query = "SELECT user_id FROM users WHERE username = '$username'";
        $result = mysqli_query($conn, $check_query);

        if (mysqli_num_rows($result) > 0) {
			mysqli_close($conn);
			header('Location: ../html/register.html?message=Użytkownik%20o%20podanym%20loginie%20już%20istnieje.');

        } elseif ($password !== $confirm_password) {
			mysqli_close($conn);
			header('Location: ../html/register.html?message=Hasło%20i%20potwierdzenie%20hasła%20nie%20pasują%20do%20siebie.');

        } else {
            // Użytkownik o podanym loginie nie istnieje, podane hasła zgodne, można go dodać
            // Przed dodaniem hasła należy użyć funkcji password_hash()
            $hashed_password = password_hash($password, PASSWORD_BCRYPT);

            $insert_query = "INSERT INTO users (username, password, role) VALUES ('$username', '$hashed_password', 'czytelnik')";

            if (mysqli_query($conn, $insert_query)) {
				// Wyświetlenie komunikatu i przekierowanie po potwierdzeniu
				mysqli_close($conn);
				header('Location: ../html/index.html?message=Użytkownik%20został%20stworzony');
            } else {
				mysqli_close($conn);
				header('Location: ../html/index.html?message=Błąd%20podczas%20tworzenia%20użytkownika');
            }
        }
    }
}

mysqli_close($conn);