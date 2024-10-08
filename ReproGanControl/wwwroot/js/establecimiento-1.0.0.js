window.onload = function () {
    MostrarEstablecimientos();
};

let establecimientosMostrar = [];

function MostrarEstablecimientos() {
    $.ajax({
        url: '../../Establecimientos/MostrarEstablecimientos',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $("#ModalEstablecimiento").modal("hide");
            LimpiarModal();
            establecimientosMostrar = data;
            renderTableEstablecimientos();
            updateTotalItemsEstablecimientos();
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado de establecimientos')
        }
    });
}

function renderTableEstablecimientos() {
    let contenidoTabla = ``;

    $.each(establecimientosMostrar, function (index, establecimiento) {
        contenidoTabla += `
        <tr>
            <td>${establecimiento.nombreEstablecimiento}</td>
            <td class="ocultar-en-768px">${establecimiento.nombreProvincia}</td>
            <td class="ocultar-en-768px">${establecimiento.nombreLocalidad}</td>
            
            <td class="text-center">
                <button type="button" class="edit-button" title="Editar Persona" onclick="ModalEditarEstablecimiento(${establecimiento.establecimientoID})">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button type="button" class="delete-button" title="Eliminar Persona" onclick="EliminarEstablecimiento(${establecimiento.establecimientoID})">
                    <i class="fa-solid fa-trash"></i>
                </button>
                <button type="button" class="info-button" title="Ver todos los datos" onclick="showEstablecimientoDetails(${establecimiento.establecimientoID})">
                    <i class="fa-solid fa-info-circle"></i>
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById("tbody-establecimiento").innerHTML = contenidoTabla;
}

function showEstablecimientoDetails(establecimientoID) {
    // Encuentra la persona con el ID dado
    const establecimiento = establecimientosMostrar.find(e => e.establecimientoID === establecimientoID);

    // Crea el contenido para el modal
    const modalContent = `
        <p><strong>Nombre Establecimiento:</strong> ${establecimiento.nombreEstablecimiento}</p>
        <p><strong>Provincia:</strong> ${establecimiento.nombreProvincia}</p>
        <p><strong>Localidad:</strong> ${establecimiento.nombreLocalidad}</p>
        
    `;

    // Asigna el contenido al modal
    document.getElementById("modalContentEstablecimiento").innerHTML = modalContent;

    // Muestra el modal
    var myModal = new bootstrap.Modal(document.getElementById('establecimientoModal'));
    myModal.show();
}

function updateTotalItemsEstablecimientos() {
    const totalItems = establecimientosMostrar.length;
    document.getElementById("total-items-establecimiento").textContent = `Establecimientos Cargados: ${totalItems}`;
}

function GuardarEstablecimiento() {
    let establecimientoID = document.getElementById("EstablecimientoID").value;
    let localidadID = document.getElementById("LocalidadID").value;
    let provinciaID = document.getElementById("ProvinciaID").value;
    let nombreEstablecimiento = document.getElementById("NombreEstablecimiento").value;
    // Validación básica para campos obligatorios
    if (!establecimientoID || !localidadID || !provinciaID || !nombreEstablecimiento) {
        Swal.fire({
            icon: 'warning',
            title: 'Completar los Campos!',
            text: 'Por favor, complete todos los campos obligatorios.',
            confirmButtonText: 'OK'
        });
        return; // Salir de la función si hay campos vacíos
    }

    $.ajax({
        url: '../../Establecimientos/CrearEstablecimientos',
        data: {
            EstablecimientoID: establecimientoID,
            LocalidadID: localidadID,
            ProvinciaID: provinciaID,
            NombreEstablecimiento: nombreEstablecimiento
        },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            console.log('Datos recibidos:', resultado);
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
                    text: 'El Establecimiento se ha guardado correctamente.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    MostrarEstablecimientos();
                });
            }
        },
        error: function (xhr, status) {
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'Disculpe, existió un problema al guardar el Establecimiento.',
                confirmButtonText: 'OK'
            });
            console.log('Disculpe, existió un problema al guardar el Establecimiento.');
        }
    });
}

function ModalEditarEstablecimiento(establecimientoID) {
    $.ajax({
        url: '../../Establecimientos/MostrarEstablecimientos',
        data: { id: establecimientoID },
        type: 'GET',
        dataType: 'json',   
        success: function (establecimientosMostrar) {
            let establecimiento = establecimientosMostrar[0];

            document.getElementById("EstablecimientoID").value = establecimientoID;
            document.getElementById("LocalidadID").value = establecimiento.localidadID;
            document.getElementById("ProvinciaID").value = establecimiento.provinciaID;
            document.getElementById("NombreEstablecimiento").value = establecimiento.nombreEstablecimiento;

            $("#ProvinciaID").val(establecimiento.provinciaID).change();
            CargarLocalidades(establecimiento.provinciaID, establecimiento.localidadID);

            $("#ModalTitulo").text("Editar Persona");
            $("#ModalEstablecimiento").modal("show");
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el listado para ser modificado.');
        }
    });
}

function EliminarEstablecimiento(establecimientoID) {
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
                url: '../../Establecimientos/EliminarEstablecimientos',
                data: { establecimientoID: establecimientoID },
                type: 'POST',
                dataType: 'json',
                success: function (resultado) {
                    if (resultado.success) {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Eliminado!',
                            text: 'El Establecimiento se ha eliminado correctamente.',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            MostrarEstablecimientos();
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: '¡Error!',
                            text: resultado.message || 'No se pudo eliminar el Establecimiento.',
                            confirmButtonText: 'OK'
                        });
                    }
                },
                error: function (xhr, status) {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Error!',
                        text: 'Disculpe, existió un problema al eliminar el Establecimiento.',
                        confirmButtonText: 'OK'
                    });
                    console.log('Disculpe, existió un problema al eliminar el Establecimiento.');
                }
            });
        }
    });
}

function LimpiarModal() {
    document.getElementById("EstablecimientoID").value = 0;
    document.getElementById("LocalidadID").value = 0;
    document.getElementById("ProvinciaID").value = 0;
    document.getElementById("NombreEstablecimiento").value = "";
}

function CrearEstablecimiento() {
    $("#ModalTitulo").text("Agregar Establecimiento");
    $("#ModalEstablecimiento").modal("show");
    $("#LocalidadID").val(0);
    $("#ProvinciaID").val(0);
}

$(document).ready(function () {
    $("#ProvinciaID").change(function () {
        var provinciaID = $(this).val();
        if (provinciaID) {
            CargarLocalidades(provinciaID);
        } else {
            $("#LocalidadID").empty();
            $("#LocalidadID").append('<option value="0">[SELECCIONE]</option>');
        }
    });

    $("#btnCancelar").click(function () {
        $("#ProvinciaID").val(0); 
        $("#LocalidadID").empty(); 

        CargarLocalidades(0);

        $("#ModalEstablecimiento").modal("hide");
    });

    $("#ModalEstablecimiento").on("hidden.bs.modal", function () {
        $("#ProvinciaID").val(0); 
        $("#LocalidadID").empty(); 

        CargarLocalidades(0); 
    });
});

function CargarLocalidades(provinciaID, localidadIDSeleccionada) {
    if (provinciaID === 0) {
        $("#LocalidadID").empty();
        $("#LocalidadID").append('<option value="0">[SELECCIONE]</option>');

        $.ajax({
            url: '/Establecimientos/TraerLocalidades',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                $.each(data, function (index, localidad) {
                    $("#LocalidadID").append(
                        `<option value="${localidad.localidadID}" ${localidad.localidadID === localidadIDSeleccionada ? 'selected' : ''}>${localidad.nombreLocalidad}</option>`
                    );
                });
            },
            error: function (xhr, status, error) {
                console.error('Error al obtener las localidades:', status, error);
            }
        });
    } else {
        $.ajax({
            url: '/Establecimientos/TraerLocalidades',
            type: 'GET',
            dataType: 'json',
            data: { provinciaID: provinciaID },
            success: function (data) {
                $("#LocalidadID").empty();
                $("#LocalidadID").append('<option value="0">[SELECCIONE]</option>');

                $.each(data, function (index, localidad) {
                    $("#LocalidadID").append(
                        `<option value="${localidad.localidadID}" ${localidad.localidadID === localidadIDSeleccionada ? 'selected' : ''}>${localidad.nombreLocalidad}</option>`
                    );
                });
            },
            error: function (xhr, status, error) {
                console.error('Error al obtener las localidades:', status, error);
            }
        });
    }
}