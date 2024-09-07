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

function toggleInputs() {
    const estadoSelect = document.getElementById("Estado");

    const inputsParto = document.getElementById("inputsParto");
    const inputsAborto = document.getElementById("inputsAborto");
    const inputsServicio = document.getElementById("inputsServicio");
    const inputsCelo = document.getElementById("inputsCelo");
    const inputsSecado = document.getElementById("inputsSecado");
    const inputsVenta = document.getElementById("inputsVenta");
    const inputsRechazo = document.getElementById("inputsRechazo");
    const inputsMuerte = document.getElementById("inputsMuerte");
    const inputsOtros = document.getElementById("inputsOtros");


    const selectedValue = estadoSelect.value;

    // console.log('Estado seleccionado:', selectedValue); // Para depuración

    //(ajusta según enum)
    if (selectedValue === "1") { // Cambia por el valor entero correcto
        inputsParto.style.display = "block";
    } else {
        inputsParto.style.display = "none";
    }
    if (selectedValue === "2") { // Cambia por el valor entero correcto
        inputsAborto.style.display = "block";
    } else {
        inputsAborto.style.display = "none";
    }
    if (selectedValue === "3") { // Cambia por el valor entero correcto
        inputsServicio.style.display = "block";
    } else {
        inputsServicio.style.display = "none";
    }
    if (selectedValue === "4") { // Cambia por el valor entero correcto
        inputsCelo.style.display = "block";
    } else {
        inputsCelo.style.display = "none";
    }
    if (selectedValue === "5") { // Cambia por el valor entero correcto
        inputsSecado.style.display = "block";
    } else {
        inputsSecado.style.display = "none";
    }
    if (selectedValue === "6") { // Cambia por el valor entero correcto
        inputsVenta.style.display = "block";
    } else {
        inputsVenta.style.display = "none";
    }
    if (selectedValue === "7") { // Cambia por el valor entero correcto
        inputsRechazo.style.display = "block";
    } else {
        inputsRechazo.style.display = "none";
    }
    if (selectedValue === "8") { // Cambia por el valor entero correcto
        inputsMuerte.style.display = "block";
    } else {
        inputsMuerte.style.display = "none";
    }
    if (selectedValue === "9") { // Cambia por el valor entero correcto
        inputsOtros.style.display = "block";
    } else {
        inputsOtros.style.display = "none";
    }

}

function limpiarInputs() {
    const inputsParto = document.getElementById("inputsParto");
    const inputsAborto = document.getElementById("inputsAborto");

    // Limpiar los valores de los inputs en la sección de Parto
    inputsParto.querySelectorAll('input').forEach(input => input.value = '');

    // Limpiar los valores de los inputs en la sección de Aborto
    inputsAborto.querySelectorAll('input').forEach(input => input.value = '');

    // Opcional: Ocultar todas las secciones
    inputsParto.style.display = "none";
    inputsAborto.style.display = "none";
}

// Asignar la limpieza cuando el modal se cierra
$("#ModalEvento").on("hidden", function () {
    limpiarInputs();
});

// Asignar la limpieza cuando el modal se abre (opcional, dependiendo del flujo de tu aplicación)
$("#ModalEvento").on("show", function () {
    limpiarInputs();
});

// Llama a la función cuando la página cargue y cada vez que cambie de selección
document.addEventListener('DOMContentLoaded', function () {
    toggleInputs();

    const estadoSelect = document.getElementById("Estado");
    estadoSelect.addEventListener('change', toggleInputs);
});