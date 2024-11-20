window.onload = ListadoInformeVacasParir;

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

            // Funcionalidad de alerta para vacas próximas a parir
            const alertaProximasVacas = document.getElementById("alerta-proximas-vacas");
            if (alertaProximasVacas) {
                const vacasProximas = vacasParir.filter(vaca => 
                    vaca.diasRestantesParicion !== null && vaca.diasRestantesParicion <= 7
                );

                // Si hay vacas próximas a parir, mostrar la alerta
                if (vacasProximas.length > 0) {
                    const mensajeAlerta = `¡Atención! ${vacasProximas.length} vaca(s) próxima(s) a parir en 7 días o menos.`;
                    alertaProximasVacas.textContent = mensajeAlerta;
                    alertaProximasVacas.closest('.alert').style.display = 'flex';
                } else {
                    // Si no hay vacas próximas a parir, mostrar un mensaje de no hay vacas
                    alertaProximasVacas.textContent = "No hay vacas próximas a parir en los próximos 7 días.";
                    alertaProximasVacas.closest('.alert').style.display = 'flex';
                }
            }
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

function crearGraficoParir(vacasPorMes) {
    try {
        console.log("Creando gráfico con datos:", vacasPorMes);
        
        // Verificar si Chart está definido
        if (typeof Chart === 'undefined') {
            console.error("Chart.js no está cargado");
            return;
        }

        // Obtener el contexto del canvas con id "chart-parir"
        const ctx = document.getElementById('chart-parir');
        
        if (!ctx) {
            console.error("No se encontró el elemento canvas con id 'chart-parir'");
            return;
        }

        const meses = Object.keys(vacasPorMes);
        const cantidades = Object.values(vacasPorMes);

        // Destruir gráfico existente si ya está creado
        if (window.graficoVacasParir) {
            window.graficoVacasParir.destroy();
        }

        // Crear nuevo gráfico
        window.graficoVacasParir = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: meses,
                datasets: [{
                    label: 'Vacas a Parir',
                    data: cantidades,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Número de Vacas'
                        }
                    }
                }
            }
        });

        console.log("Gráfico creado exitosamente");
    } catch (error) {
        console.error("Error al crear el gráfico:", error);
    }
}



