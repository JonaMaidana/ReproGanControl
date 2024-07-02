window.onload = ListadoAnimales ();

function ListadoAnimales() {
    $.ajax({
        url: '../../Animales/ListadoAnimales',
        data: {},
        type: 'POST',
        dataType: 'json',

        success: function (listadoAnimales) {
            $("#modalAnimales").modal("hide");
            LimpiarModalAnimal();
            
            let tabla = ``;

            $.each(listadoAnimales, function (index, listaAnimales) {
                tabla += `
                <tr>
                    <td>${listaAnimales.caravana}</td>
                    <td>${listaAnimales.tipoAnimal}</td>
                    <td>${listaAnimales.estado}</td>
                    <td>
                    <button type="button" class="btn btn-warning" onclick="EditarAnimal(${listaAnimales.animalID})">Editar</button>
                    </td>
                    <td>
                    <button type="button" class="btn btn-danger" onclick="ValidarEliminar(${listaAnimales.animalID})">Eliminar</button>
                    </td>
                </tr>
                `;
            });

            document.getElementById("tbody-animales").innerHTML = tabla;
        },
        error: function (xhr, status) {
            console.log('Ocurrio un proble al consultar el listado')
        }
    });
}

function GuardarAnimal() {
    let animalID = document.getElementById("AnimalID").value;
    let estadoDescripcion = document.getElementById("EstadoDescripcion").value;
    let tipoAnimalDescripcion = document.getElementById("TipoAnimalDescripcion").value;
    let caravana = document.getElementById("Caravana").value;
   
    $.ajax({
        url: '../../Animales/GuardarAnimales',
        data: {
            AnimalID: animalID,
            EstadoDescripcion: estadoDescripcion,
            TipoAnimalDescripcion: tipoAnimalDescripcion,
            Caravana: caravana
        },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            if (resultado != "") {
                alert(resultado);
            }
            ListadoAnimales();
        },
        error: function (xhr, status) {
            console.log('ocurrio un error al guardar')
        }
    });
}

function ValidarEliminar(animalID) {
    let eliminarAnimal = confirm("Ta seguro vo de eliminar esto?")
    if (eliminarAnimal == true) {
        EliminarAnimal(animalID);
    }
}
function EliminarAnimal(animalID) {
    console.log("Animal ID:", animalID); // Verifica que animalID tenga un valor válido aquí
    $.ajax({
        url: '../../Animales/EliminarAnimales',
        data: { animalID: animalID },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            ListadoAnimales();
        },
        error: function (xhr, status) {
            console.log('Ocurrió un error al eliminar:', status);
        }
    });
}

function LimpiarModalAnimal(){
    document.getElementById("AnimalID").value = 0;
    document.getElementById("EstadoDescripcion").value =  "";
    document.getElementById("TipoAnimalDescripcion").value =  "";
    document.getElementById("Caravana").value = "";
}