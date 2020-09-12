<?php
if ($_POST['accion'] == 'editar') {
    require_once('../funciones/bd.php');
    //Recuerda siempre verificar que le estas mandando con json_encode() sino va a ser muy dificil debuggear el codigo.
    //echo json_encode($_POST);
    //Validar las entradas
    $nombre = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING);
    $empresa = filter_var($_POST['empresa'], FILTER_SANITIZE_STRING);
    $telefono = filter_var($_POST['telefono'], FILTER_SANITIZE_STRING);
    
    $id = filter_var($_POST['id'], FILTER_SANITIZE_NUMBER_INT);


    try {
        $stmt = $conn->prepare("UPDATE contactos SET nombre = ?, telefono = ?, empresa = ?  WHERE id_contacto = ?");
        $stmt->bind_param("sssi", $nombre, $telefono, $empresa, $id);
        $stmt->execute();
        if($stmt->affected_rows == 1){
            $respuesta = array(
                'respuesta' => 'correcto'
            );
        }else{
            $respuesta = array(
                'respuesta' => 'error'
            );
        }


        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        $respuesta = array(
            'error' => $e->getMessage()
        ); //array
    } //catch

    echo json_encode($respuesta);

}