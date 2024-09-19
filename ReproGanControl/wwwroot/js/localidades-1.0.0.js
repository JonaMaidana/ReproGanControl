window.onload = ListadoLocalidades();

let localidadesMostrar = [];

function ListadoLocalidades() {
    let buscarLocalidad = document.getElementById("BuscarLocalidad").value;
    $.ajax({
        url: '../../Localidades/ListadoLocalidades',
        type: 'GET',
        dataType: 'json',
        data: { BuscarLocalidad: buscarLocalidad },
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
            <td class="ocultar-en-768px">${localidad.provinciaNombre}</td>
            <td class="ocultar-en-768px">${localidad.codigoPostal}</td>
            <td class="text-center">
                <button type="button" class="edit-button" title="Editar Localidad" onclick="ModalEditarLocalidad(${localidad.localidadID})">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button type="button" class="delete-button" title="Eliminar Localidad" onclick="EliminarLocalidad(${localidad.localidadID})">
                    <i class="fa-solid fa-trash"></i>
                </button>
                <button type="button" class="info-button" title="Ver mas datos" onclick="showLocalidadDetails(${localidad.localidadID})">
                    <i class="fa-solid fa-info-circle"></i>
                </button>
            </td>

        </tr>
        `;
    });

    document.getElementById("tbody-localidades").innerHTML = contenidoTabla;
}

function showLocalidadDetails(localidadID) {
    // Encuentra la localidad con el ID dado
    const localidad = localidadesMostrar.find(l => l.localidadID === localidadID);

    // Crea el contenido para el modal
    const modalContent = `
        <p><strong>Nombre:</strong> ${localidad.nombreLocalidad}</p>
        <p><strong>Provincia:</strong> ${localidad.provinciaNombre}</p>
        <p><strong>Código Postal:</strong> ${localidad.codigoPostal}</p>
    `;

    // Asigna el contenido al modal
    document.getElementById("modalContentLocalidad").innerHTML = modalContent;

    // Muestra el modal
    var myModal = new bootstrap.Modal(document.getElementById('localidadModal'));
    myModal.show();
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

    // Validación básica para campos obligatorios
    if (!provinciaID || !codigoPostal || !nombreLocalidad) {
        Swal.fire({
            icon: 'warning',
            title: 'Complete los Campos',
            text: 'Por favor, completar todos los campos obligatorios.',
            confirmButtonText: 'OK'
        });
        return; // Salir de la función si hay campos vacíos
    }

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
                    ListadoLocalidades(); // Llamar a la función para actualizar la lista de localidades
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