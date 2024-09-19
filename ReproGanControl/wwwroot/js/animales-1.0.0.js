window.onload = ListadoAnimales();

let animalesMostrar = [];

function ListadoAnimales() {
    let buscarTipoAnimalID = $("#BuscarTipoAnimalID").val();
    let buscarCaravana = $("#BuscarCaravana").val();
    let buscarEstablecimiento = $("#BuscarEstablecimiento").val();
    let buscarApodo = $("#BuscarApodo").val();
    // console.log('BuscarApodo:', buscarApodo);

    $.ajax({
        url: '../../Animales/ListadoAnimales',
        type: 'GET',
        dataType: 'json',
        data: {
            BuscarTipoAnimalID: buscarTipoAnimalID,
            Caravana: buscarCaravana,
            BuscarEstablecimiento: buscarEstablecimiento,
            BuscarApodo: buscarApodo
        },
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
            <td class="ocultar-en-768px">${animal.estadoString}</td>
            <td class="ocultar-en-768px">${animal.apodo}</td>
            <td class="ocultar-en-768px">${animal.nombrePadre}</td>
            <td class="ocultar-en-768px">${animal.nombreMadre}</td>
            <td class="ocultar-en-768px">${animal.establecimiento}</td>
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

    document.getElementById("tbody-animales").innerHTML = contenidoTabla;
}

function showAnimalDetails(animalID) {
    // Encuentra el animal con el ID dado
    const animal = animalesMostrar.find(a => a.animalID === animalID);

    // Crea el contenido para el modal
    const modalContent = `
        <p><strong>Caravana:</strong> ${animal.caravana}</p>
        <p><strong>Tipo de Animal:</strong> ${animal.tipoAnimalNombre}</p>
        <p><strong>Estado:</strong> ${animal.estadoString}</p>
        <p><strong>Apodo:</strong> ${animal.apodo}</p>
        <p><strong>Nombre del Padre:</strong> ${animal.nombrePadre}</p>
        <p><strong>Nombre de la Madre:</strong> ${animal.nombreMadre}</p>
        <p><strong>Establecimiento:</strong> ${animal.establecimiento}</p>
        <p><strong>Fecha de Nacimiento:</strong> ${animal.fechaNacimientoString}</p>
    `;

    // Asigna el contenido al modal
    document.getElementById("modalContent").innerHTML = modalContent;

    // Muestra el modal
    var myModal = new bootstrap.Modal(document.getElementById('animalModal'));
    myModal.show();
}


function updateTotalItems() {
    const totalItems = animalesMostrar.length;
    document.getElementById("total-items").textContent = `Animales cargados: ${totalItems}`;
}


function LimpiarModal() {
    document.getElementById("AnimalID").value = 0;
    document.getElementById("TipoAnimalID").value = 0;
    document.getElementById("Estado").value = 0;
    document.getElementById("Caravana").value = "";
    document.getElementById("Apodo").value = "";
    document.getElementById("NombrePadre").value = "";
    document.getElementById("NombreMadre").value = "";
    document.getElementById("Establecimiento").value = "";
    document.getElementById("FechaNacimiento").value = "";
}

function NuevoAnimal() {
    $("#ModalTitulo").text("Nuevo Animal");
}

function GuardarAnimal() {
    let animalID = document.getElementById("AnimalID").value;
    let tipoAnimalID = document.getElementById("TipoAnimalID").value;
    let estado = document.getElementById("Estado").value;
    let caravana = document.getElementById("Caravana").value;
    let apodo = document.getElementById("Apodo").value;
    let nombrePadre = document.getElementById("NombrePadre").value;
    let nombreMadre = document.getElementById("NombreMadre").value;
    let establecimiento = document.getElementById("Establecimiento").value;
    let fechaNacimiento = document.getElementById("FechaNacimiento").value;

    // mensaje de error
    let camposFaltantes = [];
    if (!caravana) camposFaltantes.push("Caravana");
    if (!animalID) camposFaltantes.push("ID del Animal");
    if (tipoAnimalID === "0") camposFaltantes.push("Tipo de Animal");
    if (tipoAnimalID !== "3" && tipoAnimalID !== "4" && estado === "0") camposFaltantes.push("Estado");
    if (!establecimiento) camposFaltantes.push("Establecimiento");
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
            establecimiento: establecimiento,
            fechaNacimiento: fechaNacimiento,
            Estado: tipoAnimalID === "3" || tipoAnimalID === "4" ? "0" : estado, // Enviar "0" si es Toro o Ternero
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
            document.getElementById("Estado").value = animal.estado;
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

            manejarVisibilidadEstado();

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


var tiposConEstado = [1, 2]; // Cambia estos IDs según tus tipos de animales para Vaca y Vaquillona

function manejarVisibilidadEstado() {
    var tipoAnimalID = parseInt($('#TipoAnimalID').val(), 10);
    var estadoDropdown = $('#Estado');

    if (tiposConEstado.includes(tipoAnimalID)) {
        $('#estadoField').show();
        estadoDropdown.children('option').each(function () {
            var value = parseInt($(this).val(), 10);
            $(this).show();
            if (value === 0) {
                $(this).hide();
            }
        });
    } else {
        $('#estadoField').hide();
    }
}

function resetFormulario() {
    $('#estadoField').hide(); // Oculta el campo Estado
    // No reiniciar el valor de TipoAnimalID
}

$(document).ready(function () {
    // Llamar a la función al cargar la página para manejar el estado inicial
    manejarVisibilidadEstado();

    // Llamar a la función cuando el valor del dropdown de tipo de animal cambie
    $('#TipoAnimalID').change(manejarVisibilidadEstado);

    // Asegúrate de ocultar el campo Estado al cancelar una edición
    $('.btn-cancelar').click(resetFormulario);
});