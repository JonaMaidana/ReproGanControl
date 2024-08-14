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
                        <div class="card-statistic p-3">
                            <div class="card-icon card-icon-large">
                                <img src="/img/Pezuna.png" alt="Pezuna" class="icon-image"/>
                            </div>
                            <div class="mb-2">
                                <h5 class="card-title mb-0">${tipoDeAnimal.descripcion}</h5>
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
                    icon: 'success',
                    title: 'Éxito',
                    text: resultado.mensaje,
                }).then(() => {
                    ListadoTipoAnimal();
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
    $.ajax({
        url: '../../TipoAnimales/EliminarTipoAnimal',
        data: { tipoAnimalID: tipoAnimalID },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            if (resultado.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: resultado.mensaje,
                }).then(() => {
                    ListadoTipoAnimal();
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


function LimpiarModalTipoAnimal() {
    document.getElementById("TipoAnimalID").value = 0;
    document.getElementById("Descripcion").value = "";
}

function NuevoTituloTipoAnimal() {
    $("#tituloTipoAnimal").text("Nuevo Tipo de Animal");
}