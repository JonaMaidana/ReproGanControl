window.onload = ListadoInformeEventos();


function ListadoInformeEventos() {
    // let buscarActividadInicio = document.getElementById("BuscarActividadInicio").value;
    // let buscarActividadFin = document.getElementById("BuscarActividadFin").value;
    // let tipoEjerciciosBuscarID = document.getElementById('TipoEjerciciosBuscarID').value;
    $.ajax({
        url: '../../Eventos/ListadoInformeEventos',
        data: {
            // TipoEjerciciosBuscarID: tipoEjerciciosBuscarID,
            // BuscarActividadInicio: buscarActividadInicio,
            // BuscarActividadFin: buscarActividadFin,
        },
        type: 'POST',
        dataType: 'json',

        success: function (vistaInformeEventos) {
            let contenidoTabla = ``;

            $.each(vistaInformeEventos, function (Index, Eventos) {
                contenidoTabla += `
                <tr>
                    <td class="text-center">${Eventos.tipoEventoString}</td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                </tr>
                `;

                $.each(Eventos.vistaEventos, function (index, Evento) {
                    contenidoTabla += `
                <tr>
                    <td class="text-center"></td>
                    <td class="text-center">${Evento.animalCaravana}</td>
                    <td class="text-center">${Evento.estadoAnimal}</td>
                    <td class="text-center">${Evento.fechaEventoString}</td>
                    <td class="text-center">${Evento.observacion}</td>
                    <td class="text-center">${Evento.tipoParto || ''}</td>
                    <td class="text-center">${Evento.tipoCriaString || ''}</td>
                    <td class="text-center">${Evento.estadoCriaString || ''}</td>
                    <td class="text-center">${Evento.inseminacionString || ''}</td>
                    <td class="text-center">${Evento.causaAborto || ''}</td>
                    <td class="text-center">${Evento.causaCelo || ''}</td>
                    <td class="text-center">${Evento.especifiqueSecado || ''}</td>
                    <td class="text-center">${Evento.motivoVenta || ''}</td>
                    <td class="text-center">${Evento.causaRechazo || ''}</td>
                    <td class="text-center">${Evento.especifiqueOtro || ''}</td>
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