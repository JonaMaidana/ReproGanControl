window.onload = ListadoInformeAnimales();

let vistaInformeAnimalesGlobal = [];
let animalChart;


window.onload = ListadoInformeAnimales();


function ListadoInformeAnimales() {
    let tipoAnimalBuscarID = document.getElementById("TipoAnimalBuscarID").value;
    let buscarEstablecimiento = document.getElementById("BuscarEstablecimiento").value;

    $.ajax({
        url: '../../Animales/ListadoInformeAnimales',
        data: {
            tipoAnimalBuscarID: tipoAnimalBuscarID,
            buscarEstablecimiento: buscarEstablecimiento
        },
        type: 'POST',
        dataType: 'json',

        success: function (vistaInformeAnimales) {
            vistaInformeAnimalesGlobal = vistaInformeAnimales;
            let contenidoTabla = ``;

            $.each(vistaInformeAnimales, function (Index, Animal) {
                contenidoTabla += `
                <tr>
                    <td class="text-center">${Animal.tipoAnimalNombre}</td>
                    <td class="text-center"></td>
                    <td class="ocultar-en-768px" class="text-center"></td>
                    <td class="ocultar-en-768px" class="text-center"></td>
                    <td class="ocultar-en-768px" class="text-center"></td>
                    <td class="ocultar-en-768px" class="text-center"></td>
                    <td class="ocultar-en-768px" class="text-center"></td>
                    <td class="text-center">
                        <button type="button" class="info-button" onclick="showAnimalDetails(${Animal.tipoAnimalID})">
                            <i class="fa-solid fa-info-circle"></i>
                        </button>
                    </td>
                </tr>
                `;

                $.each(Animal.vistaAnimales, function (index, Animales) {
                    contenidoTabla += `
                    <tr>
                        <td class="text-center"></td>
                        <td class="text-center">${Animales.caravana}</td>
                        <td class="ocultar-en-768px" class="text-center">${Animales.apodo || ''}</td>
                        <td class="ocultar-en-768px" class="text-center">${Animales.establecimiento}</td>
                        <td class="ocultar-en-768px" class="text-center">${Animales.fechaNacimientoString}</td>
                        <td class="ocultar-en-768px" class="text-center">${Animales.nombrePadre || ''}</td>
                        <td class="ocultar-en-768px" class="text-center">${Animales.nombreMadre || ''}</td>
                        <td class="text-center"></td>
                    </tr>
                    `;
                });
            });

            document.getElementById("tbody-informeAnimales").innerHTML = contenidoTabla;

            // Crear o actualizar el gráfico
            createOrUpdateAnimalChart(vistaInformeAnimales);
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado :(');
        }
    });
}

function createOrUpdateAnimalChart(data) {
    const ctx = document.getElementById('animalChart').getContext('2d');

    const labels = data.map(item => item.tipoAnimalNombre);
    const animalCounts = data.map(item => item.vistaAnimales.length);

    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Animales por Tipo',
            data: animalCounts,
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
                text: 'Cantidad de Animales por Tipo'
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
    if (animalChart) {
        animalChart.data = chartData;
        animalChart.options = options;
        animalChart.update();
    } else {
        animalChart = new Chart(ctx, {
            type: 'doughnut',
            data: chartData,
            options: options
        });
    }
}

function showAnimalDetails(tipoAnimalID) {
    // Encuentra el animal con el ID dado en la variable global
    const animal = vistaInformeAnimalesGlobal.find(a => a.tipoAnimalID === tipoAnimalID);

    // Crea el contenido para el modal
    const modalContent = `
        <h5>${animal.tipoAnimalNombre}</h5>
        <ul>
            ${animal.vistaAnimales.map(a => `
                <li>
                    <strong>Caravana:</strong> ${a.caravana}<br>
                    <strong>Apodo:</strong> ${a.apodo}<br>
                    <strong>Establecimiento:</strong> ${a.establecimiento}<br>
                    <strong>Fecha de Nacimiento:</strong> ${a.fechaNacimientoString}<br>
                    <strong>Nombre del Padre:</strong> ${a.nombrePadre}<br>
                    <strong>Nombre de la Madre:</strong> ${a.nombreMadre}
                </li>
            `).join('')}
        </ul>
    `;

    // Asigna el contenido al modal
    document.getElementById("modalContentInformeAnimales").innerHTML = modalContent;

    // Muestra el modal
    var myModal = new bootstrap.Modal(document.getElementById('informeAnimalesModal'));
    myModal.show();
}