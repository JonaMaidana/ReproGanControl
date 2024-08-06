window.onload = ListadoTipoAnimal();

function ListadoTipoAnimal() {

    $.ajax({
        url: '../../TipoAnimales/ListadoTipoAnimal',
        data: {},
        type: 'GET',
        dataType: 'json',

        success: function (tipoDeAnimales) {

            $("#modalTipoAnimal").modal("hide");
            LimpiarModalTipoAnimal();

            let contenidoTabla = ``;

            $.each(tipoDeAnimales, function (index, tipoDeAnimal) {

                contenidoTabla += `
                <tr>
                    <td>${tipoDeAnimal.descripcion}</td>
                    <td class="text-center">
                    <button type="button" class="btn btn-success btn-sm" onclick="ModalEditarTipoAnimal(${tipoDeAnimal.tipoAnimalID})">
                    <i class="fa-solid fa-marker">Editar</i>
                    </button>
                    </td>
                    <td class="text-center">
                    <button type="button" class="btn btn-danger btn-sm" onclick="EliminarTipoAnimal(${tipoDeAnimal.tipoAnimalID})">
                    <i class="fa-solid fa-trash">Eliminar</i>
                    </button>
                    </td>
                </tr>
             `;

            });

            document.getElementById("tbody-tipoAnimales").innerHTML = contenidoTabla;

        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}

function GuardarTipoAnimal() {

    let tipoAnimalID = document.getElementById("TipoAnimalID").value;
    let descripcion = document.getElementById("Descripcion").value;

    $.ajax({

        url: '../../TipoAnimales/GuardarTipoAnimal',
        data: {
            tipoAnimalID: tipoAnimalID,
            descripcion: descripcion
        },
        type: 'POST',
        dataType: 'json',

        success: function (resultado) {

            if (resultado != "") {
                alert(resultado);
            }
            ListadoTipoAnimal();
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al guardar el tipo animal');
        }
    });
}

function ModalEditarTipoAnimal(tipoAnimalID) {

    $.ajax({
        url: '../../TipoAnimales/ListadoTipoAnimal',
        data: { id: tipoAnimalID },
        type: 'POST',
        dataType: 'json',
        success: function (tipoDeAnimales) {
            let tipoDeAnimal = tipoDeAnimales[0];

            document.getElementById("TipoAnimalID").value = tipoAnimalID;
            $("#tituloTipoAnimal").text("Editar Tipo de Animal");
            document.getElementById("Descripcion").value = tipoDeAnimal.descripcion;
            $("#modalTipoAnimal").modal("show");
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el registro para ser modificado.');
        }
    });
}

function EliminarTipoAnimal(tipoAnimalID) {
    $.ajax({

        url: '../../TipoAnimales/EliminarTipoAnimal',
        data: { tipoAnimalID: tipoAnimalID },
        type: 'POST',
        dataType: 'json',

        success: function (resultado) {
            if (!resultado) {
                alert("");
            }
            ListadoTipoAnimal();
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al eliminar el tipo de animal.');
        }
    });
}

function LimpiarModalTipoAnimal() {
    document.getElementById("TipoAnimalID").value = 0;
    document.getElementById("Descripcion").value = "";
}

function NuevoTituloTipoAnimal() {
    $("#tituloTipoAnimal").text("Nuevo Tipo de Animal");
}