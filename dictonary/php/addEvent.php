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
    if (isset($_POST['event_name'], $_POST['start_date'], $_POST['end_date'], $_POST['description'], $_POST['category_id'], $_FILES['image'], $_POST['csrf_token'])) {
        if ($_POST['csrf_token'] === $_SESSION['csrf_token']) {
            $event_name = mysqli_real_escape_string($conn, $_POST['event_name']);
            $start_date = mysqli_real_escape_string($conn, $_POST['start_date']);
            $end_date = mysqli_real_escape_string($conn, $_POST['end_date']);
            $description = mysqli_real_escape_string($conn, $_POST['description']);
            $category_id = mysqli_real_escape_string($conn, $_POST['category_id']);

            // Przetwarzanie obrazka
			if(!empty($_FILES["image"]["name"])) { 
				$fileName = basename($_FILES["image"]["name"]); 
				$fileType = pathinfo($fileName, PATHINFO_EXTENSION); 
				 
				// Tylko typ obrazka : jpg, png, jpeg, gif 
				$allowTypes = array('jpg','png','jpeg','gif'); 
				if(in_array($fileType, $allowTypes)) { 
					$image = $_FILES['image']['tmp_name']; 
					$imgContent = addslashes(file_get_contents($image)); 
				 
					$insert = $conn->query("INSERT INTO events (event_name, start_date, end_date, description, image_url, category_id) VALUES ('$event_name', '$start_date', '$end_date', '$description', '$imgContent', '$category_id')"); 
					 
					if($insert){ 
						header('Location: ../html/manageEvents.html?message=Wydarzenie%20zostało%20dodane.');
						exit;
					} else { 
						echo "Błąd podczas dodawania wydarzenia: " . mysqli_error($conn);
					}  
				} else { 
					header('Location: ../html/manageEvents.html?message=Obsługiwane formaty obrazka to JPG, JPEG, PNG i GIF.');
				} 
			}else{ 
				header('Location: ../html/manageEvents.html?message=Brak wybranego obrazka dla wydarzenia.');
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
