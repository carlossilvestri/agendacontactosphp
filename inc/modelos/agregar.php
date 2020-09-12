<?php
if ($_POST['accion'] == 'crear') {
    //Creara un nuevo registro en la base de datos
    require_once('../funciones/bd.php');

    //Validar las entradas
    $nombre = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING);
    $empresa = filter_var($_POST['empresa'], FILTER_SANITIZE_STRING);
    $telefono = filter_var($_POST['telefono'], FILTER_SANITIZE_STRING);
    try {
        //prepare() nos permite prepararnos para evitar ataques de insercion SQL a la Base de Datos.
        //Se recomienda colocar dentro del prepare comillas dobles es decir "" aunque tambien funciona con las simples('').
        $stmt = $conn->prepare("INSERT INTO contactos (nombre, empresa, telefono) VALUES(?,?,?) ");
        //El statement ($stmt) utiliza el bind_param() para terminar de evitar ataques de insersion SQL a la base de datos.
        $stmt->bind_param("sss", $nombre, $empresa, $telefono);
        $stmt->execute();
        if ($stmt->affected_rows == 1) {
            $respuesta  = array(
                'respuesta' => 'correcto',
                //Accedo al ID con insert_id, este nos va a devolver el ID creado en la BD para mostrarlo.
                'datos' => array(
                    'nombre' => $nombre,
                    'empresa' => $empresa,
                    'telefono' => $telefono,
                    'id_insertado' => $stmt->insert_id));
        }//if
        //Se cierran despues de haberse ejecutado:
        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        $respuesta = array(
            'error' => $e->getMessage()
        ); //array
    } //catch
    //El echo retorna el arreglo asociativo $respuesta a app.js pero despues alla se tendra que convertir en unn objeto entendible para JS
    echo json_encode($respuesta);
} 
