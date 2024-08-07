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
                    <button type="button" class="edit-button" onclick="ModalEditarEstado(${estado.estadoID})">
                    Editar</i>
                    </button>
                    </td>
                    <td class="text-center">
                    <button type="button" class="delete-button" onclick="EliminarEstado(${estado.estadoID})">
                    Eliminar</i>
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
            if (resultado.exito) {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: resultado.mensaje
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: resultado.mensaje
                });
            }
            ListadoEstados();
        },
        error: function (xhr, status) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Disculpe, existió un problema al guardar el estado.'
            });
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
            if (resultado.exito) {
                Swal.fire({
                    title: 'Éxito',
                    text: 'El estado se eliminó correctamente.',
                    icon: 'success'
                }).then(() => {
                    ListadoEstados();
                });
            } else if (resultado.exito === false) {
                Swal.fire({
                    title: 'Error',
                    text: 'No se puede eliminar el estado porque está en uso.',
                    icon: 'error'
                });
            }
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