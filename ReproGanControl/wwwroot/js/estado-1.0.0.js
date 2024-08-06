window.onload = ListadoEstados();

function ListadoEstados() {

    $.ajax({
        url: '../../Estados/ListadoEstados',
        data: {},
        type: 'GET',
        dataType: 'json',

        success: function (estados) {

            $("#modalEstado").modal("hide");
            LimpiarModalEstado();

            let contenidoTabla = ``;

            $.each(estados, function (index, estado) {

                contenidoTabla += `
                <tr>
                    <td>${estado.descripcion}</td>
                    <td class="text-center">
                    <button type="button" class="btn btn-success btn-sm" onclick="ModalEditarEstado(${estado.estadoID})">
                    <i class="fa-solid fa-marker">Editar</i>
                    </button>
                    </td>
                    <td class="text-center">
                    <button type="button" class="btn btn-danger btn-sm" onclick="EliminarEstado(${estado.estadoID})">
                    <i class="fa-solid fa-trash">Eliminar</i>
                    </button>
                    </td>
                </tr>
             `;

            });

            document.getElementById("tbody-estados").innerHTML = contenidoTabla;

        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado de estados');
        }
    });
}

function GuardarEstado() {

    let estadoID = document.getElementById("EstadoID").value;
    let descripcion = document.getElementById("Descripcion").value;

    $.ajax({

        url: '../../Estados/GuardarEstados',
        data: {
            estadoID: estadoID,
            descripcion: descripcion
        },
        type: 'POST',
        dataType: 'json',

        success: function (resultado) {

            if (resultado != "") {
                alert(resultado);
            }
            ListadoEstados();
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al guardar el estado');
        }
    });
}

function ModalEditarEstado(estadoID) {

    $.ajax({
        url: '../../Estados/ListadoEstados',
        data: { id: estadoID },
        type: 'POST',
        dataType: 'json',
        success: function (estados) {
            let estado = estados[0];

            document.getElementById("EstadoID").value = estadoID;
            $("#tituloEstado").text("Editar Estado");
            document.getElementById("Descripcion").value = estado.descripcion;
            $("#modalEstado").modal("show");
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el estado para ser modificado.');
        }
    });
}

function EliminarEstado(estadoID) {
    $.ajax({

        url: '../../Estados/EliminarEstados',
        data: { estadoID: estadoID },
        type: 'POST',
        dataType: 'json',

        success: function (resultado) {
            if (!resultado) {
                alert("");
            }
            ListadoEstados();
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al eliminar el estado.');
        }
    });
}

function LimpiarModalEstado() {
    document.getElementById("EstadoID").value = 0;
    document.getElementById("Descripcion").value = "";
}

function NuevoTituloEstado() {
    $("#tituloEstado").text("Nuevo Estados");
}