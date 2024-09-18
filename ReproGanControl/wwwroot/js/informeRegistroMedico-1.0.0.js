window.onload = ListadoInformeRegistroMedico();


function ListadoInformeRegistroMedico() {

    $.ajax({
        url: '../../RegistroMedicos/ListadoInformeRegistroMedico',
        data: {},
        type: 'POST',
        dataType: 'json',

        success: function (vistaInformeRegistroMedico) {
            let contenidoTabla = ``;

            $.each(vistaInformeRegistroMedico, function (Index, RegistroMedico) {
                contenidoTabla += `
                <tr>
                    <td class="text-center">${RegistroMedico.nombrePersona}</td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                </tr>
                `;

                $.each(RegistroMedico.vistaRegistroMedico, function (index, RegistrosMedicos) {
                    contenidoTabla += `
                <tr>
                    <td class="text-center"></td>
                    <td class="text-center">${RegistrosMedicos.animalCaravana}</td>
                    <td class="text-center">${RegistrosMedicos.fechaString}</td>
                    <td class="text-center">${RegistrosMedicos.tratamiento}</td>
                    <td class="text-center">${RegistrosMedicos.enfermedad}</td>
                    <td class="text-center">${RegistrosMedicos.observacion}</td>
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