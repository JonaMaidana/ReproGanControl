window.onload = ListadoAnimales();

let animalesMostrar = [];
let paginaActual = 1; // Página actual para la primera tabla
const itemsPorPagina = 10; // Define cuántos items por página mostrar

function ListadoAnimales() {
    let buscarTipoAnimalID = $("#BuscarTipoAnimalID").val();
    let buscarCaravana = $("#BuscarCaravana").val();
    let buscarEstablecimientoID = $("#BuscarEstablecimientoID").val();
    let buscarApodo = $("#BuscarApodo").val();

    $.ajax({
        url: '../../Animales/ListadoAnimales',
        type: 'GET',
        dataType: 'json',
        data: {
            BuscarTipoAnimalID: buscarTipoAnimalID,
            Caravana: buscarCaravana,
            BuscarEstablecimientoID: buscarEstablecimientoID,
            BuscarApodo: buscarApodo
        },
        success: function (data) {
            $("#ModalAnimal").modal("hide");
            LimpiarModal();
            animalesMostrar = data;
            paginaActual = 1; // Resetear a la primera página
            renderTable("tbody-animales"); // Renderiza la primera tabla
            renderTableDuplicada("tbody-animales-duplicada"); // Renderiza la segunda tabla
            updateTotalItems();
            renderPagination(); // Renderiza la paginación
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado de animales');
        }
    });
}

function renderTable(targetId) {
    let contenidoTabla = ``;
    const start = (paginaActual - 1) * itemsPorPagina;
    const end = start + itemsPorPagina;
    const paginatedItems = animalesMostrar.slice(start, end); // Obtén solo los elementos para la página actual

    $.each(paginatedItems, function (index, animal) {
        contenidoTabla += `
        <tr>
            <td>${animal.caravana}</td>
            <td>${animal.tipoAnimalNombre}</td>
            <td class="ocultar-en-768px">${animal.apodo}</td>
            <td class="ocultar-en-768px">${animal.nombrePadre}</td>
            <td class="ocultar-en-768px">${animal.nombreMadre}</td>
            <td class="ocultar-en-768px">${animal.nombreEstablecimiento}</td>
            <td class="ocultar-en-768px">${animal.fechaNacimientoString}</td>
            <td class="text-center">
                <button type="button" class="edit-button" title="Editar Animal" onclick="ModalEditarAnimal(${animal.animalID})">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button type="button" class="delete-button" title="Eliminar Animal" onclick="EliminarAnimal(${animal.animalID})">
                    <i class="fa-solid fa-trash"></i>
                </button>
                <button type="button" class="info-button" title="Ver Datos" onclick="showAnimalDetails(${animal.animalID})">
                    <i class="fa-solid fa-info-circle"></i>
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById(targetId).innerHTML = contenidoTabla;
}

function renderTableDuplicada(targetId) {
    let contenidoTabla = ``;

    $.each(animalesMostrar, function (index, animal) { // Renderiza todos los animales en la segunda tabla
        contenidoTabla += `
        <tr>
            <td>${animal.caravana}</td>
            <td>${animal.tipoAnimalNombre}</td>
            <td class="ocultar-en-768px">${animal.apodo}</td>
            <td class="ocultar-en-768px">${animal.nombrePadre}</td>
            <td class="ocultar-en-768px">${animal.nombreMadre}</td>
            <td class="ocultar-en-768px">${animal.nombreEstablecimiento}</td>
            <td class="ocultar-en-768px">${animal.fechaNacimientoString}</td>
            <td class="text-center">
                <button type="button" class="edit-button" title="Editar Animal" onclick="ModalEditarAnimal(${animal.animalID})">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button type="button" class="delete-button" title="Eliminar Animal" onclick="EliminarAnimal(${animal.animalID})">
                    <i class="fa-solid fa-trash"></i>
                </button>
                <button type="button" class="info-button" title="Ver Datos" onclick="showAnimalDetails(${animal.animalID})">
                    <i class="fa-solid fa-info-circle"></i>
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById(targetId).innerHTML = contenidoTabla; // Renderiza la segunda tabla sin paginación
}

function renderPagination() {
    const totalPages = Math.ceil(animalesMostrar.length / itemsPorPagina);
    let contenidoPaginacion = ``;

    for (let i = 1; i <= totalPages; i++) {
        contenidoPaginacion += `
            <button class="page-button ${paginaActual === i ? 'active' : ''}" onclick="irAPagina(${i})">${i}</button>
        `;
    }

    document.getElementById("pagination").innerHTML = contenidoPaginacion;
}

function irAPagina(pagina) {
    paginaActual = pagina; // Actualiza la página actual
    renderTable("tbody-animales"); // Renderiza la tabla para la nueva página
    renderPagination(); // Renderiza la paginación
}

function updateTotalItems() {
    const totalItems = animalesMostrar.length;
    document.getElementById("total-items").textContent = `Animales cargados: ${totalItems}`;
}

function showAnimalDetails(animalID) {
    // Encuentra el animal con el ID dado
    const animal = animalesMostrar.find(a => a.animalID === animalID);

    // Crea el contenido para el modal
    const modalContent = `
        <p><strong>Caravana:</strong> ${animal.caravana}</p>
        <p><strong>Tipo de Animal:</strong> ${animal.tipoAnimalNombre}</p>
        <p><strong>Apodo:</strong> ${animal.apodo}</p>
        <p><strong>Nombre del Padre:</strong> ${animal.nombrePadre}</p>
        <p><strong>Nombre de la Madre:</strong> ${animal.nombreMadre}</p>
        <p><strong>Establecimiento:</strong> ${animal.nombreEstablecimiento}</p>
        <p><strong>Fecha de Nacimiento:</strong> ${animal.fechaNacimientoString}</p>
    `;

    // Asigna el contenido al modal
    document.getElementById("modalContent").innerHTML = modalContent;

    // Muestra el modal
    var myModal = new bootstrap.Modal(document.getElementById('animalModal'));
    myModal.show();
}

function LimpiarModal() {
    document.getElementById("AnimalID").value = 0;
    document.getElementById("TipoAnimalID").value = 0;
    document.getElementById("EstablecimientoID").value = 0;
    document.getElementById("Caravana").value = "";
    document.getElementById("Apodo").value = "";
    document.getElementById("NombrePadre").value = "";
    document.getElementById("NombreMadre").value = "";
    document.getElementById("FechaNacimiento").value = "";
}

function NuevoAnimal() {
    $("#ModalTitulo").text("Nuevo Animal");
}

function GuardarAnimal() {
    let animalID = document.getElementById("AnimalID").value;
    let tipoAnimalID = document.getElementById("TipoAnimalID").value;
    let establecimientoID = document.getElementById("EstablecimientoID").value;
    let caravana = document.getElementById("Caravana").value;
    let apodo = document.getElementById("Apodo").value;
    let nombrePadre = document.getElementById("NombrePadre").value;
    let nombreMadre = document.getElementById("NombreMadre").value;
    let fechaNacimiento = document.getElementById("FechaNacimiento").value;

    // mensaje de error
    let camposFaltantes = [];
    if (!caravana) camposFaltantes.push("Caravana");
    if (!animalID) camposFaltantes.push("ID del Animal");
    if (!tipoAnimalID) camposFaltantes.push("Tipo de Animal");
    if (!establecimientoID) camposFaltantes.push("ID del Establecimiento");
    if (!fechaNacimiento) camposFaltantes.push("Fecha de Nacimiento");

    // Verificar si hay campos faltantes
    if (camposFaltantes.length > 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Faltan campos!',
            text: 'Debe completar los siguientes campos: ' + camposFaltantes.join(", "),
            confirmButtonText: 'OK'
        });
        return; // Detener la ejecución si hay campos vacíos
    }

    // Realizar la solicitud AJAX para guardar el animal
    $.ajax({
        url: '../../Animales/GuardarAnimales',
        data: {
            animalID: animalID,
            tipoAnimalID: tipoAnimalID,
            caravana: caravana,
            apodo: apodo,
            nombrePadre: nombrePadre,
            nombreMadre: nombreMadre,
            establecimientoID: establecimientoID,
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

function configurarFechaNacimiento() {
    const fechaInput = document.getElementById("FechaNacimiento");
    const hoy = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
    fechaInput.setAttribute('max', hoy); // Restringir la selección de fechas futuras
}

// Llamar a la función para configurar la fecha al cargar la página
document.addEventListener('DOMContentLoaded', configurarFechaNacimiento);

function ModalEditarAnimal(animalID) {

    $.ajax({
        url: '../../Animales/ListadoAnimales',
        data: { id: animalID },
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
            document.getElementById("EstablecimientoID").value = animal.establecimientoID;


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