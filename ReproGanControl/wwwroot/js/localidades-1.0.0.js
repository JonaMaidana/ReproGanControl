window.onload = ListadoLocalidades();

let localidadesMostrar = [];

function ListadoLocalidades() {
    $.ajax({
        url: '../../Localidades/ListadoLocalidades',
        type: 'GET',
        dataType: 'json',
        data: {},
        success: function (data) {
            $("#ModalLocalidad").modal("hide");
            LimpiarModal();
            localidadesMostrar = data;
            renderTableLocalidades();
            updateTotalItemsLocalidades();
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado de localidades');
        }
    });
}

function renderTableLocalidades() {
    let contenidoTabla = ``;

    $.each(localidadesMostrar, function (index, localidad) {
        contenidoTabla += `
        <tr>
            <td>${localidad.nombreLocalidad}</td>
            <td>${localidad.provinciaNombre}</td>
            <td>${localidad.codigoPostal}</td>
            <td class="text-center">
                <button type="button" class="edit-button" onclick="ModalEditarLocalidad(${localidad.localidadID})">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
            </td>
            <td class="text-center">
                <button type="button" class="delete-button" onclick="EliminarLocalidad(${localidad.localidadID})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById("tbody-localidades").innerHTML = contenidoTabla;
}

function updateTotalItemsLocalidades() {
    const totalItems = localidadesMostrar.length;
    document.getElementById("total-items-localidades").textContent = `Localidades Cargadas: ${totalItems}`;
}

function LimpiarModal() {
    document.getElementById("LocalidadID").value = 0;
    document.getElementById("ProvinciaID").value = 0;
    document.getElementById("CodigoPostal").value = "";
    document.getElementById("NombreLocalidad").value = "";
}

function NuevaLocalidad() {
    $("#ModalTitulo").text("Nueva Localidad");
    $("#ModalLocalidad").modal("show");
}

function GuardarLocalidad() {
    let localidadID = document.getElementById("LocalidadID").value;
    let provinciaID = document.getElementById("ProvinciaID").value;
    let codigoPostal = document.getElementById("CodigoPostal").value;
    let nombreLocalidad = document.getElementById("NombreLocalidad").value;

    $.ajax({
        url: '../../Localidades/GuardarLocalidades',
        data: {
            localidadID: localidadID,
            provinciaID: provinciaID,
            codigoPostal: codigoPostal,
            nombreLocalidad: nombreLocalidad
        },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            if (!resultado.success) {
                Swal.fire({
                    icon: 'error',
                    title: '¡Error!',
                    text: resultado.message,
                    confirmButtonText: 'OK'
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: '¡Guardado!',
                    text: 'La localidad se ha guardado correctamente.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    ListadoLocalidades();
                });
            }
        },
        error: function (xhr, status) {
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'Disculpe, existió un problema al guardar la localidad.',
                confirmButtonText: 'OK'
            });
            console.log('Disculpe, existió un problema al guardar la localidad');
        }
    });
}

function ModalEditarLocalidad(localidadID) {
    $.ajax({
        url: '../../Localidades/ListadoLocalidades',
        data: { id: localidadID },
        type: 'GET',
        dataType: 'json',
        success: function (localidadesMostrar) {
            let localidad = localidadesMostrar[0];

            document.getElementById("LocalidadID").value = localidad.localidadID;
            document.getElementById("ProvinciaID").value = localidad.provinciaID;
            document.getElementById("CodigoPostal").value = localidad.codigoPostal;
            document.getElementById("NombreLocalidad").value = localidad.nombreLocalidad;
            $("#ModalTitulo").text("Editar Localidad");
            $("#ModalLocalidad").modal("show");
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el listado para ser modificado.');
        }
    });
}

function EliminarLocalidad(localidadID) {
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
            $.ajax({
                url: '../../Localidades/EliminarLocalidades',
                data: { localidadID: localidadID },
                type: 'POST',
                dataType: 'json',
                success: function (resultado) {
                    if (resultado.success) {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Eliminado!',
                            text: 'La localidad se ha eliminado correctamente.',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            ListadoLocalidades();
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: '¡Error!',
                            text: resultado.message || 'No se pudo eliminar la localidad. Puede estar siendo usada en otra parte.',
                            confirmButtonText: 'OK'
                        });
                    }
                },
                error: function (xhr, status) {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Error!',
                        text: 'Disculpe, existió un problema al eliminar la localidad.',
                        confirmButtonText: 'OK'
                    });
                    console.log('Disculpe, existió un problema al eliminar la localidad.');
                }
            });
        }
    });
}