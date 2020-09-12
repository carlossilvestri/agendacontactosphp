<?php
//CREEDENCIALES DE LA BASE DE DATOS

define('DB_USUARIO','root');
define('DB_PASSWORD', '');
//Si el servidor no fuera locahost debes colocar el IP.
define('DB_HOST', 'localhost');
define('DB_NOMBRE', 'agendaphp');

//Insertamos en mysqli() las variables declaradas anteriormente.
$conn = new mysqli(DB_HOST,DB_USUARIO,DB_PASSWORD,DB_NOMBRE);
//Con ping() podemos saber si la conexion esta bien, si esta bien nos devuelve un 1, sino nos devuelve un 0.
//echo $conn->ping();