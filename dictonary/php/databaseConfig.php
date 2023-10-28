<?php

function getDatabaseConfig() {
    $config_file = '../config/database.json';
    $config_data = file_get_contents($config_file);
    $config = json_decode($config_data, true);
    return $config;
}
