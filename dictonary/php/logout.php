<?php
session_start();
session_unset(); // Usuń wszystkie zmienne sesji
session_destroy(); // Zniszcz sesję
header('Location: ../html/index.html'); // Przekieruj użytkownika na stronę logowania
