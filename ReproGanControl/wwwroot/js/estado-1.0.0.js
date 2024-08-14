window.onload = ListadoEstados();

function ListadoEstados() {
    $.ajax({
        url: '../../Estados/ListadoEstados',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $("#modalEstado").modal("hide");
            LimpiarModalEstado();
            estadosMostrar = data;
            renderCardEstados(); // Renderizar como cards
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado de estados');
        }
    });
}

function renderCardEstados() {
    let contenidoCards = '';

    $.each(estadosMostrar, function (index, estado) {
        const colors = ['custom-card-bg-blue', 'custom-card-bg-green', 'custom-card-bg-orange', 'custom-card-bg-cherry'];
        const cardClass = colors[index % colors.length];

        contenidoCards += `
                <div class="col-xl-3 col-lg-4 col-md-6 mb-4">
                    <div class="card special-card ${cardClass} card-small" data-id="${estado.estadoID}">
                        <div class="card-statistic p-3 d-flex align-items-center">
                            <div class="card-icon card-icon-large me-4">
                                <img src="/img/estado.png" alt="Pezuna" class="icon-image"/>
                            </div>
                            <div class="flex-grow-1">
                                <h5 class="card-title mb-0">${estado.descripcion}</h5>
                            </div>
                            <div class="d-flex flex-column align-items-end ms-3" style="z-index: 1;">
                                <button class="btn btn-outline-light btn-icon btn-sm mb-1" onclick="ModalEditarEstado(${estado.estadoID})">
                                    <i class="fa-regular fa-pen-to-square icon-size"></i>
                                </button>
                                <button class="btn btn-outline-light btn-icon btn-sm" onclick="EliminarEstado(${estado.estadoID})">
                                    <i class="fa-solid fa-trash-can icon-size"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
    });

    document.getElementById("contenedor-estados").innerHTML = contenidoCards;
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
                    position: 'bottom', // Posición en la parte inferior central
                    icon: 'success',
                    title: '¡Guardado exitosamente!',
                    showConfirmButton: false,
                    timer: 500, // Temporizador reducido a 500 ms
                    toast: true, // Hace que la alerta sea más pequeña y tipo "toast"
                }).then(() => {
                    ListadoEstados(); // Actualiza el listado
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: resultado.mensaje,
                });
            }
        },
        error: function (xhr, status) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Disculpe, existió un problema al guardar el estado.',
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
                url: '../../Estados/EliminarEstados',
                data: { estadoID: estadoID },
                type: 'POST',
                dataType: 'json',
                success: function (resultado) {
                    if (resultado.exito) {
                        Swal.fire({
                            position: 'bottom', // Posición en la parte inferior central
                            icon: 'success',
                            title: '¡Eliminado exitosamente!',
                            showConfirmButton: false,
                            timer: 1500,
                            toast: true, // Hace que la alerta sea más pequeña y tipo "toast"
                        }).then(() => {
                            ListadoEstados(); // Actualiza el listado de estados
                        });
                    } else if (resultado.exito === false) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No se puede eliminar el estado porque está en uso.',
                        });
                    }
                },
                error: function (xhr, status) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Disculpe, existió un problema al eliminar el estado.',
                    });
                }
            });
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