const formularioContactos = document.querySelector('#contacto'),
    listadoContactos = document.querySelector('#listado-contactos tbody');
inputBuscador = document.querySelector('#buscar');

eventListeners();

function eventListeners() {
    //  Cuando el formulario de crear o editar se ejecuta
    formularioContactos.addEventListener('submit', leerFormulario);

    //Leer para eliminar el boton
    if (listadoContactos) {
        listadoContactos.addEventListener('click', eliminarContacto);
    }
    //Buscador
    inputBuscador.addEventListener('input', buscarContactos);
    //Calcular cuantos contactos hay:
    numeroContactos();
}

function leerFormulario(e) {

    e.preventDefault();

    //Leer los datos de los inputs
    const nombre = document.querySelector('#nombre').value,
        empresa = document.querySelector('#empresa').value,
        telefono = document.querySelector('#telefono').value,
        accion = document.querySelector('#accion').value;
    if (nombre === '' || empresa === '' || telefono === '') {
        mostrarNotificacion('Todos los campos son obligatorios', 'error');
    } else {
        //Pasa la validacion, crear llamado a Ajax.
        const infoContacto = new FormData();
        infoContacto.append('nombre', nombre);
        infoContacto.append('empresa', empresa);
        infoContacto.append('telefono', telefono);
        infoContacto.append('accion', accion);

        if (accion === 'crear') {
            //Crearemos un nuevo contacto
            insertarBD(infoContacto);
        } else {
            //Editar el contacto
            //Leer el ID
            const idRegistro = document.querySelector('#id').value;
            infoContacto.append('id', idRegistro);
            actualizarRegistro(infoContacto);
        }
    }
} //FIN del leerFormulario()

/*  Insera en la BD via Ajax. */
function insertarBD(datos) {

    //Llamado a Ajax

    //Crear el objeto
    const xhr = new XMLHttpRequest();

    //Abrir la conexion
    xhr.open('POST', 'inc/modelos/agregar.php');

    //Pasar los datos
    xhr.onload = function() {
            //Si es exitoso entonces
            if (this.status === 200) {
                //Leemos la respuesta de PHP
                //xhr.responseText nos devuelve un JSON pero en string.
                //JSON.parse transforama ese JSON en un objeto entendible para JavaScript.
                const respuesta = JSON.parse(xhr.responseText);
                console.log(respuesta);

                //Inserta un nuevo elemento a la tabla.
                const nuevoContacto = document.createElement('tr');
                nuevoContacto.innerHTML = `
                <td>${respuesta.datos.nombre}</td>
                <td>${respuesta.datos.empresa}</td>
                <td>${respuesta.datos.telefono}</td>
                `;
                //Contenedor para los botones
                const contenedorAcciones = document.createElement('td');
                //Crear el icono de Editar
                const iconoEditar = document.createElement('i');
                iconoEditar.classList.add('fas', 'fa-pen-square');

                //Crea el enlace para ir a editar
                const btnEditar = document.createElement('a');
                btnEditar.appendChild(iconoEditar);
                btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
                btnEditar.classList.add('btn', 'btn-editar');

                //Agregarlo al Padre
                contenedorAcciones.appendChild(btnEditar);

                //Crear el icono de eliminar
                const iconoEliminar = document.createElement('i');
                iconoEliminar.classList.add('fas', 'fa-trash-alt');

                //Crear el boton de eliminar
                const btnEliminar = document.createElement('button');
                btnEliminar.appendChild(iconoEliminar);
                btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
                btnEliminar.classList.add('btn', 'btn-borrar');
                //Agregar al padre
                contenedorAcciones.appendChild(btnEliminar);

                //Agregarlo a tr
                nuevoContacto.appendChild(contenedorAcciones);

                //Agregarlo con los contactos
                listadoContactos.appendChild(nuevoContacto);
                //Resetear el formulario, es decir quitar los datos del formulario.
                document.querySelector('form').reset();
                //Mostrar la notificacion
                mostrarNotificacion('Contacto Creado Correctamente', 'correcto');
                //Actualizar el numero del buscador
                numeroContactos();
            }
        } //function
        //Enviar los datos
    xhr.send(datos);
} //FIN del insertarBD(datos)

function actualizarRegistro(datos) {
    //Crear el obj
    const xhr = new XMLHttpRequest;
    //Abrir la conexion
    xhr.open('POST', 'inc/modelos/editarContacto.php');
    //Leer la respuesta
    xhr.onload = function() {

        if (this.status === 200) {

            const respuesta = JSON.parse(xhr.responseText);
            if (respuesta.respuesta === 'correcto') {
                //Mostrar la notificacion de correcto
                mostrarNotificacion('Contacto Editado Correctamente', 'correcto');
            } else {
                //Hubo un error
                mostrarNotificacion('No has hecho ningún cambio.', 'error');
            }
            //Despues de 3 segundos redireccionar al index:
            setTimeout(() => {
                window.location.href = 'index.php';
            }, 3800);
        }
    }

    //Enviar la peticion
    xhr.send(datos);
}

function eliminarContacto(e) {
    //e.target nos devuelve qué elemento hemos dado click dentro los limites de tbody
    //parentElement porque el padre del icono de borrar es el button.  
    //contains() nos devuelve un true or false
    if (e.target.parentElement.classList.contains('btn-borrar')) {
        // tomar el ID
        const id = e.target.parentElement.getAttribute('data-id');
        // console.log(id);

        //Preguntar al usuario
        const respuesta = confirm('¿Estás seguro/a?');
        if (respuesta) {
            //Llamado a Ajax
            //Crear el objeto
            const xhr = new XMLHttpRequest();

            //Abrir la conexion
            //Se usa GET porque se están tomando datos ya existentes. 
            xhr.open('GET', `inc/modelos/borrar.php?id=${id}&accion=borrar`, true);
            //Leer la respuesta
            xhr.onload = function() {
                    //Si se realizó correctamente entonces:
                    if (this.status === 200) {
                        const resultado = JSON.parse(xhr.responseText);
                        console.log(resultado);
                        if (resultado.respuesta === 'correcto') {

                            //Eliminar registro del DOM
                            e.target.parentElement.parentElement.parentElement.remove();
                            //mostrar notificacion
                            mostrarNotificacion('Contacto Eliminado', 'correcto');
                            //Actualizar el numero del buscador
                            numeroContactos();
                        } else {
                            //Mostramos una notificacion
                            mostrarNotificacion('Hubo un error...', 'error');
                        }
                    }
                } //if

            //Enviar la peticion
            xhr.send();
        }
    }
}
//Notificacion en Pantalla
function mostrarNotificacion(mensaje, clase) {

    const notificacion = document.createElement('div');
    notificacion.classList.add(clase, 'notificacion', 'sombra');
    notificacion.textContent = mensaje;


    //Formulario
    //Parametros: insertBefore(Lo que quieres insertar, y antes del donde ).
    formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));

    //Ocultar y Mostrar la notificacion
    setTimeout(() => {
        notificacion.classList.add('visible');
        setTimeout(() => {
            notificacion.classList.remove('visible');
            setTimeout(() => {
                notificacion.remove();
            }, 500);
        }, 3000);
    }, 100);

}

function buscarContactos(e) {
    const expresion = new RegExp(e.target.value, "i"),
        registros = document.querySelectorAll('tbody tr');
    registros.forEach(registro => {
        registro.style.display = 'none';
        // /\s/g es un espacio en blanco en Expresiones Regulares
        if (registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1) {
            //Como es una tabla se debe cambiar por table-row.
            registro.style.display = 'table-row';
        }
        numeroContactos();

    })
}
// Muestra el número de contactos:
function numeroContactos() {
    const totalContactos = document.querySelectorAll('tbody tr'),
        contenedorNumero = document.querySelector('.total-contactos span');
    let total = 0;

    totalContactos.forEach(contacto => {
        if (contacto.style.display === '' || contacto.style.display === 'table-row') {
            total++;
        }
    });

    //Contenedor 
    contenedorNumero.textContent = total;

}