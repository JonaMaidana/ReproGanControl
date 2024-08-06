window.onload = ListadoAnimales();

function ListadoAnimales(){
    $.ajax({
        url: '../../Animales/ListadoAnimales',
        type: 'GET',
        dataType: 'json',
        success: function (animalesMostrar) {
            $("#ModalAnimal").modal("hide");
            LimpiarModal();
            let contenidoTabla = ``;

            $.each(animalesMostrar, function (index, animal) {  
                contenidoTabla += `
                <tr>
                    <td>${animal.caravana}</td>
                    <td>${animal.tipoAnimalNombre}</td>
                    <td>${animal.apodo}</td>
                    <td>${animal.nombrePadre}</td>
                    <td>${animal.nombreMadre}</td>
                    <td>${animal.establecimiento}</td>
                    <td>${animal.fechaNacimientoString}</td>
                    <td class="text-center">
                        <button type="button" class="edit-button" onclick="ModalEditarAnimal(${animal.animalID})">
                            Editar</i>
                        </button>
                    </td>
                    <td class="text-center">
                        <button type="button" class="delete-button" onclick="EliminarAnimal(${animal.animalID})">
                            Eliminar</i>
                        </button>
                    </td>
                </tr>
                `;
            });

            document.getElementById("tbody-animales").innerHTML = contenidoTabla;
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado de animales');
        }
    });
}

function LimpiarModal(){
    document.getElementById("AnimalID").value = 0;
    document.getElementById("TipoAnimalID").value = 0;
    document.getElementById("Caravana").value = "";
    document.getElementById("Apodo").value = "";
    document.getElementById("NombrePadre").value = "";
    document.getElementById("NombreMadre").value = "";
    document.getElementById("Establecimiento").value = "";
}

function NuevoAnimal(){
    $("#ModalTitulo").text("Nuevo Animal");
}

function GuardarAnimal(){
    let animalID = document.getElementById("AnimalID").value;
    let tipoAnimalID = document.getElementById("TipoAnimalID").value;
    let caravana = document.getElementById("Caravana").value;
    let apodo = document.getElementById("Apodo").value;
    let nombrePadre = document.getElementById("NombrePadre").value;
    let nombreMadre = document.getElementById("NombreMadre").value;
    let establecimiento = document.getElementById("Establecimiento").value;
    let fechaNacimiento = document.getElementById("FechaNacimiento").value;

    $.ajax({
        url: '../../Animales/GuardarAnimales',
        data: { 
            animalID: animalID,
            tipoAnimalID: tipoAnimalID,
            caravana: caravana,
            apodo: apodo,
            nombrePadre: nombrePadre,
            nombreMadre: nombreMadre,
            establecimiento: establecimiento,
            fechaNacimiento: fechaNacimiento
        },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            if(resultado != ""){
                alert(resultado);
            }
            ListadoAnimales();
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al guardar el animal');
        }
    });    
}

function ModalEditarAnimal(animalID){
    
    $.ajax({
        url: '../../Animales/ListadoAnimales',
        data: { id: animalID},
        type: 'POST',
        dataType: 'json',

        success: function (animalesMostrar) {
            let animal = animalesMostrar[0];

            document.getElementById("AnimalID").value = animalID;
            document.getElementById("TipoAnimalID").value = animal.tipoAnimalID;
            document.getElementById("Caravana").value = animal.caravana;
            document.getElementById("Apodo").value = animal.apodo;
            document.getElementById("NombrePadre").value = animal.nombrePadre;
            document.getElementById("NombreMadre").value = animal.nombreMadre;        
            document.getElementById("Establecimiento").value = animal.establecimiento;
            document.getElementById("FechaNacimiento").value = animal.fechaNacimiento;

            $("#ModalTitulo").text("Editar Animal");
            $("#ModalAnimal").modal("show");
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el listado para ser modificado.');
        }
    });
}

function EliminarAnimal(animalID){
    $.ajax({
        url: '../../Animales/EliminarAnimales',
        data: { animalID: animalID},
        type: 'POST',
        dataType: 'json',

        success: function (resultado) {           
            ListadoAnimales();
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al eliminar el animal.');
        }
    });    

}