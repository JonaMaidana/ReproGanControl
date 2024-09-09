// Cuando se carga la página, listamos las provincias
window.onload = ListadoProvincia;

let provincias = [];

function ListadoProvincia() {
    $.ajax({
        url: '/Provincias/ListadoProvincia', // Ajustar la URL al formato correcto del controlador
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $("#ModalProvincia").modal("hide");
            LimpiarModal();
            provincias = data;
            renderTableProvincias();
            updateTotalItemsProvincias();
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado de provincias');
        }
    });
}

function renderTableProvincias() {
    let contenidoTabla = ``;

    $.each(provincias, function (index, provincia) {
        contenidoTabla += `
        <tr>
            <td>${provincia.nombre}</td>
            <td class="text-center">
                <button type="button" class="edit-button" onclick="ModalEditarProvincia(${provincia.provinciaID})">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
            </td>
            <td class="text-center">
                <button type="button" class="delete-button" onclick="EliminarProvincia(${provincia.provinciaID})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById("tbody-provincia").innerHTML = contenidoTabla;
}

function updateTotalItemsProvincias() {
    const totalItems = provincias.length;
    document.getElementById("total-items-provincia").textContent = `Provincias Cargadas: ${totalItems}`;
}

function LimpiarModal() {
    document.getElementById("ProvinciaID").value = "0"; // Reiniciar el ID a 0
    document.getElementById("Nombre").value = "";
}

function NuevaProvincia() {
    LimpiarModal();
    $("#ModalTitulo").text("Nueva Provincia");
    $("#ModalProvincia").modal("show");
}

function GuardarProvincias() {
    let provinciaID = document.getElementById("ProvinciaID").value;
    let nombre = document.getElementById("Nombre").value;

    // Validar si el campo de nombre está vacío
    if (!nombre.trim()) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Debe ingresar un nombre para la provincia.'
        });
        return;
    }

    // Realizar la solicitud AJAX para crear o editar la provincia
    $.ajax({
        url: '/Provincias/CrearProvincia',
        data: {
            provinciaID: provinciaID,
            nombre: nombre
        },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            if (!resultado) {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'La provincia se ha guardado exitosamente.',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    ListadoProvincia(); // Actualizar el listado de provincias después de guardar
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: resultado // Mostrar el mensaje de error si hay algún problema
                });
            }
        },
        error: function (xhr, status) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Disculpe, existió un problema al guardar la provincia.'
            });
            console.log('Disculpe, existió un problema al guardar la provincia');
        }
    });
}

function ModalEditarProvincia(provinciaID) {
    $.ajax({
        url: '/Provincias/ListadoProvincia', // Cambiar al endpoint correcto
        data: { id: provinciaID },
        type: 'GET', // Cambiar a GET ya que estás obteniendo información
        dataType: 'json',
        success: function (response) {
            if (response && response.length > 0) {
                let provincia = response[0];

                document.getElementById("ProvinciaID").value = provincia.provinciaID;
                document.getElementById("Nombre").value = provincia.nombre;
                $("#ModalTitulo").text("Editar Provincia");
                $("#ModalProvincia").modal("show");
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se encontró la provincia.',
                    confirmButtonText: 'OK'
                });
            }
        },
        error: function (xhr, status) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Disculpe, existió un problema al cargar los datos de la provincia.',
                confirmButtonText: 'OK'
            });
        }
    });
}

function EliminarProvincia(provinciaID) {
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
                url: '/Provincias/EliminarProvincia', // Ajustar la URL
                data: { provinciaID: provinciaID },
                type: 'POST',
                dataType: 'json',
                success: function (resultado) {
                    if (resultado === true) {
                        ListadoProvincia(); // Actualiza el listado de provincias
                        Swal.fire(
                            '¡Eliminado!',
                            'La provincia ha sido eliminada.',
                            'success'
                        );
                    } else {
                        Swal.fire(
                            'Error',
                            resultado, // Mensaje de error específico del backend
                            'error'
                        );
                    }
                },
                error: function (xhr, status) {
                    Swal.fire(
                        'Error',
                        'Disculpe, existió un problema al eliminar la provincia.',
                        'error'
                    );
                }
            });
        }
    });
}



// window.onload = ListadoProvincia;

// let provincias = [];

// function ListadoProvincia() {
//     $.ajax({
//         url: '../../Provincias/ListadoProvincia',
//         type: 'GET',
//         dataType: 'json',
//         success: function (data) {
//             $("#ModalProvincia").modal("hide");
//             LimpiarModal();
//             provincias = data;
//             renderTableProvincias();
//             updateTotalItemsProvincias();
//         },
//         error: function (xhr, status) {
//             console.log('Disculpe, existió un problema al cargar el listado de eventos');
//         }
//     });
// }

// function renderTableProvincias() {
//     let contenidoTabla = ``;

//     $.each(provincias, function (index, provincia) {
//         contenidoTabla += `
//         <tr>
//             <td>${provincia.nombre}</td>
//             <td class="text-center">
//                 <button type="button" class="edit-button" onclick="ModalEditarProvincia(${provincia.provinciaID})">
//                     <i class="fa-solid fa-pen-to-square"></i>
//                 </button>
//             </td>
//             <td class="text-center">
//                 <button type="button" class="delete-button" onclick="EliminarProvincia(${provincia.provinciaID})">
//                     <i class="fa-solid fa-trash"></i>
//                 </button>
//             </td>
//         </tr>
//         `;
//     });

//     document.getElementById("tbody-provincia").innerHTML = contenidoTabla;
// }

// function updateTotalItemsProvincias() {
//     const totalItems = provincias.length;
//     document.getElementById("total-items-provincia").textContent = `Provincias Cargadas: ${totalItems}`;
// }

// function LimpiarModal() {
//  document.getElementById("Nombre").value = "";
// }

// function NuevaProvincia() {
//     $("#ModalTitulo").text("Nueva Provincia");
// }

// function GuardarProvincias() {
//     let provinciaID = document.getElementById("ProvinciaID").value;;
//     let nombre = document.getElementById("Nombre").value;


//     // Si todos los campos están completos, proceder con la solicitud AJAX
//     $.ajax({
//         url: '../../Provincias/CrearProvincia',
//         data: {
//             ProvinciaID: provinciaID,
//             Nombre:nombre,
//         },
//         type: 'POST',
//         dataType: 'json',
//         success: function (resultado) {
//             if (resultado.resultado) {
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'Éxito',
//                     text: 'La provincia se ha guardado exitosamente.',
//                     confirmButtonText: 'Aceptar'
//                 }).then(() => {
//                     ListadoProvincia(); // Llamar a la función para listar eventos después de guardar
//                 });
//             } else {
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Error',
//                     text: resultado.message // Mostrar el mensaje de error si el AnimalID ya está asociado a otro evento
//                 });
//             }
//         },
//         error: function (xhr, status) {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error',
//                 text: 'Disculpe, existió un problema al guardar la provincia.'
//             });
//             console.log('Disculpe, existió un problema al guardar el evento');
//         }
//     });
// }

// function ModalEditarProvincia(provinciaID) {
//     $.ajax({
//         url: '../../Provincias/ListadoProvincia',
//         data: { id: provinciaID },
//         type: 'POST',
//         dataType: 'json',
//         success: function (response) {
//             if (response && response.length > 0) {
//                 let provincia = response[0];

//                 document.getElementById("ProvinciaID").value = provincia.provinciaID;
//                 document.getElementById("Nombre").value = provincia.nombre;
//                 $("#ModalTitulo").text("Editar Provincia");
//                 $("#ModalProvincia").modal("show");
//             } else {
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Error',
//                     text: 'No se encontró el evento.',
//                     confirmButtonText: 'OK'
//                 });
//             }
//         },
//         error: function (xhr, status) {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error',
//                 text: 'Disculpe, existió un problema al cargar los datos del evento.',
//                 confirmButtonText: 'OK'
//             });
//         }
//     });
// }

// function EliminarProvincia(provinciaID) {
//     Swal.fire({
//         title: '¿Estás seguro?',
//         text: "¡No podrás deshacer esta acción!",
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonText: 'Sí, eliminar',
//         cancelButtonText: 'Cancelar',
//         reverseButtons: true
//     }).then((result) => {
//         if (result.isConfirmed) {
//             // Confirmado, proceder con la eliminación
//             $.ajax({
//                 url: '../../Provincias/EliminarProvincia',
//                 data: { provinciaID: provinciaID },
//                 type: 'POST',
//                 dataType: 'json',
//                 success: function (resultado) {
//                     ListadoProvincia(); // Actualiza el listado de eventos
//                     Swal.fire(
//                         '¡Eliminado!',
//                         'El evento ha sido eliminado.',
//                         'success'
//                     );
//                 },
//                 error: function (xhr, status) {
//                     Swal.fire(
//                         'Error',
//                         'Disculpe, existió un problema al eliminar el evento.',
//                         'error'
//                     );
//                 }
//             });
//         }
//     });
// }