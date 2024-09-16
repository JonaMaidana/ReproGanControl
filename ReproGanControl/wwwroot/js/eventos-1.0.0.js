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
            <td>${evento.estadoAnimal}</td>
            <td>${evento.tipoEventoString}</td>
            <td>${evento.fechaEventoString}</td>
            <td>${evento.observacion}</td>
            <td class="text-center">
                <button type="button" class="show-details-button" onclick="mostrarDetalles(${index})">
                    Mostrar detalles
                </button>
            </td>
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

    document.getElementById("tbody-eventos").innerHTML = contenidoTabla;
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
    $('#modalDetalles').modal('show');
}

function updateTotalItemsEventos() {
    const totalItems = eventosMostrar.length;
    document.getElementById("total-items-eventos").textContent = `Eventos cargados: ${totalItems}`;
}

function LimpiarModalEvento() {

    document.getElementById("AnimalID").value = 0;
    document.getElementById("TipoEvento").value = 0;
    document.getElementById("Observacion").value = "";

    // Ocultar todos los campos específicos de tipo de evento
    document.getElementById('divTipoParto').style.display = 'none';
    document.getElementById('divTipoCria').style.display = 'none';
    document.getElementById('divEstadoCria').style.display = 'none';
    document.getElementById('divCausaAborto').style.display = 'none';
    document.getElementById('divInseminacion').style.display = 'none';
    document.getElementById('divCausaCelo').style.display = 'none';
    document.getElementById('divEspecifiqueSecado').style.display = 'none';
    document.getElementById('divMotivoVenta').style.display = 'none';
    document.getElementById('divCausaRechazo').style.display = 'none';
    document.getElementById('divEspecifiqueOtro').style.display = 'none';

    // Limpiar campos específicos
    document.getElementById('TipoParto').value = '';
    document.getElementById('TipoCria').value = ''; // Para los campos de tipo bool, puedes usar ''
    document.getElementById('EstadoCria').value = '';
    document.getElementById('CausaAborto').value = '';
    document.getElementById('Inseminacion').value = '';  // Para los campos de tipo bool, debes resetear el estado
    document.getElementById('CausaCelo').value = '';
    document.getElementById('EspecifiqueSecado').value = '';
    document.getElementById('MotivoVenta').value = '';
    document.getElementById('CausaRechazo').value = '';
    document.getElementById('EspecifiqueOtro').value = '';

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

function GuardarEvento() {
    let eventoID = document.getElementById("EventoID").value;
    let animalID = document.getElementById("AnimalID").value;
    let tipoEvento = document.getElementById("TipoEvento").value;
    let fechaEvento = document.getElementById("FechaEvento").value;
    let observacion = document.getElementById("Observacion").value;

    // Capturar campos específicos según el tipo de evento
    let tipoCria = document.getElementById("TipoCria").value === "" ? null : (document.getElementById("TipoCria").value === "true");
    let tipoParto = document.getElementById("TipoParto") ? document.getElementById("TipoParto").value : null;
    let estadoCria = document.getElementById("EstadoCria").value === "" ? null : (document.getElementById("EstadoCria").value === "true");
    let causaAborto = document.getElementById("CausaAborto") ? document.getElementById("CausaAborto").value : null;
    let inseminacion = document.getElementById("Inseminacion").value === "" ? null : (document.getElementById("Inseminacion").value === "true");
    let causaCelo = document.getElementById("CausaCelo") ? document.getElementById("CausaCelo").value : null;
    let especifiqueSecado = document.getElementById("EspecifiqueSecado") ? document.getElementById("EspecifiqueSecado").value : null;
    let motivoVenta = document.getElementById("MotivoVenta") ? document.getElementById("MotivoVenta").value : null;
    let causaRechazo = document.getElementById("CausaRechazo") ? document.getElementById("CausaRechazo").value : null;
    let especifiqueOtro = document.getElementById("EspecifiqueOtro") ? document.getElementById("EspecifiqueOtro").value : null;

    // Verificar si alguno de los campos requeridos está vacío  
    if (!animalID || !tipoEvento || !fechaEvento) {
        Swal.fire({
            icon: 'error',
            title: 'Campos Incompletos',
            text: 'Faltan campos. Por favor, completa los campos requeridos para guardar el evento.'
        });
        return; // Salir de la función si falta algún campo
    }

    // Preparar los datos para enviar
    let datosEvento = {
        eventoID: eventoID,
        animalID: animalID,
        tipoEvento: tipoEvento,
        fechaEvento: fechaEvento,
        observacion: observacion,
        tipoCria: tipoEvento == 1 ? tipoCria : null, // Solo si es Parto
        tipoParto: tipoEvento == 1 ? tipoParto : null, // Solo si es Parto
        estadoCria: tipoEvento == 1 ? estadoCria : null, // Solo si es Parto
        causaAborto: tipoEvento == 2 ? causaAborto : null, // Solo si es Aborto
        inseminacion: tipoEvento == 3 ? inseminacion : null, // Solo si es Servicio
        causaCelo: tipoEvento == 4 ? causaCelo : null, // Solo si es Celo
        especifiqueSecado: tipoEvento == 5 ? especifiqueSecado : null, // Solo si es Secado
        motivoVenta: tipoEvento == 6 ? motivoVenta : null, // Solo si es Venta
        causaRechazo: tipoEvento == 7 ? causaRechazo : null, // Solo si es Rechazo
        especifiqueOtro: tipoEvento == 8 ? especifiqueOtro : null // Solo si es Otro
    };

    // Si todos los campos están completos, proceder con la solicitud AJAX
    $.ajax({
        url: '../../Eventos/GuardarEventos',
        data: datosEvento,
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

function ModalEditarEventos(eventoID) {
    $.ajax({
        url: '../../Eventos/ListadoEventos',
        data: { id: eventoID },
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            if (response && response.length > 0) {
                let evento = response[0];

                // Cargar datos principales
                document.getElementById("EventoID").value = evento.eventoID;
                document.getElementById("AnimalID").value = evento.animalID;
                document.getElementById("TipoEvento").value = evento.tipoEvento;

                let fechaEvento = new Date(evento.fechaEvento);
                let fechaFormato = fechaEvento.toISOString().split('T')[0];
                document.getElementById("FechaEvento").value = fechaFormato;

                document.getElementById("Observacion").value = evento.observacion;

                // Configurar campos específicos
                switch (evento.tipoEvento) {
                    case 1: // Parto
                        document.getElementById("TipoCria").value = evento.tipoCria !== null ? evento.tipoCria.toString() : "";
                        document.getElementById("TipoParto").value = evento.tipoParto || "";
                        document.getElementById("EstadoCria").value = evento.estadoCria !== null ? evento.estadoCria.toString() : "";
                        break;
                    case 2: // Aborto
                        document.getElementById("CausaAborto").value = evento.causaAborto || "";
                        break;
                    case 3: // Servicio
                        document.getElementById("Inseminacion").value = evento.inseminacion !== null ? evento.inseminacion.toString() : "";
                        break;
                    case 4: // Celo
                        document.getElementById("CausaCelo").value = evento.causaCelo || "";
                        break;
                    case 5: // Secado
                        document.getElementById("EspecifiqueSecado").value = evento.especifiqueSecado || "";
                        break;
                    case 6: // Venta
                        document.getElementById("MotivoVenta").value = evento.motivoVenta || "";
                        break;
                    case 7: // Rechazo
                        document.getElementById("CausaRechazo").value = evento.causaRechazo || "";
                        break;
                    case 8: // Otro
                        document.getElementById("EspecifiqueOtro").value = evento.especifiqueOtro || "";
                        break;
                }

                // Llamar a la función para mostrar campos específicos
                mostrarCamposPorTipoEvento();

                $("#ModalTituloEvento").text("Editar Evento");
                $("#ModalEvento").modal("show");

                // Log de datos cargados para depuración
                console.log("Datos cargados en el formulario:", {
                    eventoID: evento.eventoID,
                    animalID: evento.animalID,
                    tipoEvento: evento.tipoEvento,
                    fechaEvento: fechaFormato,
                    observacion: evento.observacion,
                    causaAborto: evento.causaAborto
                });
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
    var tipoEvento = document.getElementById("TipoEvento").value;
    console.log('Tipo de Evento Seleccionado:', tipoEvento); // Log del tipo de evento

    // Ocultar todos los campos específicos al inicio
    document.getElementById("divTipoParto").style.display = "none";
    document.getElementById("divTipoCria").style.display = "none";
    document.getElementById("divEstadoCria").style.display = "none";
    document.getElementById("divCausaAborto").style.display = "none";
    document.getElementById("divInseminacion").style.display = "none";
    document.getElementById("divCausaCelo").style.display = "none";
    document.getElementById("divEspecifiqueSecado").style.display = "none";
    document.getElementById("divMotivoVenta").style.display = "none";
    document.getElementById("divCausaRechazo").style.display = "none";
    document.getElementById("divEspecifiqueOtro").style.display = "none";

    // Mostrar solo el campo correspondiente al evento seleccionado
    switch (tipoEvento) {
        case '1': // Parto
            document.getElementById("divTipoParto").style.display = "block";
            document.getElementById("divTipoCria").style.display = "block";
            document.getElementById("divEstadoCria").style.display = "block";
            break;
        case '2': // Aborto
            document.getElementById("divCausaAborto").style.display = "block";
            break;
        case '3': // Servicio
            document.getElementById("divInseminacion").style.display = "block";
            break;
        case '4': // Celo
            document.getElementById("divCausaCelo").style.display = "block";
            break;
        case '5': // Secado
            document.getElementById("divEspecifiqueSecado").style.display = "block";
            break;
        case '6': // Venta
            document.getElementById("divMotivoVenta").style.display = "block";
            break;
        case '7': // Rechazo
            document.getElementById("divCausaRechazo").style.display = "block";
            break;
        case '8': // Otro
            document.getElementById("divEspecifiqueOtro").style.display = "block";
            break;
        default:
            // Ningún campo específico es requerido para otros tipos de eventos
            break;
    }
}


// $(document).ready(function () {
//     // Al seleccionar un animal en el dropdown, actualizar el estado del animal en el modal
//     $('#AnimalID').change(function () {
//         var animalID = $(this).val();
//         if (animalID) {
//             $.ajax({
//                 url: '/Eventos/ObtenerEstadoAnimal', // Reemplaza con la URL correcta
//                 type: 'GET',
//                 data: { id: animalID },
//                 success: function (response) {
//                     $('#EstadoAnimal').val(response.estadoAnimal);
//                 },
//                 error: function () {
//                     $('#EstadoAnimal').val('Error al obtener el estado.');
//                 }
//             });
//         } else {
//             $('#EstadoAnimal').val('');
//         }
//     });
// });