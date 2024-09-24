// Definir variables globales para los datos y el gráfico
let vistaInformeRegistroMedicoGlobal = [];
let medicalChart;

window.onload = ListadoInformeRegistroMedico();

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

            // Crear o actualizar el gráfico
            createOrUpdateMedicalChart(vistaInformeRegistroMedico);
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado :(');
        }
    });
}

// Función para crear o actualizar el gráfico de registros médicos
function createOrUpdateMedicalChart(data) {
    const ctx = document.getElementById('medicalChart').getContext('2d');
    
    const labels = data.map(item => item.nombrePersona);
    const recordCounts = data.map(item => item.vistaRegistroMedico.length);

    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Registros Médicos por Persona',
            data: recordCounts,
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Registros Médicos por Persona'
            }
        },
        layout: {
            padding: {
                top: 10,
                right: 10,
                bottom: 10,
                left: 10
            }
        },
        maintainAspectRatio: false
    };

    // Actualizar el gráfico si ya existe o crear uno nuevo
    if (medicalChart) {
        medicalChart.data = chartData;
        medicalChart.options = options;
        medicalChart.update();
    } else {
        medicalChart = new Chart(ctx, {
            type: 'doughnut',
            data: chartData,
            options: options
        });
    }
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

