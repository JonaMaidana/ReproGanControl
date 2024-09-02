window.onload = ListadoEventos;

let eventosMostrar = [];

function ListadoEventos() {
    $.ajax({
        url: '../../Eventos/ListadoEventos',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $("#ModalEvento").modal("hide");
            LimpiarModalEvento();
            eventosMostrar = data;
            renderTableEventos();
            updateTotalItemsEventos();
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado de eventos');
        }
    });
}

function renderTableEventos() {
    let contenidoTabla = ``;

    $.each(eventosMostrar, function (index, evento) {  
        contenidoTabla += `
        <tr>
            <td>${evento.animalCaravana}</td>
            <td>${evento.estadoString}</td>
            <td>${evento.fechaEventoString}</td>
            <td>${evento.observacion}</td>
            <td class="text-center">
                <button type="button" class="edit-button" onclick="ModalEditarEventos(${evento.eventoID})">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
            </td>
            <td class="text-center">
                <button type="button" class="delete-button" onclick="EliminarEventos(${evento.eventoID})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById("tbody-eventos").innerHTML = contenidoTabla;
}

function updateTotalItemsEventos() {
    const totalItems = eventosMostrar.length;
    document.getElementById("total-items-eventos").textContent = `Eventos cargados: ${totalItems}`;
}

function LimpiarModalEvento() {
    
    document.getElementById("AnimalID").value = 0;
    document.getElementById("Estado").value = 0;
    document.getElementById("Observacion").value = "";
}

function NuevoEvento() {
    $("#ModalTituloEvento").text("Nuevo Evento");
}

function configurarFechaActual() {
    const fechaInput = document.getElementById("FechaEvento");
    const hoy = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
    fechaInput.value = hoy; // Establecer la fecha actual como valor predeterminado
    fechaInput.setAttribute('min', hoy); // Restringir la selección a partir de la fecha actual
}

function GuardarEvento() {
    let eventoID = document.getElementById("EventoID").value;
    let animalID = document.getElementById("AnimalID").value;
    let estado = document.getElementById("Estado").value; 
    let fechaEvento = document.getElementById("FechaEvento").value;
    let observacion = document.getElementById("Observacion").value;

    // Verificar si alguno de los campos requeridos está vacío  
    if (!animalID || !estado || !fechaEvento) {
        Swal.fire({
            icon: 'error',
            title: 'Campos Incompletos',
            text: 'Faltan campos. Por favor, completa los campos requeridos para guardar el evento.'
        });
        return; // Salir de la función si falta algún campo
    }

    // Si todos los campos están completos, proceder con la solicitud AJAX
    $.ajax({
        url: '../../Eventos/GuardarEventos',
        data: { 
            eventoID: eventoID,
            animalID: animalID,
            estado: estado, // Enviar estado
            fechaEvento: fechaEvento,
            observacion: observacion // Observación puede ser opcional
        },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            if (resultado.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'El evento se ha guardado exitosamente.',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    ListadoEventos(); // Llamar a la función para listar eventos después de guardar
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: resultado.message // Mostrar el mensaje de error si el AnimalID ya está asociado a otro evento
                });
            }
        },
        error: function (xhr, status) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Disculpe, existió un problema al guardar el evento.'
            });
            console.log('Disculpe, existió un problema al guardar el evento');
        }
    });    
}




// Llamar a la función para configurar la fecha al cargar la página
document.addEventListener('DOMContentLoaded', configurarFechaActual);

function ModalEditarEventos(eventoID) {
    $.ajax({
        url: '../../Eventos/ListadoEventos',
        data: { id: eventoID },
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            if (response && response.length > 0) {
                let evento = response[0];

                document.getElementById("EventoID").value = evento.eventoID;
                document.getElementById("AnimalID").value = evento.animalID;

                // Asigna el valor correcto al dropdown del Estado
                document.getElementById("Estado").value = evento.estado;

                let fechaEvento = new Date(evento.fechaEvento);
                let fechaFormato = fechaEvento.toISOString().split('T')[0];
                document.getElementById("FechaEvento").value = fechaFormato;

                document.getElementById("Observacion").value = evento.observacion;

                $("#ModalTituloEvento").text("Editar Evento");
                $("#ModalEvento").modal("show");
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se encontró el evento.',
                    confirmButtonText: 'OK'
                });
            }
        },
        error: function (xhr, status) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Disculpe, existió un problema al cargar los datos del evento.',
                confirmButtonText: 'OK'
            });
        }
    });
}

function EliminarEventos(eventoID) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás deshacer esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // Confirmado, proceder con la eliminación
            $.ajax({
                url: '../../Eventos/EliminarEvento',
                data: { eventoID: eventoID },
                type: 'POST',
                dataType: 'json',
                success: function (resultado) {
                    ListadoEventos(); // Actualiza el listado de eventos
                    Swal.fire(
                        '¡Eliminado!',
                        'El evento ha sido eliminado.',
                        'success'
                    );
                },
                error: function (xhr, status) {
                    Swal.fire(
                        'Error',
                        'Disculpe, existió un problema al eliminar el evento.',
                        'error'
                    );
                }
            });
        }
    });
}
