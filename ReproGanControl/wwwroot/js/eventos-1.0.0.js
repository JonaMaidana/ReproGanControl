window.onload = ListadoEventos;

let eventosMostrar = [];

function ListadoEventos() {
    let buscarTipoEventoID = document.getElementById("BuscarTipoEventoID").value;
    let fechaDesde = document.getElementById("FechaDesde").value;
    let fechaHasta = document.getElementById("FechaHasta").value;
    $.ajax({
        url: '../../Eventos/ListadoEventos',  // Asegúrate de que esta ruta sea correcta
        type: 'GET',
        data: {
            BuscarTipoEventoID: buscarTipoEventoID,
            FechaDesde: fechaDesde,
            FechaHasta: fechaHasta
        },
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

// Definir una variable global para almacenar los datos
let eventosMostrarGlobal = [];

function renderTableEventos() {
    eventosMostrarGlobal = eventosMostrar; // Almacenar datos globalmente
    let contenidoTabla = '';

    console.log('Eventos a mostrar:', eventosMostrar); // Verifica los datos

    $.each(eventosMostrar, function (index, evento) {
        contenidoTabla += `
        <tr>
            <td>${evento.animalCaravana}</td>
            <td>${evento.tipoEventoString}</td>
            <td class="ocultar-en-768px">${evento.fechaEventoString}</td>
            <td class="ocultar-en-768px">${evento.observacion}</td> 
            <td class="ocultar-en-768px">${evento.tipoParto || ''}</td>
            <td class="ocultar-en-768px">${evento.tipoCriaString || ''}</td>
            <td class="ocultar-en-768px">${evento.estadoCriaString || ''}</td>
            <td class="ocultar-en-768px">${evento.fechaAproximadaSecadoString || ''}</td>
            <td class="ocultar-en-768px">${evento.fechaAproximadaParicionString || ''}</td>
            <td class="ocultar-en-768px">${evento.toroString || ''}</td>
            <td class="ocultar-en-768px">${evento.tipoInseminacionString || ''}</td>
            <td class="ocultar-en-768px">${evento.detalleToro || ''}</td>
            <td class="ocultar-en-768px">${evento.causaAborto || ''}</td>
            <td class="ocultar-en-768px"d>${evento.motivoVenta || ''}</td>
            <td class="ocultar-en-768px">${evento.causaRechazo || ''}</td> 
            <td class="ocultar-en-768px">${evento.motivoMuerte || ''}</td>
            <td class="ocultar-en-768px">${evento.especifiqueOtro || ''}</td>

            <td class="text-center">
                <button type="button" class="edit-button" title="Editar Evento"  onclick="ModalEditarEventos(${evento.eventoID})">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button type="button" class="delete-button" title="Eliminar Evento"  onclick="EliminarEventos(${evento.eventoID})">
                    <i class="fa-solid fa-trash"></i>
                </button>
                <button type="button" class="info-button" title="Ver detalles del evento" onclick="showEventDetails(${evento.eventoID})">
                    <i class="fa-solid fa-info-circle"></i>
                </button>
            </td>
        </tr>
        `;
    });

    $("#tbody-eventos").html(contenidoTabla);
}

// Función para mostrar detalles en un modal
function showEventDetails(eventoID) {
    // Encuentra el evento con el ID dado en la variable global
    const evento = eventosMostrarGlobal.find(e => e.eventoID === eventoID);

    // Crea el contenido para el modal
    const modalContent = `
        <h5>Detalles del Evento</h5>
        <ul>
            <li><strong>Caravana:</strong> ${evento.animalCaravana}</li>
            <li><strong>Tipo Evento:</strong> ${evento.tipoEventoString}</li>
            <li><strong>Fecha Evento:</strong> ${evento.fechaEventoString}</li>
            <li><strong>Observación:</strong> ${evento.observacion}</li>
            <li><strong>Tipo Cría:</strong> ${evento.tipoParto || 'N/A'}</li>
            <li><strong>Tipo Cría:</strong> ${evento.tipoCriaString || 'N/A'}</li>
            <li><strong>Tipo Cría:</strong> ${evento.estadoCriaString || 'N/A'}</li>
            <li><strong>Tipo Cría:</strong> ${evento.fechaAproximadaSecadoString || 'N/A'}</li>
            <li><strong>Tipo Parto:</strong> ${evento.fechaAproximadaParicionString || 'N/A'}</li>
            <li><strong>Estado Cría:</strong> ${evento.causaAborto || 'N/A'}</li>
            <li><strong>Inseminación:</strong> ${evento.tipoInseminacionString || 'N/A'}</li>
            <li><strong>Causa Aborto:</strong> ${evento.toroID || 'N/A'}</li>
            <li><strong>Causa Celo:</strong> ${evento.detalleToro || 'N/A'}</li>
            <li><strong>Especifique Secado:</strong> ${evento.motivoVenta || 'N/A'}</li>
            <li><strong>Motivo Venta:</strong> ${evento.causaRechazo || 'N/A'}</li>
            <li><strong>Causa Rechazo:</strong> ${evento.motivoMuerte || 'N/A'}</li>
            <li><strong>Especifique Otro:</strong> ${evento.especifiqueOtro || 'N/A'}</li>
        </ul>
    `;

    // Asigna el contenido al modal
    document.getElementById("modalContentEventos").innerHTML = modalContent;

    // Muestra el modal
    var myModal = new bootstrap.Modal(document.getElementById('eventosModal'));
    myModal.show();
}


function GuardarEvento() {
    // Recopilar datos del formulario
    let eventoID = document.getElementById("EventoID").value; // Cambia esto según tu estructura HTML
    let animalID = document.getElementById("AnimalID").value;
    let tipoEvento = document.getElementById("TipoEvento").value; // Suponiendo que tienes un dropdown para tipo de evento
    let fechaEvento = document.getElementById("FechaEvento").value;
    let observacion = document.getElementById("Observacion").value;
    let tipoCria = document.getElementById("TipoCria").value; // Si es un dropdown
    let tipoParto = document.getElementById("TipoParto").value;
    let estadoCria = document.getElementById("EstadoCria").value; // Suponiendo que es un dropdown
    let fechaAproximadaSecado = document.getElementById("FechaAproximadaSecado").value;
    let fechaAproximadaParicion = document.getElementById("FechaAproximadaParicion").value;
    let causaAborto = document.getElementById("CausaAborto").value;
    let tipoInseminacion = document.getElementById("TipoInseminacion").value; // Si es un dropdown
    let toroID = document.getElementById("ToroID").value;
    let detalleToro = document.getElementById("DetalleToro").value;
    let motivoVenta = document.getElementById("MotivoVenta").value;
    let motivoMuerte = document.getElementById("MotivoMuerte").value;
    let causaRechazo = document.getElementById("CausaRechazo").value;
    let especifiqueOtro = document.getElementById("EspecifiqueOtro").value;

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
            fechaAproximadaSecado: fechaAproximadaSecado,
            fechaAproximadaParicion: fechaAproximadaParicion,
            causaAborto: causaAborto,
            tipoInseminacion: tipoInseminacion,
            toroID: toroID,
            detalleToro: detalleToro,
            motivoVenta: motivoVenta,
            motivoMuerte: motivoMuerte,
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
                $("#EventoID").val(evento.eventoID);
                $("#AnimalID").val(evento.animalID);
                $("#TipoEvento").val(evento.tipoEvento);

                // Formatear la fecha
                let fechaEvento = new Date(evento.fechaEvento);
                let fechaFormato = fechaEvento.toISOString().split('T')[0];
                $("#FechaEvento").val(fechaFormato);
                $("#Observacion").val(evento.observacion);

                // Mostrar los campos correspondientes
                mostrarCamposPorTipoEvento();

                // Asignar valores a los campos de acuerdo al tipo de evento
                switch (evento.tipoEvento) {
                    case 1: // Parto
                        $("#TipoParto").val(evento.tipoParto || "");
                        $("#TipoCria").val(evento.tipoCria || "").trigger("change"); // Para dropdowns
                        $("#EstadoCria").val(evento.estadoCria || "").trigger("change");
                        break;
                    case 2: // Preñez
                        // Asignar valores específicos si es necesario
                        break;
                    case 3: // Aborto
                        $("#CausaAborto").val(evento.causaAborto || "");
                        break;
                    case 4: // Servicio
                        $("#TipoInseminacion").val(evento.tipoInseminacion || "").trigger("change");
                        $("#ToroID").val(evento.toroID || "").trigger("change");
                        $("#DetalleToro").val(evento.detalleToro || "");
                        break;
                    case 7: // Venta
                        $("#MotivoVenta").val(evento.motivoVenta || "");
                        break;
                    case 8: // Rechazo
                        $("#CausaRechazo").val(evento.causaRechazo || "");
                        break;
                    case 9: // Muerte
                        $("#MotivoMuerte").val(evento.motivoMuerte || "");
                        break;
                    case 10: // Otro
                        $("#EspecifiqueOtro").val(evento.especifiqueOtro || "");
                        break;
                    default:
                        break;
                }

                // Cambiar el título del modal a "Editar Evento"
                $("#ModalTituloEvento").text("Editar Evento");

                // Mostrar el modal
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

    // Restablecer los valores de los DropDownList a 'Seleccione'
    document.querySelector("#TipoCria").value = 0; // Mantener la opción 'Seleccione'
    document.querySelector("#EstadoCria").value = 0; // Mantener la opción 'Seleccione'
    document.querySelector("#TipoInseminacion").value = 0; // Mantener la opción 'Seleccione'
    document.querySelector("#ToroID").value = 0; // Mantener la opción 'Seleccione'

    // Limpiar los campos input específicos
    const campos = [
        'TipoParto', 'CausaAborto', "divPreñezFechSecado",
        'MotivoMuerte', 'DetalleToro', "divPreñezFechParicion",
        'MotivoVenta', 'CausaRechazo', 'EspecifiqueOtro'
    ];

    campos.forEach(campo => {
        const elemento = document.querySelector(`#${campo}`);
        if (elemento) {
            elemento.value = ""; // Limpia el valor del campo <input> o <textarea>
        }
    });

    // Ocultar TODOS los campos dinámicos
    const divCampos = [
        "divTipoParto", "divTipoCria", "divEstadoCria",
        "divPreñezFechSecado", "divPreñezFechParicion",
        "divCausaAborto", "divTipoInseminacion", "divToroID",
        "divDetalleToro", "divMotivoVenta", "divCausaRechazo",
        "divMotivoMuerte", "divEspecifiqueOtro"
    ];

    divCampos.forEach(divCampo => {
        const divElemento = document.querySelector(`#${divCampo}`);
        if (divElemento) {
            divElemento.style.display = 'none'; // Ocultar los divs dinámicos
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
            "divTipoParto", "divTipoCria", "divEstadoCria",
            "divPreñezFechSecado", "divPreñezFechParicion",
            "divCausaAborto", "divTipoInseminacion", "divToroID",
            "divDetalleToro", "divMotivoVenta", "divCausaRechazo",
            "divMotivoMuerte", "divEspecifiqueOtro"
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
        case '2': // Preñez
            document.querySelector("#divPreñezFechSecado").style.display = "block";
            document.querySelector("#divPreñezFechParicion").style.display = "block";
            break;
        case '3': // Aborto
            document.querySelector("#divCausaAborto").style.display = "block";
            break;
        case '4': // Servicio
            document.querySelector("#divTipoInseminacion").style.display = "block";

            // Mostrar campo Toro o Detalle del Toro dependiendo del tipo de inseminación
            const tipoInseminacion = document.querySelector("#TipoInseminacion").value;
            if (tipoEvento === '4' && tipoInseminacion === '1') { // Servicio y Monta
                document.querySelector("#divToroID").style.display = "block";
                document.querySelector("#divDetalleToro").style.display = "none";
            } else if (tipoEvento === '4' && tipoInseminacion === '2') { // Servicio y Artificial
                document.querySelector("#divToroID").style.display = "none";
                document.querySelector("#divDetalleToro").style.display = "block";
            } else {
                document.querySelector("#divToroID").value = "0"; // Limpiar el valor del campo ToroID
                document.querySelector("#divToroID").style.display = "none";
            }
            break;
        case '7': // Venta
            document.querySelector("#divMotivoVenta").style.display = "block";
            break;
        case '8': // Rechazo
            document.querySelector("#divCausaRechazo").style.display = "block";
            break;
        case '9': // Muerte
            document.querySelector("#divMotivoMuerte").style.display = "block";
            break;
        case '10': // Otro
            document.querySelector("#divEspecifiqueOtro").style.display = "block";
            break;
        default:
            // Ningún campo específico es requerido para otros tipos de eventos
            break;
    }

    // Actualizar la visibilidad del campo ToroID y divDetalleToro cuando cambia el tipo de inseminación
    const tipoInseminacionElement = document.querySelector("#TipoInseminacion");
    tipoInseminacionElement.addEventListener("change", () => {
        const tipoInseminacionValue = tipoInseminacionElement.value;
        if (tipoEvento === '4' && tipoInseminacionValue === "1") { // Servicio y Monta
            document.querySelector("#divToroID").style.display = "block";
            document.querySelector("#divDetalleToro").style.display = "none";
        } else if (tipoEvento === '4' && tipoInseminacionValue === "2") { // Servicio y Artificial
            document.querySelector("#divToroID").style.display = "none";
            document.querySelector("#divDetalleToro").style.display = "block";
        } else {
            document.querySelector("#divToroID").value = "0"; // Limpiar el valor del campo ToroID
            document.querySelector("#divToroID").style.display = "none";
            document.querySelector("#divDetalleToro").value = ""; // Limpiar el valor del campo DetalleToro
            document.querySelector("#divDetalleToro").style.display = "none";
        }
    });
}