<?php
session_start();
require_once('databaseConfig.php');

if (!isset($_SESSION['csrf_token'])) {
    $csrf_token = bin2hex(random_bytes(32)); // Generowanie losowego tokena
    $_SESSION['csrf_token'] = $csrf_token;
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
		if (isset($_POST['username'], $_POST['password'], $_POST['newPassword'], $_POST['confirmPassword'], $_POST['csrf_token'])) {
		$username = mysqli_real_escape_string($conn, $_POST['username']);
		$password = mysqli_real_escape_string($conn, $_POST['password']);
		$newPassword = mysqli_real_escape_string($conn, $_POST['newPassword']);
		$confirmPassword = mysqli_real_escape_string($conn, $_POST['confirmPassword']);

		if ($newPassword !== $confirmPassword) {
			header('Location: ../html/modifyUser.html?message=Hasła nie pasują do siebie. Spróbuj ponownie.');
			exit();
		}

		// Wyszukaj użytkownika w bazie danych na podstawie nazwy użytkownika
		$select_query = "SELECT user_id, username, password FROM users WHERE username = ?";
		$stmt = mysqli_prepare($conn, $select_query);

		if ($stmt) {
			mysqli_stmt_bind_param($stmt, "s", $username);

			if (mysqli_stmt_execute($stmt)) {
				$result = mysqli_stmt_get_result($stmt);
				$user = mysqli_fetch_assoc($result);

				if ($user) {
					if (password_verify($password, $user['password'])) {
						// Aktualizuj hasło użytkownika
						$hashedNewPassword = password_hash($newPassword, PASSWORD_DEFAULT);
						$update_query = "UPDATE users SET password = ? WHERE user_id = ?";
						$update_stmt = mysqli_prepare($conn, $update_query);

						if ($update_stmt) {
							mysqli_stmt_bind_param($update_stmt, "si", $hashedNewPassword, $user['user_id']);

							if (mysqli_stmt_execute($update_stmt)) {
								header('Location: ../html/index.html?message=Hasło zostało zmienione.');
							} else {
								header('Location: ../html/modifyUser.html?message=Błąd podczas aktualizacji hasła.');
							}

							mysqli_stmt_close($update_stmt);
						} else {
							header('Location: ../html/modifyUser.html?message=Błąd przygotowywania zapytania.');
						}
					} else {
						header('Location: ../html/modifyUser.html?message=Błędne hasło');
					}
				} else {
					header('Location: ../html/modifyUser.html?message=Brak użytkownika o podanej nazwie');
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
