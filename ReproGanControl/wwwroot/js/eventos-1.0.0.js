window.onload = ListadoEventos();

function ListadoEventos(){
    $.ajax({
        url: '../../Eventos/ListadoEventos',
        type: 'GET',
        dataType: 'json',
        success: function (eventosMostrar) {
            $("#ModalEvento").modal("hide");
            LimpiarModalEvento();
            let contenidoTabla = ``;

            $.each(eventosMostrar, function (index, evento) {  
                contenidoTabla += `
                <tr>
                    <td>${evento.animalCaravana}</td>
                    <td>${evento.estadoDescripcion}</td>
                    <td>${evento.fechaEventoString}</td>
                    <td>${evento.observacion}</td>
                    <td class="text-center">
                        <button type="button" class="edit-button" onclick="ModalEditarEventos(${evento.eventoID})">
                            Editar</i>
                        </button>
                    </td>
                    <td class="text-center">
                        <button type="button" class="delete-button" onclick="EliminarEventos(${evento.eventoID})">
                            Eliminar</i>
                        </button>
                    </td>
                </tr>
                `;
            });

            document.getElementById("tbody-eventos").innerHTML = contenidoTabla;
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado de eventos');
        }
    });
}

function LimpiarModalEvento(){
    document.getElementById("EventoID").value = 0;
    document.getElementById("AnimalID").value = 0;
    document.getElementById("EstadoID").value = 0;
    document.getElementById("Observacion").value = "";
}

function NuevoEvento(){
    $("#ModalTituloEvento").text("Nuevo Evento");
}

function GuardarEvento(){
    let eventoID = document.getElementById("EventoID").value;
    let animalID = document.getElementById("AnimalID").value;
    let estadoID = document.getElementById("EstadoID").value;
    let fechaEvento = document.getElementById("FechaEvento").value;
    let observacion = document.getElementById("Observacion").value;

    // Verificar si alguno de los campos está vacío
    if (!eventoID || !animalID || !estadoID || !fechaEvento || !observacion) {
        Swal.fire({
            icon: 'warning',
            title: 'Faltan campos',
            text: 'Por favor, complete todos los campos para guardar el evento.',
            confirmButtonText: 'OK'
        });
        return; // Salir de la función si falta algún campo
    }

    // Si todos los campos están completos, proceder con la solicitud AJAX
    $.ajax({
        url: '../../Eventos/GuardarEventos',
        data: { 
            eventoID: eventoID,
            animalID: animalID,
            estadoID: estadoID,
            fechaEvento: fechaEvento,
            observacion: observacion
        },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            Swal.fire({
                icon: 'success',
                title: 'Guardado correctamente',
                text: 'El evento se ha guardado exitosamente.',
                confirmButtonText: 'OK'
            });
            ListadoEventos(); // Llamar a la función para listar eventos después de guardar
        },
        error: function (xhr, status) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Disculpe, existió un problema al guardar el evento.',
                confirmButtonText: 'OK'
            });
            console.log('Disculpe, existió un problema al guardar el evento');
        }
    });    
}


function ModalEditarEventos(eventoID){
    
    $.ajax({
        url: '../../Eventos/ListadoEventos',
        data: { id: eventoID},
        type: 'POST',
        dataType: 'json',

        success: function (eventosMostrar) {
            let evento = eventosMostrar[0];

            console.log(eventosMostrar)

            document.getElementById("EventoID").value = eventoID;
            document.getElementById("AnimalID").value = evento.animalID;
            document.getElementById("EstadoID").value = evento.estadoID;
            document.getElementById("FechaEvento").value = evento.fechaEvento;
            document.getElementById("Observacion").value = evento.observacion;

            $("#ModalTituloEvento").text("Editar Evento");
            $("#ModalEvento").modal("show");
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el listado para ser modificado.');
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
