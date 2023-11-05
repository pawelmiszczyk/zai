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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['event_id'], $_POST['new_event_name'], $_POST['new_start_date'], $_POST['new_end_date'], $_POST['new_description'], $_POST['new_category_id'], $_FILES['new_image'])) {
        if (isset($_POST['csrf_token']) && $_POST['csrf_token'] == $_SESSION['csrf_token']) {
            $event_id = mysqli_real_escape_string($conn, $_POST['event_id']);
            $new_event_name = mysqli_real_escape_string($conn, $_POST['new_event_name']);
            $new_start_date = mysqli_real_escape_string($conn, $_POST['new_start_date']);
            $new_end_date = mysqli_real_escape_string($conn, $_POST['new_end_date']);
            $new_description = mysqli_real_escape_string($conn, $_POST['new_description']);
            $new_category_id = mysqli_real_escape_string($conn, $_POST['new_category_id']);

            // Przetwarzanie obrazka
			if(!empty($_FILES["new_image"]["name"])) { 
				$fileName = basename($_FILES["new_image"]["name"]); 
				$fileType = pathinfo($fileName, PATHINFO_EXTENSION); 
				 
				// Tylko typ obrazka : jpg, png, jpeg, gif 
				$allowTypes = array('jpg','png','jpeg','gif'); 
				if(in_array($fileType, $allowTypes)) { 
					$new_image = $_FILES['new_image']['tmp_name']; 
					$imgContent = addslashes(file_get_contents($new_image)); 
				 
					$update = $conn->query("UPDATE events SET event_name = '$new_event_name', start_date = '$new_start_date', end_date = '$new_end_date', description = '$new_description', image_url = '$imgContent', category_id = '$new_category_id' WHERE event_id = '$event_id'"); 

					if($update){ 
						header('Location: ../html/manageEvents.html?message=Wydarzenie zostało zaktualizowane.');
						exit;
					} else { 
						echo "Błąd podczas aktualizacji wydarzenia: " . mysqli_error($conn);
					}  
				} else { 
					header('Location: ../html/manageEvents.html?message=Obsługiwane formaty obrazka to JPG, JPEG, PNG i GIF.');
				} 
			} else {
				$update_query = "UPDATE events SET event_name = ?, start_date = ?, end_date = ?, description = ?, category_id = ? WHERE event_id = ?";
				$stmt = mysqli_prepare($conn, $update_query);

				if ($stmt) {
					mysqli_stmt_bind_param($stmt, "ssssii", $new_event_name, $new_start_date, $new_end_date, $new_description, $new_category_id, $event_id);

					if (mysqli_stmt_execute($stmt)) {
						header('Location: ../html/manageEvents.html?message=Wydarzenie%20zostało%20zaktualizowane.');
						exit;
					} else {
						echo "Błąd podczas aktualizacji wydarzenia: " . mysqli_error($conn);
					}

					mysqli_stmt_close($stmt);
				} else {
					echo "Błąd przygotowywania zapytania: " . mysqli_error($conn);
				}
            }
        } else {
            echo "Błąd CSRF. Żądanie odrzucone.";
        }
    } else {
        echo "Brak wymaganych parametrów sesji.";
    }
}

mysqli_close($conn);
?>
