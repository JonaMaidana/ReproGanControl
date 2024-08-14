window.onload = ListadoEstados();

let currentPageEstados = 1;
const itemsPerPageEstados = 4;
let estadosMostrar = [];

function ListadoEstados() {
    $.ajax({
        url: '../../Estados/ListadoEstados',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $("#modalEstado").modal("hide");
            LimpiarModalEstado();
            estadosMostrar = data;
            updateTotalItemsEstados();
            renderTableEstados(currentPageEstados);
            renderPaginationEstados();
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado de estados');
        }
    });
}

function renderTableEstados(page) {
    const start = (page - 1) * itemsPerPageEstados;
    const end = start + itemsPerPageEstados;
    const paginatedData = estadosMostrar.slice(start, end);
    let contenidoTabla = ``;

    $.each(paginatedData, function (index, estado) {  
        contenidoTabla += `
        <tr>
            <td>${estado.descripcion}</td>
            <td class="text-center">
                <button type="button" class="edit-button" onclick="ModalEditarEstado(${estado.estadoID})">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
            </td>
            <td class="text-center">
                <button type="button" class="delete-button" onclick="EliminarEstado(${estado.estadoID})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById("tbody-estados").innerHTML = contenidoTabla;
}

function renderPaginationEstados() {
    const pageCount = Math.ceil(estadosMostrar.length / itemsPerPageEstados);
    let paginationHtml = '';

    for (let i = 1; i <= pageCount; i++) {
        paginationHtml += `
        <li class="page-item ${i === currentPageEstados ? 'active' : ''}">
            <a class="page-link" href="#" onclick="goToPageEstados(${i})">${i}</a>
        </li>
        `;
    }

    document.getElementById("pagination-estados").innerHTML = paginationHtml;
}

function goToPageEstados(page) {
    currentPageEstados = page;
    renderTableEstados(currentPageEstados);
    renderPaginationEstados();
}

function updateTotalItemsEstados() {
    const totalItems = estadosMostrar.length;
    document.getElementById("total-items-estados").textContent = `Estados cargados: ${totalItems}`;
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