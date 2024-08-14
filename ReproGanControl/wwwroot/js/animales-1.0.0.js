window.onload = ListadoAnimales();

let currentPage = 1;
const itemsPerPage = 4;
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
            updateTotalItems();
            renderTable(currentPage);
            renderPagination();
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado de animales');
        }
    });
}

function renderTable(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = animalesMostrar.slice(start, end);
    let contenidoTabla = ``;

    $.each(paginatedData, function (index, animal) {  
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

function renderPagination() {
    const pageCount = Math.ceil(animalesMostrar.length / itemsPerPage);
    let paginationHtml = '';

    for (let i = 1; i <= pageCount; i++) {
        paginationHtml += `
        <li class="page-item ${i === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" onclick="goToPage(${i})">${i}</a>
        </li>
        `;
    }

    document.getElementById("pagination").innerHTML = paginationHtml;
}

function goToPage(page) {
    currentPage = page;
    renderTable(currentPage);
    renderPagination();
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

    // Construir el mensaje de error
    let camposFaltantes = [];
    if (!animalID) camposFaltantes.push("ID del Animal");
    if (!tipoAnimalID) camposFaltantes.push("Tipo de Animal");
    if (!caravana) camposFaltantes.push("Caravana");
    if (!apodo) camposFaltantes.push("Apodo");
    if (!nombrePadre) camposFaltantes.push("Nombre del Padre");
    if (!nombreMadre) camposFaltantes.push("Nombre de la Madre");
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
            document.getElementById("FechaNacimiento").value = animal.fechaNacimiento;

            $("#ModalTitulo").text("Editar Animal");
            $("#ModalAnimal").modal("show");
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el listado para ser modificado.');
        }
    });
}

function EliminarAnimal(animalID) {
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
                    ListadoAnimales();
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