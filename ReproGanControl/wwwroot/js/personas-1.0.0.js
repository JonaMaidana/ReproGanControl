window.onload = function () {
    MostrarPersonas();
};

let personasMostrar = [];

function MostrarPersonas() {
    $.ajax({
        url: '../../Personas/MostrarPersonas',
        type: 'GET',
        dataType: 'json',
        success: function (data) {

            $("#ModalPersona").modal("hide");
            LimpiarModal();
            personasMostrar = data;
            renderTablePersonas();
            updateTotalItemsPersonas();
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado de personas');
        }
    });
}

function renderTablePersonas() {
    let contenidoTabla = ``;

    $.each(personasMostrar, function (index, persona) {
        contenidoTabla += `
        <tr>
            <td>${persona.nombreCompleto}</td>
            <td>${persona.numeroDocumento}</td>
            <td class="ocultar-en-768px">${persona.fechaNacimientoString}</td>
            <td class="ocultar-en-768px">${persona.tel}</td>
            <td class="ocultar-en-768px">${persona.email}</td>
            <td class="ocultar-en-768px">${persona.nombreProvincia}</td>
            <td class="ocultar-en-768px">${persona.nombreLocalidad}</td>
            <td class="ocultar-en-768px">${persona.domicilio}</td>
            
            <td class="text-center">
                <button type="button" class="edit-button" title="Editar Persona" onclick="ModalEditarPersonas(${persona.personaID})">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button type="button" class="delete-button" title="Eliminar Persona" onclick="EliminarPersona(${persona.personaID})">
                    <i class="fa-solid fa-trash"></i>
                </button>
                <button type="button" class="info-button" title="Ver todos los datos" onclick="showPersonaDetails(${persona.personaID})">
                    <i class="fa-solid fa-info-circle"></i>
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById("tbody-personas").innerHTML = contenidoTabla;
}

function showPersonaDetails(personaID) {
    // Encuentra la persona con el ID dado
    const persona = personasMostrar.find(p => p.personaID === personaID);

    // Crea el contenido para el modal
    const modalContent = `
        <p><strong>Nombre Completo:</strong> ${persona.nombreCompleto}</p>
        <p><strong>Documento:</strong> ${persona.numeroDocumento}</p>
        <p><strong>Fecha de Nacimiento:</strong> ${persona.fechaNacimientoString}</p>
        <p><strong>Teléfono:</strong> ${persona.tel}</p>
        <p><strong>Email:</strong> ${persona.email}</p>
        <p><strong>Provincia:</strong> ${persona.nombreProvincia}</p>
        <p><strong>Localidad:</strong> ${persona.nombreLocalidad}</p>
        <p><strong>Domicilio:</strong> ${persona.domicilio}</p>
    `;

    // Asigna el contenido al modal
    document.getElementById("modalContentPersona").innerHTML = modalContent;

    // Muestra el modal
    var myModal = new bootstrap.Modal(document.getElementById('personaModal'));
    myModal.show();
}


function updateTotalItemsPersonas() {
    const totalItems = personasMostrar.length;
    document.getElementById("total-items-personas").textContent = `Personas Cargadas: ${totalItems}`;
}




function GuardarPersonas() {
    let personaID = document.getElementById("PersonaID").value;
    let localidadID = document.getElementById("LocalidadID").value;
    let provinciaID = document.getElementById("ProvinciaID").value;
    let nombreCompleto = document.getElementById("NombreCompleto").value;
    let email = document.getElementById("Email").value;
    let tel = document.getElementById("Tel").value;
    let fechaNacimiento = document.getElementById("FechaNacimiento").value;
    let domicilio = document.getElementById("Domicilio").value;
    let numeroDocumento = document.getElementById("NumeroDocumento").value;

    $.ajax({
        url: '../../Personas/CrearPersonas',
        data: {
            personaID: personaID,
            localidadID: localidadID,
            email: email,
            tel: tel,
            fechaNacimiento: fechaNacimiento,
            domicilio: domicilio,
            numeroDocumento: numeroDocumento,
            NombreCompleto: nombreCompleto,
            ProvinciaID: provinciaID
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
                    text: 'La persona se ha guardado correctamente.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    MostrarPersonas();
                });
            }
        },
        error: function (xhr, status) {
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'Disculpe, existió un problema al guardar la persona.',
                confirmButtonText: 'OK'
            });
            console.log('Disculpe, existió un problema al guardar la persona.');
        }
    });
}

function ModalEditarPersonas(personaID) {
    $.ajax({
        url: '../../Personas/MostrarPersonas',
        data: { id: personaID },
        type: 'GET',
        dataType: 'json',
        success: function (personasMostrar) {
            let persona = personasMostrar[0];

            document.getElementById("PersonaID").value = personaID;
            document.getElementById("LocalidadID").value = persona.localidadID;
            document.getElementById("ProvinciaID").value = persona.provinciaID;
            document.getElementById("Email").value = persona.email;
            document.getElementById("Tel").value = persona.tel;
            document.getElementById("Domicilio").value = persona.domicilio;
            document.getElementById("NumeroDocumento").value = persona.numeroDocumento;
            document.getElementById("NombreCompleto").value = persona.nombreCompleto;

            let fechaNacimiento = new Date(persona.fechaNacimiento);
            let fechaNacimientoFormateada = fechaNacimiento.toISOString().split('T')[0]; // Formato YYYY-MM-DD
            document.getElementById("FechaNacimiento").value = fechaNacimientoFormateada;

            $("#ProvinciaID").val(persona.provinciaID).change();
            CargarLocalidades(persona.provinciaID, persona.localidadID);

            $("#ModalTitulo").text("Editar Persona");
            $("#ModalPersona").modal("show");
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el listado para ser modificado.');
        }
    });
}

function EliminarPersona(personaID) {
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
                url: '../../Personas/EliminarPersonas',
                data: { personaID: personaID },
                type: 'POST',
                dataType: 'json',
                success: function (resultado) {
                    if (resultado.success) {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Eliminado!',
                            text: 'La persona se ha eliminado correctamente.',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            MostrarPersonas();
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: '¡Error!',
                            text: resultado.message || 'No se pudo eliminar la persona.',
                            confirmButtonText: 'OK'
                        });
                    }
                },
                error: function (xhr, status) {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Error!',
                        text: 'Disculpe, existió un problema al eliminar la persona.',
                        confirmButtonText: 'OK'
                    });
                    console.log('Disculpe, existió un problema al eliminar la persona.');
                }
            });
        }
    });
}


function LimpiarModal() {
    document.getElementById("PersonaID").value = 0;
    document.getElementById("LocalidadID").value = 0;
    document.getElementById("ProvinciaID").value = 0;
    document.getElementById("Email").value = "";
    document.getElementById("Tel").value = "";
    document.getElementById("FechaNacimiento").value = "";
    document.getElementById("Domicilio").value = "";
    document.getElementById("NumeroDocumento").value = "";
    document.getElementById("NombreCompleto").value = "";
}

function CrearPersona() {
    $("#ModalTitulo").text("Agregar Persona");
    $("#ModalPersona").modal("show");
    // Resetear la localidad a "[SELECCIONE]"
    $("#LocalidadID").val(0);
    $("#ProvinciaID").val(0);
    // Aquí se deben cargar las localidades basadas en la provincia seleccionada si es necesario
    // Si no hay provincia seleccionada, simplemente muestra "[SELECCIONE]"
}


$(document).ready(function () {
    // Manejar el cambio en el dropdown de provincias
    $("#ProvinciaID").change(function () {
        var provinciaID = $(this).val();
        if (provinciaID) {
            CargarLocalidades(provinciaID);
        } else {
            // Si no hay provincia seleccionada, limpiar localidades
            $("#LocalidadID").empty();
            $("#LocalidadID").append('<option value="0">[SELECCIONE]</option>');
        }
    });

    // Manejador para el botón Cancelar
    $("#btnCancelar").click(function () {
        // Reiniciar los dropdowns
        $("#ProvinciaID").val(0); // Reinicia el dropdown de Provincia a la opción "[SELECCIONE]"
        $("#LocalidadID").empty(); // Limpiar localidades

        // Volver a cargar todas las localidades disponibles
        CargarLocalidades(0); // Aquí pasamos 0 para cargar todas las localidades

        // Cerrar el modal
        $("#ModalPersona").modal("hide");
    });

    // Opción para el modal cerrar el evento
    $("#ModalPersona").on("hidden.bs.modal", function () {
        // Limpiar los campos del formulario al cerrar el modal
        $("#ProvinciaID").val(0); // Reinicia el dropdown de Provincia a la opción "[SELECCIONE]"
        $("#LocalidadID").empty(); // Limpiar localidades

        // Volver a cargar todas las localidades disponibles
        CargarLocalidades(0); // Aquí pasamos 0 para cargar todas las localidades
    });
});

// Función para cargar localidades basadas en la provincia seleccionada
function CargarLocalidades(provinciaID, localidadIDSeleccionada) {
    if (provinciaID === 0) {
        // Si la provincia es 0, solo añadir la opción "[SELECCIONE]"
        $("#LocalidadID").empty();
        $("#LocalidadID").append('<option value="0">[SELECCIONE]</option>');

        // Obtener todas las localidades cuando provinciaID es 0
        $.ajax({
            url: '/Personas/TraerLocalidades',
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
        // Si se selecciona una provincia válida, cargar las localidades correspondientes
        $.ajax({
            url: '/Personas/TraerLocalidades',
            type: 'GET',
            dataType: 'json',
            data: { provinciaId: provinciaID },
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