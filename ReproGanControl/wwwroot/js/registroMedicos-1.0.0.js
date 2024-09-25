window.onload = ListadoRegistrosMedicos();

let registroMedicoMostrar = [];

function ListadoRegistrosMedicos() {
    let buscarCaravana = document.getElementById("BuscarCaravana").value;

    $.ajax({
        url: '../../RegistroMedicos/ListadoRegistrosMedicos',
        type: 'GET',
        data: { BuscarCaravana: buscarCaravana },
        dataType: 'json',
        success: function (data) {
            $("#ModalRegistroMedico").modal("hide");
            LimpiarModalRegistroMedico();
            registroMedicoMostrar = data;
            renderTableRegistroMedico();
            updateTotalItemsRegistroMedico();
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado de eventos');
        }
    });
}

// Función para renderizar la tabla en ambas tablas
function renderTableRegistroMedico() {
    let contenidoTabla = ``;

    $.each(registroMedicoMostrar, function (index, medico) {
        contenidoTabla += `
        <tr>
            <td>${medico.animalCaravana}</td>
            <td>${medico.nombrePersona}</td>
            <td class="ocultar-en-768px">${medico.enfermedad}</td>
            <td class="ocultar-en-768px">${medico.tratamiento}</td>
            <td class="ocultar-en-768px">${medico.observacion}</td>
            <td class="ocultar-en-768px">${medico.fechaString}</td>
            <td class="text-center">
                ${medico.imagenBase64 ? 
                    `<img src="data:image/jpeg;base64,${medico.imagenBase64}" title="Ver Imagen" 
                    style="max-width: 50px; max-height: 50px; cursor: pointer;" 
                    onclick="mostrarImagenGrande('${medico.imagenBase64}', '${medico.animalCaravana}')">` : 
                    'Sin imagen'}
            </td>
            <td class="text-center">
                <button type="button" class="edit-button" title="Editar Registro Medico" onclick="ModalEditarRegistroMedico(${medico.registroMedicoID})">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button type="button" class="delete-button" title="Eliminar Registro Medico" onclick="EliminarRegistroMedico(${medico.registroMedicoID})">
                    <i class="fa-solid fa-trash"></i>
                </button>
                <button type="button" class="info-button" title="Ver más Datos" onclick="showRegistroMedicoDetails(${medico.registroMedicoID})">
                    <i class="fa-solid fa-info-circle"></i>
                </button>
            </td>
        </tr>
        `;
    });

    // Asignar el mismo contenido a ambas tablas
    document.getElementById("tbody-registroMedico").innerHTML = contenidoTabla;
    document.getElementById("tbody-registroMedico-2").innerHTML = contenidoTabla;
}


    // Función actualizada para mostrar la imagen en grande con botones en posiciones originales
    function mostrarImagenGrande(imagenBase64, caravana) {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';

        const imagen = document.createElement('img');
        imagen.src = `data:image/jpeg;base64,${imagenBase64}`;
        imagen.style.maxWidth = '90%';
        imagen.style.maxHeight = '90%';
        imagen.style.objectFit = 'contain';

        const botonCerrar = document.createElement('button');
        botonCerrar.innerHTML = '<i class="fa-solid fa-times"></i>';
        botonCerrar.style.position = 'absolute';
        botonCerrar.style.top = '10px';
        botonCerrar.style.right = '10px';
        botonCerrar.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        botonCerrar.style.border = 'none';
        botonCerrar.style.borderRadius = '50%';
        botonCerrar.style.width = '40px';
        botonCerrar.style.height = '40px';
        botonCerrar.style.cursor = 'pointer';
        botonCerrar.style.fontSize = '20px';
        botonCerrar.style.display = 'flex';
        botonCerrar.style.justifyContent = 'center';
        botonCerrar.style.alignItems = 'center';
        botonCerrar.style.transition = 'background-color 0.3s';

        const botonDescargar = document.createElement('button');
        botonDescargar.innerHTML = '<i class="fa-solid fa-download"></i> Descargar';
        botonDescargar.classList.add('btn-agregar'); // Agrega la clase .btn-agregar
        botonDescargar.style.position = 'absolute';
        botonDescargar.style.bottom = '10px';
        botonDescargar.style.right = '10px';
        botonDescargar.style.backgroundColor = 'rgba(76, 175, 80, 0.8)'; // Mantén el color
        botonDescargar.style.transition = 'background-color 0.3s ease, transform 0.3s ease'; // Solo mantenemos la transición
        botonDescargar.title = 'Descargar imagen'; // Agrega el title aquí
        document.body.appendChild(botonDescargar);
        

        botonCerrar.onmouseover = () => botonCerrar.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        botonCerrar.onmouseout = () => botonCerrar.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        botonDescargar.onmouseover = () => botonDescargar.style.backgroundColor = 'rgba(76, 175, 80, 1)';
        botonDescargar.onmouseout = () => botonDescargar.style.backgroundColor = 'rgba(76, 175, 80, 0.8)';

        const cerrarModal = () => document.body.removeChild(modal);
        botonCerrar.onclick = cerrarModal;
        botonDescargar.onclick = () => descargarImagen(imagenBase64, caravana);

        modal.onclick = (event) => {
            if (event.target === modal) {
                cerrarModal();
            }
        };

        modal.appendChild(imagen);
        modal.appendChild(botonCerrar);
        modal.appendChild(botonDescargar);
        document.body.appendChild(modal);
    }

    // Función para descargar la imagen (sin cambios)
    function descargarImagen(imagenBase64, caravana) {
        const enlace = document.createElement('a');
        enlace.href = `data:image/jpeg;base64,${imagenBase64}`;
        enlace.download = `Registro Medico de Caravana:${caravana}.jpg`;
        document.body.appendChild(enlace);
        enlace.click();
        document.body.removeChild(enlace);
    }

function showRegistroMedicoDetails(registroMedicoID) {
    // Encuentra el registro médico con el ID dado
    const medico = registroMedicoMostrar.find(m => m.registroMedicoID === registroMedicoID);

    // Crea el contenido para el modal
    const modalContent = `
        <p><strong>Caravana del Animal:</strong> ${medico.animalCaravana}</p>
        <p><strong>Fecha:</strong> ${medico.fechaString}</p>
        <p><strong>Enfermedad:</strong> ${medico.enfermedad}</p>
        <p><strong>Tratamiento:</strong> ${medico.tratamiento}</p>
        <p><strong>Nombre de la Persona:</strong> ${medico.nombrePersona}</p>
        <p><strong>Observación:</strong> ${medico.observacion}</p>
    `;

    // Asigna el contenido al modal
    document.getElementById("modalContentRegistroMedico").innerHTML = modalContent;

    // Muestra el modal
    var myModal = new bootstrap.Modal(document.getElementById('registroMedicoModal'));
    myModal.show();
}


function updateTotalItemsRegistroMedico() {
    const totalItems = registroMedicoMostrar.length;
    document.getElementById("total-items-registrosMedicos").textContent = `Registros medicos cargados: ${totalItems}`;
}


function LimpiarModalRegistroMedico() {
    document.getElementById("RegistroMedicoID").value = 0;
    document.getElementById("AnimalID").value = 0;
    document.getElementById("PersonaID").value = 0;
    document.getElementById("Tratamiento").value = "";
    document.getElementById("Enfermedad").value = "";
    document.getElementById("Observacion").value = "";
    document.getElementById("ImagenBase64").value = "";
    document.getElementById("imagenPreview").src = "";
    document.getElementById("imagenPreview").style.display = "none";
    document.getElementById("imagen").value = ""; // Limpiar el input de archivo
}

function NuevoRegistroMedico() {
    $("#ModalTituloRegistroMedico").text("Nuevo Registro Médico");
}

function configurarFechaActual() {
    const fechaInput = document.getElementById("Fecha");
    const hoy = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
    fechaInput.value = hoy; // Establecer la fecha actual como valor predeterminado
    fechaInput.setAttribute('max', hoy); // Restringir la selección a partir de la fecha actual
}

function GuardarRegistroMedico() {
    let registroMedicoID = document.getElementById("RegistroMedicoID").value;
    let animalID = document.getElementById("AnimalID").value;
    let personaID = document.getElementById("PersonaID").value;
    let fecha = document.getElementById("Fecha").value;
    let enfermedad = document.getElementById("Enfermedad").value; 
    let tratamiento = document.getElementById("Tratamiento").value;
    let observacion = document.getElementById("Observacion").value;
    let imagenBase64 = document.getElementById("ImagenBase64").value;

    if (!animalID || !fecha || !enfermedad || !tratamiento) {
        Swal.fire({
            icon: 'warning',
            title: 'Faltan campos',
            text: 'Por favor, completa los campos requeridos para guardar el registro médico.',
            confirmButtonText: 'OK'
        });
        return; 
    }

    $.ajax({
        url: '../../RegistroMedicos/GuardarRegistrosMedicos',
        data: { 
            RegistroMedicoID: registroMedicoID,
            AnimalID: animalID,
            PersonaID: personaID,
            Fecha: fecha, 
            Enfermedad: enfermedad,
            Tratamiento: tratamiento,
            Observacion: observacion,
            ImagenBase64: imagenBase64
        },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            Swal.fire({
                icon: 'success',
                title: 'Guardado correctamente',
                text: 'El registro médico se ha guardado exitosamente.',
                confirmButtonText: 'OK'
            });
            ListadoRegistrosMedicos(); 
        },
        error: function (xhr, status) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Disculpe, existió un problema al guardar el registro médico.',
                confirmButtonText: 'OK'
            });
            console.log('Disculpe, existió un problema al guardar el registro médico');
        }
    });    
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = function() {
        document.getElementById("ImagenBase64").value = reader.result.split(',')[1];
        document.getElementById("imagenPreview").src = reader.result;
        document.getElementById("imagenPreview").style.display = "block";
    }
    
    if (file) {
        reader.readAsDataURL(file);
    } else {
        document.getElementById("ImagenBase64").value = "";
        document.getElementById("imagenPreview").src = "";
        document.getElementById("imagenPreview").style.display = "none";
    }
}

// Llamar a la función para configurar la fecha al cargar la página
document.addEventListener('DOMContentLoaded', configurarFechaActual);

function ModalEditarRegistroMedico(registroMedicoID) {
    $.ajax({
        url: '../../RegistroMedicos/ListadoRegistrosMedicos',
        data: { id: registroMedicoID },
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            if (response && response.length > 0) {
                let medico = response[0];

                document.getElementById("RegistroMedicoID").value = medico.registroMedicoID;
                document.getElementById("AnimalID").value = medico.animalID;
                document.getElementById("PersonaID").value = medico.personaID;
                
                let fecha = new Date(medico.fecha);
                let fechaFormato = fecha.toISOString().split('T')[0];
                document.getElementById("Fecha").value = fechaFormato;
                document.getElementById("Enfermedad").value = medico.enfermedad;
                document.getElementById("Tratamiento").value = medico.tratamiento;
                document.getElementById("Observacion").value = medico.observacion;

                // Manejo de la imagen
                document.getElementById("ImagenBase64").value = medico.imagenBase64;
                if (medico.imagenBase64) {
                    document.getElementById("imagenPreview").src = "data:image/jpeg;base64," + medico.imagenBase64;
                    document.getElementById("imagenPreview").style.display = "block";
                } else {
                    document.getElementById("imagenPreview").src = "";
                    document.getElementById("imagenPreview").style.display = "none";
                }

                $("#ModalTituloRegistroMedico").text("Editar Registro Medico");
                $("#ModalRegistroMedico").modal("show");
            } else {
                console.log('No se encontró el evento.');
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se encontró el evento.',
                    confirmButtonText: 'OK'
                });
            }
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el listado para ser modificado.');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Disculpe, existió un problema al cargar los datos del evento.',
                confirmButtonText: 'OK'
            });
        }
    });
}

function EliminarRegistroMedico(registroMedicoID) {
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
            
            $.ajax({
                url: '../../RegistroMedicos/EliminarRegistrosMedicos',
                data: { RegistroMedicoID: registroMedicoID },
                type: 'POST',
                dataType: 'json',
                success: function (resultado) {
                    ListadoRegistrosMedicos(); 
                    Swal.fire(
                        '¡Eliminado!',
                        'El evento ha sido eliminado.',
                        'success'
                    );
                },
                error: function (xhr, status) {
                    Swal.fire(
                        'Error',
                        'Disculpe, existió un problema al eliminar el evento.',
                        'error'
                    );
                }
            });
        }
    });
}
