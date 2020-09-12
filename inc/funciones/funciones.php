<?php 

function obtenerContactos(){

    include 'bd.php';

    try{
        return $conn->query("SELECT id_contacto, nombre, empresa, telefono FROM contactos ");
    }catch(Exception $e){
        echo 'Error!! '. $e->getMessage() . '<br>';
        return false;
    }
}
//Obtiene un contacto toma un id
function obtenerContato($id){
    include 'bd.php';
    try{
        return $conn->query("SELECT id_contacto, nombre, empresa, telefono FROM contactos WHERE id_contacto = $id ");
    }catch(Exception $e){
        echo 'Error!! '. $e->getMessage() . '<br>';
        return false;
    }
}