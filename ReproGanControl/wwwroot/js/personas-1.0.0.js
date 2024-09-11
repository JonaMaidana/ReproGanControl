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
            <td>${persona.fechaNacimientoString}</td>
            <td>${persona.domicilio}</td>
            <td>${persona.nombreLocalidad}</td>
            <td>${persona.tel}</td>
            <td>${persona.email}</td>
            <td class="text-center">
                <button type="button" class="edit-button" onclick="ModalEditarPersonas(${persona.personaID})">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
            </td>
            <td class="text-center">
                <button type="button" class="delete-button" onclick="EliminarPersona(${persona.personaID})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById("tbody-personas").innerHTML = contenidoTabla;
}

function updateTotalItemsPersonas() {
    const totalItems = personasMostrar.length;
    document.getElementById("total-items-personas").textContent = `Personas Cargadas: ${totalItems}`;
}

function LimpiarModal() {
    document.getElementById("PersonaID").value = 0;
    document.getElementById("LocalidadID").value = 0;
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
}

function GuardarPersonas() {
    let personaID = document.getElementById("PersonaID").value;
    let localidadID = document.getElementById("LocalidadID").value;
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
            document.getElementById("Email").value = persona.email;
            document.getElementById("Tel").value = persona.tel;
            document.getElementById("FechaNacimiento").value = persona.fechaNacimiento;
            document.getElementById("Domicilio").value = persona.domicilio;
            document.getElementById("NumeroDocumento").value = persona.numeroDocumento;
            document.getElementById("NombreCompleto").value = persona.nombreCompleto;

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