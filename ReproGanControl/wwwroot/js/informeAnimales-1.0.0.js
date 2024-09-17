window.onload = ListadoInformeAnimales();


function ListadoInformeAnimales() {
    // let buscarActividadInicio = document.getElementById("BuscarActividadInicio").value;
    // let buscarActividadFin = document.getElementById("BuscarActividadFin").value;
    // let tipoEjerciciosBuscarID = document.getElementById('TipoEjerciciosBuscarID').value;
    $.ajax({
        url: '../../Animales/ListadoInformeAnimales',
        data: {
            // TipoEjerciciosBuscarID: tipoEjerciciosBuscarID,
            // BuscarActividadInicio: buscarActividadInicio,
            // BuscarActividadFin: buscarActividadFin,
        },
        type: 'POST',
        dataType: 'json',

        success: function (vistaInformeAnimales) {
            let contenidoTabla = ``;

            $.each(vistaInformeAnimales, function (Index, Animal) {
                contenidoTabla += `
                <tr>
                    <td class="text-center">${Animal.tipoAnimalNombre}</td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                </tr>
                `;

                $.each(Animal.vistaAnimales, function (index, Animales) {
                    contenidoTabla += `
                <tr>
                    <td class="text-center"></td>
                    <td class="text-center">${Animales.caravana}</td>
                    <td class="text-center">${Animales.estadoString}</td>
                    <td class="text-center">${Animales.apodo}</td>
                    <td class="text-center">${Animales.establecimiento}</td>
                    <td class="text-center">${Animales.fechaNacimientoString}</td>
                    <td class="text-center">${Animales.nombrePadre}</td>
                    <td class="text-center">${Animales.nombreMadre}</td>
                </tr>
                `;
                });
            });
            document.getElementById("tbody-informeAnimales").innerHTML = contenidoTabla;
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado :(');
        }
    });
}