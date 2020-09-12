<?php 

include 'inc/layout/header.php';
include 'inc/funciones/funciones.php';
?>

<div class="contenedor-barra">
    <h1>Agenda de Contactos</h1>
</div>
<div class="bg-amarillo contenedor sombra">
    <form id="contacto" action="#">
        <legend>
            Añada un contacto <span>Todos los campos son obligatorios</span>
            <?php include 'inc/layout/formulario.php'; ?>
        </legend>
    </form>
</div>
<div class="bg-blanco contenedor sombra contactos">
    <div class="contenedor-contactos">
        <h2>Contactos</h2>
        <input type="text" id="buscar" class="buscador sombra" placeholder="Buscar Contactos">
        <p class="total-contactos"> <span>2</span> Contactos</p>
        <div class="contenedor-tabla">
            <table id="listado-contactos" class="listado-contactos">
                <thead>
                    <th>Nombre</th>
                    <th>Empresa</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                </thead>
                <tbody>
                    <?php $contactos = obtenerContactos();
                    if ($contactos->num_rows) :
                        foreach ($contactos as $contacto) :
                            ?>
                            <tr>
                                <td><?php echo $contacto['nombre']; ?></td>
                                <td><?php echo $contacto['empresa']; ?></td>
                                <td><?php echo $contacto['telefono']; ?></td>
                                <td>
                                    <a href="editar.php?id=<?php echo $contacto['id_contacto']; ?>" class="btn-editar btn">
                                        <i class="fas fa-pen-square"></i>
                                    </a>
                                    <button data-id ="<?php echo $contacto['id_contacto']; ?>" type="button" class="btn-borrar btn">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                    <?php
                        endforeach;
                    endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>


<?php include 'inc/layout/footer.php'; ?>