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
                        <button type="button" class="btn btn-success btn-sm" onclick="ModalEditarEventos(${evento.eventoID})">
                            <i class="fa-solid fa-marker">Editar</i>
                        </button>
                    </td>
                    <td class="text-center">
                        <button type="button" class="btn btn-danger btn-sm" onclick="EliminarEventos(${evento.eventoID})">
                            <i class="fa-solid fa-trash">Eliminar</i>
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
            if(resultado != ""){
                alert(resultado);
            }
            ListadoEventos();
        },
        error: function (xhr, status) {
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

function EliminarEventos(eventoID){
    $.ajax({
        url: '../../Eventos/EliminarEvento',
        data: { eventoID: eventoID},
        type: 'POST',
        dataType: 'json',

        success: function (resultado) {           
            ListadoEventos();
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al eliminar el evento.');
        }
    });    

}