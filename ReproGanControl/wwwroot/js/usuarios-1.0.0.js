window.onload = function () {
    ListadoUsuarios();
};

function ListadoUsuarios() {
    $.ajax({
        url: '/Usuarios/ListadoUsuarios',
        type: 'GET',
        success: function (vistaUsuarios) {
            var tbody = $('#tbody-usuarios');
            tbody.empty(); // Limpiar el cuerpo de la tabla

            vistaUsuarios.forEach(function (usuario) {
                var fila = `
                    <tr>
                        <td>${usuario.email}</td>
                        <td>${usuario.rol}</td>
                        <td>
                            <button class="delete-button" onclick="EliminarUsuario('${usuario.usuarioID}')">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
                tbody.append(fila);
            });
        },
        error: function () {
            Swal.fire('Error', 'Error al cargar la lista de usuarios.', 'error');
        }
    });
}

// Función para guardar (crear) un nuevo usuario
function GuardarUsuarios() {
    var email = $('#email').val();
    var password = $('#password').val();
    var rol = $('#rol').val();

    if (!email || !password || !rol) {
        Swal.fire('Atención', 'Todos los campos son obligatorios.', 'warning');
        return;
    }

    $.ajax({
        url: '/Usuarios/CrearUsuario',
        type: 'POST',
        data: {
            email: email,
            password: password,
            rol: rol
        },
        success: function (response) {
            if (response.exito) {
                Swal.fire('Éxito', response.mensaje, 'success').then(() => {
                    $('#ModalUsuarios').modal('hide');
                    LimpiarUsuario();
                    ListadoUsuarios();
                });
            } else {
                Swal.fire('Atención', response.mensaje, 'warning');
            }
        },
        error: function () {
            Swal.fire('Error', 'Error al guardar el usuario.', 'error');
        }
    });
}

// Función para eliminar un usuario
function EliminarUsuario(usuarioID) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/Usuarios/EliminarUsuario',
                type: 'POST',
                data: { usuarioId: usuarioID },
                success: function (response) {
                    if (response.exito) {
                        Swal.fire('Eliminado', response.mensaje, 'success').then(() => {
                            ListadoUsuarios();
                        });
                    } else {
                        Swal.fire('Atención', response.mensaje, 'warning');
                    }
                },
                error: function () {
                    Swal.fire('Error', 'Error al eliminar el usuario.', 'error');
                }
            });
        }
    });
}

// Función para limpiar los campos del modal de creación/edición
function LimpiarUsuario() {
    $('#email').val('');
    $('#password').val('');
    $('#rol').val('USUARIO');
    $('#UsuarioID').val('0');
}
