window.onload = ListadoEventos;

let eventosMostrar = [];

function ListadoEventos() {
    $.ajax({
        url: '../../Eventos/ListadoEventos',  // Asegúrate de que esta ruta sea correcta
        type: 'GET',
        dataType: 'json',
        success: function (data) {
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

    $.each(eventosMostrar, function (index, evento) {
        contenidoTabla += `
        <tr>
            <td>${evento.animalCaravana}</td>
            <td>${evento.estadoAnimal}</td>
            <td>${evento.tipoEventoString}</td>
            <td>${evento.fechaEventoString}</td>
            <td>${evento.observacion}</td>
            <td class="text-center">
                <button type="button" class="show-details-button" aria-label="Mostrar detalles" onclick="mostrarDetalles(${index})">
                    Mostrar detalles
                </button>
            </td>
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
        <tr id="detalles-${index}" style="display:none;">
            <td colspan="15">
                <strong>Tipo Cría:</strong> ${evento.tipoCriaString || 'N/A'} <br>
                <strong>Tipo Parto:</strong> ${evento.tipoParto || 'N/A'} <br>
                <strong>Estado Cría:</strong> ${evento.estadoCriaString || 'N/A'} <br>
                <strong>Inseminación:</strong> ${evento.inseminacionString || 'N/A'} <br>
                <strong>Causa Aborto:</strong> ${evento.causaAborto || 'N/A'} <br>
                <strong>Causa Celo:</strong> ${evento.causaCelo || 'N/A'} <br>
                <strong>Especifique Secado:</strong> ${evento.especifiqueSecado || 'N/A'} <br>
                <strong>Motivo Venta:</strong> ${evento.motivoVenta || 'N/A'} <br>
                <strong>Causa Rechazo:</strong> ${evento.causaRechazo || 'N/A'} <br>
                <strong>Especifique Otro:</strong> ${evento.especifiqueOtro || 'N/A'} <br>
            </td>
        </tr>
        `;
    });

    $("#tbody-eventos").html(contenidoTabla);
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
    // Restablecer valores de campos
    document.querySelector("#AnimalID").value = 0;
    document.querySelector("#TipoEvento").value = 0;
    document.querySelector("#Observacion").value = "";

    // Ocultar todos los campos específicos de tipo de evento
    const campos = [
        'TipoParto', 'TipoCria', 'EstadoCria', 'CausaAborto',
        'Inseminacion', 'CausaCelo', 'EspecifiqueSecado',
        'MotivoVenta', 'CausaRechazo', 'EspecifiqueOtro'
    ];

    campos.forEach(campo => {
        document.querySelector(`#div${campo}`).style.display = 'none';
        document.querySelector(`#${campo}`).value = '';
    });
}

function GuardarEvento() {
    // Forzar la actualización del valor del campo
    $("#TipoCria").trigger('change');
    $("#TipoParto").trigger('change');
    $("#EstadoCria").trigger('change');
    $("#CausaAborto").trigger('change');
    $("#Inseminacion").trigger('change');
    $("#CausaCelo").trigger('change');
    $("#EspecifiqueSecado").trigger('change');
    $("#MotivoVenta").trigger('change');
    $("#CausaRechazo").trigger('change');
    $("#EspecifiqueOtro").trigger('change');

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
            if (response.success) {
                // Cerrar el modal
                $("#ModalEvento").modal("hide");

                // Recargar la tabla o hacer otras acciones
                // Puedes llamar a una función que actualice la tabla, por ejemplo:
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

                // Mapeo de valores booleanos o de las cadenas asociadas a esos valores
                switch (evento.tipoEvento) {
                    case 1: // Parto
                        // Verificamos tanto los valores booleanos como las cadenas
                        if (evento.tipoCria !== null) {
                            $("#TipoCria").val(evento.tipoCria === true || evento.tipoCriaString === "Macho" ? "true" : "false");
                        }
                        $("#TipoParto").val(evento.tipoParto || "");

                        if (evento.estadoCria !== null) {
                            $("#EstadoCria").val(evento.estadoCria === true || evento.estadoCriaString === "Vivo" ? "true" : "false");
                        }
                        break;
                    case 2: // Aborto
                        $("#CausaAborto").val(evento.causaAborto || "");
                        break;
                    case 3: // Servicio
                        $("#Inseminacion").val(evento.inseminacionString || "")
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

function mostrarCamposPorTipoEvento() {
    // Obtener el valor seleccionado del DropDownList
    const tipoEvento = document.querySelector("#TipoEvento").value;
    console.log('Tipo de Evento Seleccionado:', tipoEvento); // Log del tipo de evento

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


function mostrarDetalles(index) {
    let evento = eventosMostrar[index];
    let modalBody = document.getElementById('modalDetallesBody');

    // Crear un fragmento de documento para agregar los detalles
    let fragment = document.createDocumentFragment();

    // Función auxiliar para crear un campo en el modal solo si tiene valor
    function createField(label, value) {
        if (value) {
            let div = document.createElement('div');
            div.classList.add('mb-3');
            div.innerHTML = `<strong>${label}:</strong> ${value}`;
            fragment.appendChild(div);
        }
    }

    // Agregar detalles dinámicamente al fragmento
    createField('Tipo Cría', evento.tipoCriaString);
    createField('Tipo Parto', evento.tipoParto);
    createField('Estado Cría', evento.estadoCriaString);
    createField('Inseminación', evento.inseminacionString);
    createField('Causa Aborto', evento.causaAborto);
    createField('Causa Celo', evento.causaCelo);
    createField('Especifique Secado', evento.especifiqueSecado);
    createField('Motivo Venta', evento.motivoVenta);
    createField('Causa Rechazo', evento.causaRechazo);
    createField('Especifique Otro', evento.especifiqueOtro);

    // Limpiar el contenido actual del modal y agregar el fragmento
    modalBody.innerHTML = '';
    modalBody.appendChild(fragment);

    // Mostrar el modal
    $('#modalDetalles').modal('show');
}


$(document).ready(function () {
    // Al seleccionar un animal en el dropdown, actualizar el estado del animal en el modal
    $('#AnimalID').change(function () {
        var animalID = $(this).val();
        if (animalID) {
            $.ajax({
                url: '/Eventos/ObtenerEstadoAnimal', // Reemplaza con la URL correcta
                type: 'GET',
                data: { id: animalID },
                success: function (response) {
                    $('#EstadoAnimal').val(response.estadoAnimal);
                },
                error: function () {
                    $('#EstadoAnimal').val('Error al obtener el estado.');
                }
            });
        } else {
            $('#EstadoAnimal').val('');
        }
    });
});