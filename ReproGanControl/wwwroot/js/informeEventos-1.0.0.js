// Definir una variable global para almacenar los datos
let vistaInformeEventosGlobal = [];

window.onload = ListadoInformeEventos;

function ListadoInformeEventos() {
    let tipoEventoBuscarID = document.getElementById("TipoEventoBuscarID").value;
    $.ajax({
        url: '../../Eventos/ListadoInformeEventos',
        data: { TipoEventoBuscarID: tipoEventoBuscarID },
        type: 'POST',
        dataType: 'json',

        success: function (vistaInformeEventos) {
            vistaInformeEventosGlobal = vistaInformeEventos; // Almacenar datos globalmente
            let contenidoTabla = ``;

            $.each(vistaInformeEventos, function (Index, Eventos) {
                contenidoTabla += `
                <tr>
                    <td class="text-center">${Eventos.tipoEventoString}</td>
                    <td class="text-center"></td>
                    <td class="ocultar-en-768px" class="text-center"></td>
                    <td class="ocultar-en-768px" class="text-center"></td>
                    <td class="ocultar-en-768px" class="text-center"></td>
                    <td class="text-center">
                        <button type="button" class="info-button" onclick="showEventDetails(${Eventos.tipoEventoID})">
                            <i class="fa-solid fa-info-circle"></i>
                        </button>
                    </td>
                </tr>
                `;

                $.each(Eventos.vistaEventos, function (index, Evento) {
                    contenidoTabla += `
                    <tr>
                        <td class="text-center"></td>
                        <td class="text-center">${Evento.animalCaravana}</td>
                        <td class="ocultar-en-768px" class="text-center">${Evento.fechaEventoString}</td>
                        <td class="ocultar-en-768px" class="text-center">${Evento.observacion}</td>
                        <td class="text-center"></td>
                    </tr>
                    `;
                });
            });
            document.getElementById("tbody-informeEventos").innerHTML = contenidoTabla;
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado :(');
        }
    });
}

function showEventDetails(tipoEventoID) {
    // Encuentra el evento con el ID dado en la variable global
    const evento = vistaInformeEventosGlobal.find(e => e.tipoEventoID === tipoEventoID);

    // Crea el contenido para el modal
    const modalContent = `
        <h5>${evento.tipoEventoString}</h5>
        <ul>
            ${evento.vistaEventos.map(e => `
                <li>
                    <strong>Caravana:</strong> ${e.animalCaravana}<br>
                    <strong>Fecha del Evento:</strong> ${e.fechaEventoString}<br>
                    <strong>Observación:</strong> ${e.observacion}
                </li>
            `).join('')}
        </ul>
    `;

    // Asigna el contenido al modal
    document.getElementById("modalContentInformeEventos").innerHTML = modalContent;

    // Muestra el modal
    var myModal = new bootstrap.Modal(document.getElementById('informeEventosModal'));
    myModal.show();
}
