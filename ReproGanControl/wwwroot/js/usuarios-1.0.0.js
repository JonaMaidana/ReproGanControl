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

            // Iterar sobre la lista de usuarios y agregarlos a la tabla
            vistaUsuarios.forEach(function (usuario) {
                var fila = `
                    <tr>
                        <td>${usuario.email}</td>
                        <td>${usuario.rol}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="EditarUsuario('${usuario.usuarioID}')">Editar</button>
                        </td>
                    </tr>
                `;
                tbody.append(fila);
            });
        },
        error: function () {
            alert('Error al cargar la lista de usuarios.');
        }
    });
}

// Función para guardar (crear) un nuevo usuario
function GuardarUsuarios() {
    var email = $('#email').val();
    var password = $('#password').val();
    var rol = $('#rol').val();

    // Validar que los campos no estén vacíos
    if (!email || !password || !rol) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    // Petición AJAX para guardar el usuario
    $.ajax({
        url: '/Usuarios/CrearUsuario', // Ruta hacia el controlador de crear usuario
        type: 'POST',
        data: {
            email: email,
            password: password,
            rol: rol
        },
        success: function (response) {
            if (response.exito) {
                alert(response.mensaje);
                $('#ModalUsuarios').modal('hide'); // Ocultar el modal
                LimpiarUsuario(); // Limpiar el formulario del modal
                ListadoUsuarios(); // Actualizar la lista de usuarios
            } else {
                alert(response.mensaje);
            }
        },
        error: function () {
            alert('Error al guardar el usuario.');
        }
    });
}

// Función para eliminar un usuario
function EliminarUsuario(usuarioID) {
    // Confirmar antes de eliminar
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        return;
    }

    // Petición AJAX para eliminar el usuario
    $.ajax({
        url: '/Usuarios/EliminarUsuario', // Ruta hacia el controlador de eliminar usuario
        type: 'POST',
        data: { usuarioId: usuarioID },
        success: function (response) {
            if (response.exito) {
                alert(response.mensaje);
                ListadoUsuarios(); // Actualizar la lista de usuarios
            } else {
                alert(response.mensaje);
            }
        },
        error: function () {
            alert('Error al eliminar el usuario.');
        }
    });
}

// Función para limpiar los campos del modal de creación/edición
function LimpiarUsuario() {
    $('#email').val('');
    $('#password').val('');
    $('#rol').val('USUARIO'); // Restablecer el rol por defecto
    $('#UsuarioID').val('0'); // Resetear el ID de usuario (si se usa para edición)
}