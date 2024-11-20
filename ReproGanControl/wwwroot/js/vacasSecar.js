window.onload = ListadoInformeVacasSecar(); 

function ListadoInformeVacasSecar() {
    $.ajax({
        url: '../../Eventos/ListadoInformeVacasSecar',
        type: 'GET', 
        dataType: 'json',
        success: function(vacasSecar) {
            console.log(vacasSecar); // Imprimir los datos recibidos en la consola

            // Crear la tabla con los datos de las vacas
            let contenidoTabla = ``;

            // Llamar a la función para agrupar las vacas a secar por mes
            let vacasPorMes = datosSecarPorMes(vacasSecar);

            // Construir la tabla de vacas a secar
            $.each(vacasSecar, function(index, vaca) {
                contenidoTabla += `
                    <tr>
                        <td>${vaca.animalCaravana}</td>
                        <td>${vaca.fechaAproximadaSecadoString}</td>
                        <td>${vaca.diasRestantesSecado}</td>
                    </tr>
                `;
            });

            // Insertar la tabla en el cuerpo de la tabla
            document.getElementById("tbody-vacas-secar").innerHTML = contenidoTabla;

            // Llamada para actualizar el gráfico
            crearGraficoSecar(vacasPorMes);
        },
        error: function(xhr, status, error) {
            alert('Disculpe, existió un problema al cargar el listado de vacas a secar');
        }
    });
}

// Función para agrupar vacas a secar por mes
function datosSecarPorMes(vacasSecar) {
    const datos = {};
    vacasSecar.forEach(vaca => {
        // Verifica que la propiedad exista y tenga un valor antes de usar slice
        if (vaca.FechaAproximadaSecadoString) {
            const mes = vaca.FechaAproximadaSecadoString.slice(0, 7); // Extraemos el mes (yyyy-mm)
            datos[mes] = datos[mes] ? datos[mes] + 1 : 1;
        } else {
            console.warn("FechaAproximadaSecadoString es undefined para la vaca:", vaca);
        }
    });
    return datos;
}

// Función para crear el gráfico con los datos de vacas a secar
function crearGraficoSecar(vacasPorMes) {
    const ctx = document.getElementById('chart-secar').getContext('2d');
    const etiquetas = Object.keys(vacasPorMes);
    const cantidades = Object.values(vacasPorMes);

    const chartData = {
        labels: etiquetas,
        datasets: [{
            label: 'Vacas a Secar',
            data: cantidades,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const opciones = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: opciones
    });
}