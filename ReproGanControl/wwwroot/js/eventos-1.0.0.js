window.onload = ListadoEventos;

let eventosMostrar = [];

function ListadoEventos() {
    $.ajax({
        url: '../../Eventos/ListadoEventos',  // Asegúrate de que esta ruta sea correcta
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            // Cerrar el modal de edición
            $("#ModalEvento").modal("hide");

            // Limpiar los campos del modal
            LimpiarModalEvento();

            // Recargar la lista de eventos en la tabla
            eventosMostrar = data;  // Asegúrate de que 'data' contiene los eventos más recientes
            renderTableEventos();   // Esta función debería encargarse de renderizar los eventos

            // Actualizar el total de eventos (si tienes un contador de items)
            updateTotalItemsEventos();
        },
        error: function (xhr, status, error) {
            console.error('Disculpe, existió un problema al cargar el listado de eventos', error);
            alert('No se pudieron cargar los eventos. Por favor, inténtelo de nuevo más tarde.');
        }
    });
}

function renderTableEventos() {
    let contenidoTabla = '';

    console.log('Eventos a mostrar:', eventosMostrar); // Verifica los datos

    $.each(eventosMostrar, function (index, evento) {
        contenidoTabla += `
        <tr>
            <td>${evento.animalCaravana}</td>
            <td>${evento.estadoAnimal}</td>
            <td>${evento.tipoEventoString}</td>
            <td>${evento.fechaEventoString}</td>
            <td>${evento.observacion}</td>
            <td>${evento.tipoCriaString || ''}</td>
            <td>${evento.tipoParto || ''}</td>
            <td>${evento.estadoCriaString || ''}</td>
            <td>${evento.inseminacionString || ''}</td>
            <td>${evento.causaAborto || ''}</td>
            <td>${evento.causaCelo || ''}</td>
            <td>${evento.especifiqueSecado || ''}</td>
            <td>${evento.motivoVenta || ''}</td>
            <td>${evento.causaRechazo || ''}</td>
            <td>${evento.especifiqueOtro || ''}</td>

            <td class="text-center">
                <button type="button" class="edit-button" aria-label="Editar evento" onclick="ModalEditarEventos(${evento.eventoID})">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
            </td>
            <td class="text-center">
                <button type="button" class="delete-button" aria-label="Eliminar evento" onclick="EliminarEventos(${evento.eventoID})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
        `;
    });

    $("#tbody-eventos").html(contenidoTabla);
}

function GuardarEvento() {
    // Recopilar datos del formulario
    let eventoID = $("#EventoID").val();
    let animalID = $("#AnimalID").val();
    let tipoEvento = $("#TipoEvento").val();
    let fechaEvento = $("#FechaEvento").val();
    let observacion = $("#Observacion").val();
    let tipoCria = $("#TipoCria").val() === "true" ? true : ($("#TipoCria").val() === "false" ? false : null);
    let tipoParto = $("#TipoParto").val();
    let estadoCria = $("#EstadoCria").val() === "true" ? true : ($("#EstadoCria").val() === "false" ? false : null);
    let causaAborto = $("#CausaAborto").val();
    let inseminacion = $("#Inseminacion").val() === "Monta" ? true : ($("#Inseminacion").val() === "Inseminación Artificial" ? false : null);
    let causaCelo = $("#CausaCelo").val();
    let especifiqueSecado = $("#EspecifiqueSecado").val();
    let motivoVenta = $("#MotivoVenta").val();
    let causaRechazo = $("#CausaRechazo").val();
    let especifiqueOtro = $("#EspecifiqueOtro").val();

    // Validación básica para campos obligatorios
    if (!animalID || !tipoEvento || !fechaEvento) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, complete todos los campos obligatorios (Animal, Tipo de Evento, Fecha y Observación).',
            confirmButtonText: 'OK'
        });
        return;
    }

    // Validaciones adicionales basadas en el tipo de evento
    switch (parseInt(tipoEvento)) {
        case 1: // Parto
            if (!tipoCria || !tipoParto || !estadoCria) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Por favor, complete todos los campos para el evento de Parto (Tipo de Cría, Tipo de Parto y Estado de Cría).',
                    confirmButtonText: 'OK'
                });
                return;
            }
            break;
        case 2: // Aborto
            if (!causaAborto) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Por favor, ingrese la causa del aborto.',
                    confirmButtonText: 'OK'
                });
                return;
            }
            break;
        case 3: // Servicio
            if (inseminacion === null) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Por favor, seleccione el tipo de inseminación (Monta o Inseminación Artificial).',
                    confirmButtonText: 'OK'
                });
                return;
            }
            break;
        case 4: // Celo
            if (!causaCelo) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Por favor, ingrese la causa del celo.',
                    confirmButtonText: 'OK'
                });
                return;
            }
            break;
        case 5: // Secado
            if (!especifiqueSecado) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Por favor, especifique el motivo del secado.',
                    confirmButtonText: 'OK'
                });
                return;
            }
            break;
        case 6: // Venta
            if (!motivoVenta) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Por favor, ingrese el motivo de la venta.',
                    confirmButtonText: 'OK'
                });
                return;
            }
            break;
        case 7: // Rechazo
            if (!causaRechazo) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Por favor, ingrese la causa del rechazo.',
                    confirmButtonText: 'OK'
                });
                return;
            }
            break;
        case 8: // Otro
            if (!especifiqueOtro) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Por favor, especifique los detalles del evento "Otro".',
                    confirmButtonText: 'OK'
                });
                return;
            }
            break;
        default:
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El tipo de evento seleccionado no es válido.',
                confirmButtonText: 'OK'
            });
            return;
    }

    // Si todas las validaciones pasan, se procede con el envío del formulario
    $.ajax({
        url: '/Eventos/GuardarEventos',  // Cambia esta URL según tu configuración
        type: 'POST',
        data: {
            eventoID: eventoID,
            animalID: animalID,
            tipoEvento: tipoEvento,
            fechaEvento: fechaEvento,
            observacion: observacion,
            tipoCria: tipoCria,
            tipoParto: tipoParto,
            estadoCria: estadoCria,
            causaAborto: causaAborto,
            inseminacion: inseminacion,
            causaCelo: causaCelo,
            especifiqueSecado: especifiqueSecado,
            motivoVenta: motivoVenta,
            causaRechazo: causaRechazo,
            especifiqueOtro: especifiqueOtro
        },
        success: function (response) {
            console.log('Respuesta del servidor:', response);
            if (response.success) {
                // Cerrar el modal
                $("#ModalEvento").modal("hide");

                // Recargar la tabla o hacer otras acciones
                ListadoEventos();

                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Evento guardado correctamente.',
                    confirmButtonText: 'OK'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message,
                    confirmButtonText: 'OK'
                });
            }
        },
        error: function (xhr, status) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Disculpe, existió un problema al guardar el evento.',
                confirmButtonText: 'OK'
            });
        }
    });
}

function ModalEditarEventos(eventoID) {
    $.ajax({
        url: '/Eventos/ListadoEventos',  // Cambia esta URL según tu configuración
        data: { id: eventoID },
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            if (response && response.length > 0) {
                let evento = response[0];
                console.log(evento);

                // Cargar datos principales
                $("#EventoID").val(evento.eventoID);
                $("#AnimalID").val(evento.animalID);
                $("#TipoEvento").val(evento.tipoEvento);

                // Formatear la fecha en formato "YYYY-MM-DD" para el input de fecha
                let fechaEvento = new Date(evento.fechaEvento);
                let fechaFormato = fechaEvento.toISOString().split('T')[0];
                $("#FechaEvento").val(fechaFormato);
                $("#Observacion").val(evento.observacion);
                $('#divEstadoAnimal').hide();

                // Mapeo de valores booleanos o de las cadenas asociadas a esos valores
                switch (evento.tipoEvento) {
                    case 1: // Parto
                        // Verificamos tanto los valores booleanos como las cadenas
                        if (evento.tipoCria !== null) {
                            $("#TipoCria").val(evento.tipoCria === true || evento.tipoCriaString === "MACHO" ? "true" : "false");
                        }
                        $("#TipoParto").val(evento.tipoParto || "");

                        if (evento.estadoCria !== null) {
                            $("#EstadoCria").val(evento.estadoCria === true || evento.estadoCriaString === "VIVO" ? "true" : "false");
                        }
                        break;
                    case 2: // Aborto
                        $("#CausaAborto").val(evento.causaAborto || "");
                        break;
                    case 3: // Servicio
                        // Mapeo para inseminacion: si es booleano o cadena
                        if (evento.inseminacion !== null) {
                            $("#Inseminacion").val(evento.inseminacion === true || evento.inseminacionString === "MONTA" ? "Monta" : "Inseminación Artificial");
                        } else {
                            $("#Inseminacion").val(""); // Si no hay valor, limpiar el campo
                        }
                        break;
                    case 4: // Celo
                        $("#CausaCelo").val(evento.causaCelo || "");
                        break;
                    case 5: // Secado
                        $("#EspecifiqueSecado").val(evento.especifiqueSecado || "");
                        break;
                    case 6: // Venta
                        $("#MotivoVenta").val(evento.motivoVenta || "");
                        break;
                    case 7: // Rechazo
                        $("#CausaRechazo").val(evento.causaRechazo || "");
                        break;
                    case 8: // Otro
                        $("#EspecifiqueOtro").val(evento.especifiqueOtro || "");
                        break;
                }

                // Mostrar campos específicos según el tipo de evento
                mostrarCamposPorTipoEvento();

                // Cambiar el título del modal a "Editar Evento"
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

function NuevoEvento() {
    $("#ModalTituloEvento").text("Nuevo Evento");
    configurarFechaActual(); // Asegúrate de que esta función se llame aquí
}

function configurarFechaActual() {
    const fechaInput = document.getElementById("FechaEvento");
    const hoy = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
    fechaInput.value = hoy; // Establecer la fecha actual como valor predeterminado
    fechaInput.setAttribute('min', hoy); // Restringir la selección a partir de la fecha actual
}

function updateTotalItemsEventos() {
    const totalItems = eventosMostrar.length;
    document.getElementById("total-items-eventos").textContent = `Eventos cargados: ${totalItems}`;
}

function LimpiarModalEvento() {
    // Restablecer valores de campos generales
    document.querySelector("#AnimalID").value = 0;
    document.querySelector("#TipoEvento").value = 0;
    document.querySelector("#Observacion").value = "";
    document.querySelector("#EstadoAnimal").value = "";

    // Ocultar el campo Estado
    document.querySelector("#divEstadoAnimal").style.display = 'none';

    // Campos específicos del evento
    const campos = [
        'TipoParto', 'TipoCria', 'EstadoCria', 'CausaAborto',
        'Inseminacion', 'CausaCelo', 'EspecifiqueSecado',
        'MotivoVenta', 'CausaRechazo', 'EspecifiqueOtro'
    ];

    // Limpiar y ocultar cada campo específico
    campos.forEach(campo => {
        const elemento = document.querySelector(`#${campo}`);
        if (elemento) {
            if (elemento.tagName === 'SELECT') {
                elemento.value = ""; // Limpia el valor de los <select>
            } else {
                elemento.value = ""; // Limpia el valor de los <input>
            }
        }
        // Ocultar el campo específico
        const divElemento = document.querySelector(`#div${campo}`);
        if (divElemento) {
            divElemento.style.display = 'none';
        }
    });
}
// Llamar a LimpiarModalEvento cuando el modal se cierre
$('#ModalEvento').on('hidden.bs.modal', function () {
    LimpiarModalEvento();
});

function mostrarCamposPorTipoEvento() {
    // Obtener el valor seleccionado del DropDownList
    const tipoEvento = document.querySelector("#TipoEvento").value;


    // Función para ocultar todos los campos específicos
    const ocultarCampos = () => {
        const campos = [
            "divTipoParto",
            "divTipoCria",
            "divEstadoCria",
            "divCausaAborto",
            "divInseminacion",
            "divCausaCelo",
            "divEspecifiqueSecado",
            "divMotivoVenta",
            "divCausaRechazo",
            "divEspecifiqueOtro"
        ];
        campos.forEach(campo => {
            document.querySelector(`#${campo}`).style.display = "none";
        });
    };

    // Ocultar todos los campos
    ocultarCampos();

    // Mostrar solo el campo correspondiente al evento seleccionado
    switch (tipoEvento) {
        case '1': // Parto
            document.querySelector("#divTipoParto").style.display = "block";
            document.querySelector("#divTipoCria").style.display = "block";
            document.querySelector("#divEstadoCria").style.display = "block";
            break;
        case '2': // Aborto
            document.querySelector("#divCausaAborto").style.display = "block";
            break;
        case '3': // Servicio
            document.querySelector("#divInseminacion").style.display = "block";
            break;
        case '4': // Celo
            document.querySelector("#divCausaCelo").style.display = "block";
            break;
        case '5': // Secado
            document.querySelector("#divEspecifiqueSecado").style.display = "block";
            break;
        case '6': // Venta
            document.querySelector("#divMotivoVenta").style.display = "block";
            break;
        case '7': // Rechazo
            document.querySelector("#divCausaRechazo").style.display = "block";
            break;
        case '8': // Otro
            document.querySelector("#divEspecifiqueOtro").style.display = "block";
            break;
        default:
            // Ningún campo específico es requerido para otros tipos de eventos
            break;
    }
}

// traer el estado del animal 
$(document).ready(function () {
    // Manejar el cambio en la selección de Caravana
    $('#AnimalID').change(function () {
        var animalID = $(this).val();

        if (animalID && animalID != "0") {
            $.ajax({
                url: '/Eventos/ObtenerEstadoAnimal',
                type: 'GET',
                data: { id: animalID },
                success: function (response) {
                    $('#EstadoAnimal').val(response.estadoAnimal);
                    $('#divEstadoAnimal').show(); // Muestra el campo Estado
                },
                error: function () {
                    $('#EstadoAnimal').val('Error al obtener el estado.');
                    $('#divEstadoAnimal').show(); // Muestra el campo Estado en caso de error
                }
            });
        } else {
            $('#EstadoAnimal').val('');
            $('#divEstadoAnimal').hide(); // Oculta el campo Estado si el valor es 0 o no hay selección
        }
    });

    // Manejo del cierre del modal
    $('#ModalEvento').on('hidden.bs.modal', function () {
        LimpiarModalEvento(); // Llama a la función para limpiar el modal
    });
});