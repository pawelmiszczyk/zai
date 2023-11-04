<?php
session_start(); // Rozpocznij sesję

if (isset($_SESSION['username'])) {
    $output = '<h1>Witaj, ' . $_SESSION['username'] . '!</h1>';
	$output .= '<p><a href="../html/modifyUser.html">Zmień hasło</a></p>';
    $output .= '<p><a href="../php/logout.php">Wyloguj się</a></p>';
} else {
    $output = '<p><a href="../html/register.html">Rejestracja</a></p>';
    $output .= '<p><a href="../html/login.html">Zaloguj się</a></p>';
	$output .= '<p><a href="../html/modifyUser.html">Zmień hasło</a></p>';
}
if (isset($_SESSION['role']) && $_SESSION['role'] == 'administrator') {
    // Jeśli rola użytkownika to "administrator", dodaj dodatkowe pola lub treść
    $output .= '<p><a href="../html/manageEvents.html">Zarządzaj wydarzeniami</a></p>';
    $output .= '<p><a href="../html/manageCategories.html">Zarządzaj kategoriami</a></p>';
}

// Teraz wynik jest przechowywany w zmiennej $output, którą można zwrócić jako JSON.
header('Content-Type: application/json');
echo json_encode($output);
?>