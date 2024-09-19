window.onload = ListadoInformeRegistroMedico();


// Definir una variable global para almacenar los datos
let vistaInformeRegistroMedicoGlobal = [];

function ListadoInformeRegistroMedico() {
    let personasBuscarID = document.getElementById("PersonasBuscarID").value;
    let buscarCaravanaInfo = document.getElementById("BuscarCaravanaInfo").value;

    $.ajax({
        url: '../../RegistroMedicos/ListadoInformeRegistroMedico',
        data: {
            PersonasBuscarID: personasBuscarID,
            BuscarCaravanaInfo: buscarCaravanaInfo
        },
        type: 'POST',
        dataType: 'json',

        success: function (vistaInformeRegistroMedico) {
            // Guardar los datos en la variable global
            vistaInformeRegistroMedicoGlobal = vistaInformeRegistroMedico;
            let contenidoTabla = ``;

            $.each(vistaInformeRegistroMedico, function (Index, RegistroMedico) {
                contenidoTabla += `
                <tr>
                    <td>${RegistroMedico.nombrePersona}</td>
                    <td class="text-center"></td>
                    <td class="ocultar-en-768px"></td>
                    <td class="ocultar-en-768px"></td>
                    <td class="ocultar-en-768px"></td>
                    <td class="ocultar-en-768px"></td>
                    <td class="text-center">
                        <button type="button" class="info-button" onclick="showMedicalRecordDetails(${RegistroMedico.registroMedicoID})">
                            <i class="fa-solid fa-info-circle"></i>
                        </button>
                    </td>
                </tr>
                `;

                $.each(RegistroMedico.vistaRegistroMedico, function (index, RegistrosMedicos) {
                    contenidoTabla += `
                <tr>
                    <td class="text-center"></td>
                    <td class="text-center">${RegistrosMedicos.animalCaravana}</td>
                    <td class="ocultar-en-768px">${RegistrosMedicos.fechaString}</td>
                    <td class="ocultar-en-768px">${RegistrosMedicos.enfermedad}</td>
                    <td class="ocultar-en-768px">${RegistrosMedicos.tratamiento}</td>
                    <td class="ocultar-en-768px">${RegistrosMedicos.observacion}</td>
                    <td class="text-center"></td>
                </tr>
                `;
                });
            });
            document.getElementById("tbody-informesRegistroMedico").innerHTML = contenidoTabla;
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado :(');
        }
    });
}

// Función para mostrar detalles en un modal
function showMedicalRecordDetails(registroMedicoID) {
    // Encuentra el registro médico correspondiente en la variable global
    const registroMedico = vistaInformeRegistroMedicoGlobal.find(r => r.registroMedicoID === registroMedicoID);

    // Crear el contenido para el modal
    const modalContent = `
        <h5>Detalles del Registro Médico</h5>
        <ul>
            <li><strong>Nombre Persona:</strong> ${registroMedico.nombrePersona}</li>
            <li><strong>Caravana Animal:</strong> ${registroMedico.vistaRegistroMedico[0]?.animalCaravana || 'N/A'}</li>
            <li><strong>Fecha:</strong> ${registroMedico.vistaRegistroMedico[0]?.fechaString || 'N/A'}</li>
            <li><strong>Tratamiento:</strong> ${registroMedico.vistaRegistroMedico[0]?.tratamiento || 'N/A'}</li>
            <li><strong>Enfermedad:</strong> ${registroMedico.vistaRegistroMedico[0]?.enfermedad || 'N/A'}</li>
            <li><strong>Observación:</strong> ${registroMedico.vistaRegistroMedico[0]?.observacion || 'N/A'}</li>
        </ul>
    `;

    // Asignar el contenido al modal
    document.getElementById("modalContentRegistroMedico").innerHTML = modalContent;

    // Mostrar el modal
    var myModal = new bootstrap.Modal(document.getElementById('registroMedicoModal'));
    myModal.show();
}
