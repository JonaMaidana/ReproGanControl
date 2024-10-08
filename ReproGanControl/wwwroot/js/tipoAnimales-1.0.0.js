window.onload = ListadoTipoAnimal();

function ListadoTipoAnimal() {
    $.ajax({
        url: '../../TipoAnimales/ListadoTipoAnimal',
        data: {},
        type: 'GET',
        dataType: 'json',

        success: function (tipoDeAnimales) {
            $("#modalTipoAnimal").modal("hide");
            LimpiarModalTipoAnimal();

            let contenidoCards = '';

            $.each(tipoDeAnimales, function (index, tipoDeAnimal) {
                const colors = ['custom-card-bg-cherry', 'custom-card-bg-blue', 'custom-card-bg-green', 'custom-card-bg-orange'];
                const cardClass = colors[index % colors.length];

                contenidoCards += `
                <div class="col-xl-3 col-lg-4 col-md-6 mb-4">
                    <div class="card special-card ${cardClass} card-small" data-id="${tipoDeAnimal.tipoAnimalID}">
                        <div class="card-statistic p-3 d-flex align-items-center">
                            <div class="card-icon card-icon-large me-3">
                                <img src="/img/Pezuna.png" alt="Pezuna" class="icon-image"/>
                            </div>
                            <div class="flex-grow-1">
                                <h5 class="card-title mb-0">${tipoDeAnimal.descripcion}</h5>
                            </div>
                            <div class="d-flex flex-column align-items-end ms-3" style="z-index: 1;">
                                <button class="btn btn-outline-light btn-icon btn-sm mb-1" onclick="ModalEditarTipoAnimal(${tipoDeAnimal.tipoAnimalID})">
                                    <i class="fa-regular fa-pen-to-square icon-size"></i>
                                </button>
                                <button class="btn btn-outline-light btn-icon btn-sm" onclick="EliminarTipoAnimal(${tipoDeAnimal.tipoAnimalID})">
                                    <i class="fa-solid fa-trash-can icon-size"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
            });

            document.getElementById("contenedor-tipoAnimales").innerHTML = contenidoCards;
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}


function GuardarTipoAnimal() {
    let tipoAnimalID = document.getElementById("TipoAnimalID").value;
    let descripcion = document.getElementById("Descripcion").value;

    $.ajax({
        url: '../../TipoAnimales/GuardarTipoAnimal',
        data: {
            tipoAnimalID: tipoAnimalID,
            descripcion: descripcion
        },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            if (resultado.success) {
                Swal.fire({
                    position: 'bottom', // Posición en la parte inferior central
                    icon: 'success',
                    title: '¡Guardado exitosamente!',
                    showConfirmButton: false,
                    timer: 500, // Temporizador reducido a 1 segundo
                    toast: true, // Hace que la alerta sea más pequeña y tipo "toast"
                }).then(() => {
                    // Cerrar el modal
                    $('#myModal').modal('hide');
                    ListadoTipoAnimal(); // Actualiza el listado
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Completar el campo!',
                    text: resultado.mensaje,
                });
            }
        },
        error: function (xhr, status) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Disculpe, existió un problema al guardar el tipo de animal.',
            });
        }
    });
}



function ModalEditarTipoAnimal(tipoAnimalID) {

    $.ajax({
        url: '../../TipoAnimales/ListadoTipoAnimal',
        data: { id: tipoAnimalID },
        type: 'POST',
        dataType: 'json',
        success: function (tipoDeAnimales) {
            let tipoDeAnimal = tipoDeAnimales[0];

            document.getElementById("TipoAnimalID").value = tipoAnimalID;
            $("#tituloTipoAnimal").text("Editar Tipo de Animal");
            document.getElementById("Descripcion").value = tipoDeAnimal.descripcion;
            $("#modalTipoAnimal").modal("show");
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el registro para ser modificado.');
        }
    });
}

function EliminarTipoAnimal(tipoAnimalID) {
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
                url: '../../TipoAnimales/EliminarTipoAnimal',
                data: { tipoAnimalID: tipoAnimalID },
                type: 'POST',
                dataType: 'json',
                success: function (resultado) {
                    if (resultado.success) {
                        Swal.fire({
                            position: 'bottom', // Posición en la parte inferior central
                            icon: 'success',
                            title: '¡Eliminado exitosamente!',
                            showConfirmButton: false,
                            timer: 1500,
                            toast: true, // Hace que la alerta sea más pequeña y tipo "toast"
                        }).then(() => {
                            ListadoTipoAnimal(); // Actualiza el listado de tipo de animales
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
                        text: 'Disculpe, existió un problema al eliminar el tipo de animal.',
                    });
                }
            });
        }
    });
}




function LimpiarModalTipoAnimal() {
    document.getElementById("TipoAnimalID").value = 0;
    document.getElementById("Descripcion").value = "";
}

function NuevoTituloTipoAnimal() {
    $("#tituloTipoAnimal").text("Nuevo Tipo de Animal");
}