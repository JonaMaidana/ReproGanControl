window.onload = ListadoAnimales();

let animalesMostrar = [];

function ListadoAnimales() {
    $.ajax({
        url: '../../Animales/ListadoAnimales',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $("#ModalAnimal").modal("hide");
            LimpiarModal();
            animalesMostrar = data;
            renderTable();
            updateTotalItems();
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado de animales');
        }
    });
}

function renderTable() {
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
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
            </td>
            <td class="text-center">
                <button type="button" class="delete-button" onclick="EliminarAnimal(${animal.animalID})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById("tbody-animales").innerHTML = contenidoTabla;
}

function updateTotalItems() {
    const totalItems = animalesMostrar.length;
    document.getElementById("total-items").textContent = `Animales cargados: ${totalItems}`;
}


function LimpiarModal(){
    document.getElementById("AnimalID").value = 0;
    document.getElementById("TipoAnimalID").value = 0;
    document.getElementById("Caravana").value = "";
    document.getElementById("Apodo").value = "";
    document.getElementById("NombrePadre").value = "";
    document.getElementById("NombreMadre").value = "";
    document.getElementById("Establecimiento").value = "";
    document.getElementById("FechaNacimiento").value = "";
}

function NuevoAnimal(){
    $("#ModalTitulo").text("Nuevo Animal");
}

function GuardarAnimal() {
    let animalID = document.getElementById("AnimalID").value;
    let tipoAnimalID = document.getElementById("TipoAnimalID").value;
    let caravana = document.getElementById("Caravana").value;
    let apodo = document.getElementById("Apodo").value;
    let nombrePadre = document.getElementById("NombrePadre").value;
    let nombreMadre = document.getElementById("NombreMadre").value;
    let establecimiento = document.getElementById("Establecimiento").value;
    let fechaNacimiento = document.getElementById("FechaNacimiento").value;

    // mensaje de error
    let camposFaltantes = [];
    if (!animalID) camposFaltantes.push("ID del Animal");
    if (!tipoAnimalID) camposFaltantes.push("Tipo de Animal");
    if (!caravana) camposFaltantes.push("Caravana");
    
    
    if (!establecimiento) camposFaltantes.push("Establecimiento");
    if (!fechaNacimiento) camposFaltantes.push("Fecha de Nacimiento");

    // Verificar si hay campos faltantes
    if (camposFaltantes.length > 0) {
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'Debe completar los siguientes campos: ' + camposFaltantes.join(", "),
            confirmButtonText: 'OK'
        });
        return; // Detener la ejecución si hay campos vacíos
    }

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
            if (!resultado.success) {
                Swal.fire({
                    icon: 'error',
                    title: '¡Error!',
                    text: resultado.message,
                    confirmButtonText: 'OK'
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: '¡Guardado!',
                    text: 'El animal se ha guardado correctamente.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    ListadoAnimales();
                });
            }
        },
        error: function (xhr, status) {
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'Disculpe, existió un problema al guardar el animal.',
                confirmButtonText: 'OK'
            });
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
            
            
            let fechaNacimiento = new Date(animal.fechaNacimiento);
            let year = fechaNacimiento.getFullYear();
            let month = ("0" + (fechaNacimiento.getMonth() + 1)).slice(-2);
            let day = ("0" + fechaNacimiento.getDate()).slice(-2);
            let formattedDate = `${year}-${month}-${day}`;

            document.getElementById("FechaNacimiento").value = formattedDate;

            $("#ModalTitulo").text("Editar Animal");
            $("#ModalAnimal").modal("show");
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el listado para ser modificado.');
        }
    });
}

function EliminarAnimal(animalID) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás deshacer esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // Confirmado, proceder con la eliminación
            $.ajax({
                url: '../../Animales/EliminarAnimales',
                data: { animalID: animalID },
                type: 'POST',
                dataType: 'json',
                success: function (resultado) {
                    if (resultado.success) {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Eliminado!',
                            text: 'El animal se ha eliminado correctamente.',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            ListadoAnimales(); // Actualiza el listado de animales
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: '¡Error!',
                            text: resultado.message || 'No se pudo eliminar el animal. Puede estar siendo usado en otra parte.',
                            confirmButtonText: 'OK'
                        });
                    }
                },
                error: function (xhr, status) {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Error!',
                        text: 'Disculpe, existió un problema al eliminar el animal.',
                        confirmButtonText: 'OK'
                    });
                    console.log('Disculpe, existió un problema al eliminar el animal.');
                }
            });
        }
    });
}
