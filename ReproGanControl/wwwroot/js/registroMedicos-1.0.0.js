window.onload = ListadoRegistrosMedicos();

let registroMedicoMostrar = [];

function ListadoRegistrosMedicos() {
    $.ajax({
        url: '../../RegistroMedicos/ListadoRegistrosMedicos',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $("#ModalRegistroMedico").modal("hide");
            LimpiarModalRegistroMedico();
            registroMedicoMostrar = data;
            renderTableRegistroMedico();
            updateTotalItemsRegistroMedico();
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado de eventos');
        }
    });
}

function renderTableRegistroMedico() {
    let contenidoTabla = ``;

    $.each(registroMedicoMostrar, function (index, medico) {  
        contenidoTabla += `
        <tr>
            <td>${medico.animalCaravana}</td>
            <td>${medico.fechaString}</td>
            <td>${medico.enfermedad}</td>
            <td>${medico.tratamiento}</td>
            <td>${medico.nombrePersona}</td>
            <td>${medico.observacion}</td>
            <td class="text-center">
                <button type="button" class="edit-button" onclick="ModalEditarRegistroMedico(${medico.registroMedicoID})">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
            </td>
            <td class="text-center">
                <button type="button" class="delete-button" onclick="EliminarRegistroMedico(${medico.registroMedicoID})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById("tbody-registroMedico").innerHTML = contenidoTabla;
}

function updateTotalItemsRegistroMedico() {
    const totalItems = registroMedicoMostrar.length;
    document.getElementById("total-items-registrosMedicos").textContent = `registros medicos cargados: ${totalItems}`;
}

function LimpiarModalRegistroMedico() {
    
    document.getElementById("AnimalID").value = 0;
    document.getElementById("PersonaID").value = 0;
    document.getElementById("Fecha").value = 0;
    document.getElementById("Tratamiento").value = "";
    document.getElementById("Enfermedad").value = "";
    document.getElementById("Observacion").value = "";
}

function NuevoRegistroMedico() {
    $("#ModalTituloRegistroMedico").text("Nuevo Registro Médico");
}

function configurarFechaActual() {
    const fechaInput = document.getElementById("Fecha");
    const hoy = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
    fechaInput.value = hoy; // Establecer la fecha actual como valor predeterminado
    fechaInput.setAttribute('min', hoy); // Restringir la selección a partir de la fecha actual
}

function GuardarRegistroMedico() {
    let registroMedicoID = document.getElementById("RegistroMedicoID").value;
    let animalID = document.getElementById("AnimalID").value;
    let personaID = document.getElementById("PersonaID").value;
    let fecha = document.getElementById("Fecha").value;
    let enfermedad = document.getElementById("Enfermedad").value; 
    let tratamiento = document.getElementById("Tratamiento").value;
    let observacion = document.getElementById("Observacion").value;

    
    if (!animalID || !fecha || !enfermedad || !tratamiento) {
        Swal.fire({
            icon: 'warning',
            title: 'Faltan campos',
            text: 'Por favor, completa los campos requeridos para guardar el evento.',
            confirmButtonText: 'OK'
        });
        return; 
    }

    
    $.ajax({
        url: '../../RegistroMedicos/GuardarRegistrosMedicos',
        data: { 
            RegistroMedicoID: registroMedicoID,
            AnimalID: animalID,
            PersonaID: personaID,
            Fecha: fecha, 
            Enfermedad: enfermedad,
            Tratamiento: tratamiento,
            Observacion: observacion,
            
        },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            Swal.fire({
                icon: 'success',
                title: 'Guardado correctamente',
                text: 'El evento se ha guardado exitosamente.',
                confirmButtonText: 'OK'
            });
            ListadoRegistrosMedicos(); 
        },
        error: function (xhr, status) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Disculpe, existió un problema al guardar el evento.',
                confirmButtonText: 'OK'
            });
            console.log('Disculpe, existió un problema al guardar el evento');
        }
    });    
}

// Llamar a la función para configurar la fecha al cargar la página
document.addEventListener('DOMContentLoaded', configurarFechaActual);

function ModalEditarRegistroMedico(registroMedicoID) {
    $.ajax({
        url: '../../RegistroMedicos/ListadoRegistrosMedicos',
        data: { id: registroMedicoID },
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            if (response && response.length > 0) {
                let medico = response[0];

                console.log(medico);

                document.getElementById("RegistroMedicoID").value = medico.registroMedicoID;
                document.getElementById("AnimalID").value = medico.animalID;
                document.getElementById("PersonaID").value = medico.personaID;
                document.getElementById("Fecha").value = medico.fechaString;

                
                let fecha = new Date(medico.fecha);
                let fechaFormato = fecha.toISOString().split('T')[0];
                document.getElementById("Fecha").value = fechaFormato;
                document.getElementById("Enfermedad").value = medico.enfermedad;
                document.getElementById("Tratamiento").value = medico.tratamiento;
                document.getElementById("Observacion").value = medico.observacion;

                $("#ModalTituloRegistroMedico").text("Editar Registro Medico");
                $("#ModalRegistroMedico").modal("show");
            } else {
                console.log('No se encontró el evento.');
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se encontró el evento.',
                    confirmButtonText: 'OK'
                });
            }
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el listado para ser modificado.');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Disculpe, existió un problema al cargar los datos del evento.',
                confirmButtonText: 'OK'
            });
        }
    });
}

function EliminarRegistroMedico(registroMedicoID) {
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
                url: '../../RegistroMedicos/EliminarRegistrosMedicos',
                data: { RegistroMedicoID: registroMedicoID },
                type: 'POST',
                dataType: 'json',
                success: function (resultado) {
                    ListadoRegistrosMedicos(); 
                    Swal.fire(
                        '¡Eliminado!',
                        'El evento ha sido eliminado.',
                        'success'
                    );
                },
                error: function (xhr, status) {
                    Swal.fire(
                        'Error',
                        'Disculpe, existió un problema al eliminar el evento.',
                        'error'
                    );
                }
            });
        }
    });
}
