window.onload = ListadoInformeVacasSecar(); 

function datosSecarPorMes(vacasSecar) {
    console.log("Datos recibidos:", vacasSecar);
    const datos = {};
    
    vacasSecar.forEach(vaca => {
        // Verificar si la fecha existe y tiene formato esperado
        if (vaca.fechaAproximadaSecadoString) {
            // Ajustar según el formato de fecha que recibes
            const mes = vaca.fechaAproximadaSecadoString.substring(0, 7); 
            datos[mes] = (datos[mes] || 0) + 1;
        } else {
            console.warn("Vaca sin fecha de secado:", vaca);
        }
    });

    console.log("Datos agrupados por mes:", datos);
    return datos;
}

function crearGraficoSecar(vacasPorMes) {
    try {
        console.log("Creando gráfico con datos:", vacasPorMes);
        
        // Verificar si Chart está definido
        if (typeof Chart === 'undefined') {
            console.error("Chart.js no está cargado");
            return;
        }

        // Obtener el contexto del canvas
        const ctx = document.getElementById('grafico-vacas-secar');
        
        if (!ctx) {
            console.error("No se encontró el elemento canvas");
            return;
        }

        const meses = Object.keys(vacasPorMes);
        const cantidades = Object.values(vacasPorMes);

        // Destruir gráfico existente
        if (window.graficoVacasSecar) {
            window.graficoVacasSecar.destroy();
        }

        // Crear nuevo gráfico
        window.graficoVacasSecar = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: meses,
                datasets: [{
                    label: 'Vacas a Secar',
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

function ListadoInformeVacasSecar() {
    $.ajax({
        url: '../../Eventos/ListadoInformeVacasSecar',
        type: 'GET', 
        dataType: 'json',
        success: function(vacasSecar) {
            console.log("Datos recibidos del servidor:", vacasSecar);

            // Crear la tabla con los datos de las vacas
            let contenidoTabla = vacasSecar.map(vaca => `
                <tr>
                    <td>${vaca.animalCaravana}</td>
                    <td>${vaca.fechaAproximadaSecadoString}</td>
                    <td>${vaca.diasRestantesSecado}</td>
                </tr>
            `).join('');

            // Insertar la tabla en el cuerpo de la tabla
            const tbody = document.getElementById("tbody-vacas-secar");
            if (tbody) {
                tbody.innerHTML = contenidoTabla;
            } else {
                console.error("No se encontró el elemento tbody");
            }

            // Llamar a la función para agrupar las vacas a secar por mes
            let vacasPorMes = datosSecarPorMes(vacasSecar);

            // Llamada para actualizar el gráfico
            crearGraficoSecar(vacasPorMes);

            // Funcionalidad de alerta para vacas próximas a secar
            const alertaProximasVacas = document.getElementById("alerta-proximas-vacas");
            if (alertaProximasVacas) {
                const vacasProximas = vacasSecar.filter(vaca => 
                    vaca.diasRestantesSecado !== null && vaca.diasRestantesSecado <= 7
                );

                // Si hay vacas próximas a secar, mostrar la alerta
                if (vacasProximas.length > 0) {
                    const mensajeAlerta = `¡Atención! ${vacasProximas.length} vaca(s) próxima(s) a secar en 7 días o menos.`;
                    alertaProximasVacas.textContent = mensajeAlerta;
                    alertaProximasVacas.closest('.alert').style.display = 'flex';
                } else {
                    // Si no hay vacas próximas a secar, mostrar un mensaje de no hay vacas
                    alertaProximasVacas.textContent = "No hay vacas próximas a secar en los próximos 7 días.";
                    alertaProximasVacas.closest('.alert').style.display = 'flex';
                }
            }
        },
        error: function(xhr, status, error) {
            console.error('Error al cargar el listado de vacas a secar:', error);
            console.log('Status:', status);
            console.log('XHR:', xhr);
            alert('Disculpe, existió un problema al cargar el listado de vacas a secar');
        }
    });
}



