<?php
session_start(); // Rozpocznij sesję

if (isset($_SESSION['csrf_token'])) {
    $output = $_SESSION['csrf_token'];
}

// Teraz wynik jest przechowywany w zmiennej $output, którą można zwrócić jako JSON.
header('Content-Type: application/json');
echo json_encode($output);
?>
