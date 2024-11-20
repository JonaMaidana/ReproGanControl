window.onload = ListadoInformeVacasParir(); 

function ListadoInformeVacasParir() {
    $.ajax({
        url: '../../Eventos/ListadoInformeVacasParir', // Cambiar a la URL correcta de tu backend
        type: 'GET', 
        dataType: 'json',
        success: function(vacasParir) {
            console.log(vacasParir); // Imprimir los datos recibidos en la consola

            // Crear la tabla con los datos de las vacas
            let contenidoTabla = ``;

            // Llamar a la función para agrupar las vacas a parir por mes
            let vacasPorMes = datosParirPorMes(vacasParir);

            // Construir la tabla de vacas a parir
            $.each(vacasParir, function(index, vaca) {
                contenidoTabla += `
                    <tr>
                        <td>${vaca.caravana}</td> <!-- Cambio 'animalCaravana' a 'caravana' -->
                        <td>${vaca.fechaAproxParir}</td> <!-- Cambio 'fechaAproximadaParir' a 'fechaAproxParir' -->
                        <td>${vaca.diasRestantesParicion}</td>
                    </tr>
                `;
            });

            // Insertar la tabla en el cuerpo de la tabla
            document.getElementById("tbody-vacas-parir").innerHTML = contenidoTabla;

            // Llamada para actualizar el gráfico
            crearGraficoParir(vacasPorMes);
        },
        error: function(xhr, status, error) {
            alert('Disculpe, existió un problema al cargar el listado de vacas a parir');
        }
    });
}

// Función para agrupar vacas a parir por mes
function datosParirPorMes(vacasParir) {
    const datos = {};
    vacasParir.forEach(vaca => {
        // Verifica que la propiedad exista y tenga un valor antes de usar slice
        if (vaca.fechaAproxParir) { // Cambié de 'FechaAproximadaParir' a 'fechaAproxParir'
            const mes = vaca.fechaAproxParir.slice(0, 7); // Extraemos el mes (yyyy-mm)
            datos[mes] = datos[mes] ? datos[mes] + 1 : 1;
        } else {
            console.warn("fechaAproxParir es undefined para la vaca:", vaca);
        }
    });
    return datos;
}

// Función para crear el gráfico con los datos de vacas a parir
function crearGraficoParir(vacasPorMes) {
    const ctx = document.getElementById('chart-parir').getContext('2d');
    const etiquetas = Object.keys(vacasPorMes);
    const cantidades = Object.values(vacasPorMes);

    const chartData = {
        labels: etiquetas,
        datasets: [{
            label: 'Vacas a Parir',
            data: cantidades,
            backgroundColor: 'rgba(255, 159, 64, 0.2)', // Color para las vacas a parir
            borderColor: 'rgba(255, 159, 64, 1)', // Color para las vacas a parir
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