<?php
session_start(); // Rozpocznij sesję

if (isset($_SESSION['csrf_token'])) {
    $output = $_SESSION['csrf_token'];
} else {
    $output = bin2hex(random_bytes(32));
    $_SESSION['csrf_token'] = $output;
}

// Teraz wynik jest przechowywany w zmiennej $output, którą można zwrócić jako JSON.
header('Content-Type: application/json');
echo json_encode($output);
?>
