window.onload = ListadoInformeAnimales();

let vistaInformeAnimalesGlobal = [];

function ListadoInformeAnimales() {
    let tipoAnimalBuscarID = document.getElementById("TipoAnimalBuscarID").value;
    let buscarEstablecimiento = document.getElementById("BuscarEstablecimiento").value;
    $.ajax({
        url: '../../Animales/ListadoInformeAnimales',
        data: {
            tipoAnimalBuscarID: tipoAnimalBuscarID,
            buscarEstablecimiento: buscarEstablecimiento
        },
        type: 'POST',
        dataType: 'json',

        success: function (vistaInformeAnimales) {
            vistaInformeAnimalesGlobal = vistaInformeAnimales; // Almacenar datos globalmente
            let contenidoTabla = ``;

            $.each(vistaInformeAnimales, function (Index, Animal) {
                contenidoTabla += `
                <tr>
                    <td class="text-center">${Animal.tipoAnimalNombre}</td>
                    <td class="text-center"></td>
                    <td class="ocultar-en-768px" class="text-center"></td>
                    <td class="ocultar-en-768px" class="text-center"></td>
                    <td class="ocultar-en-768px" class="text-center"></td>
                    <td class="ocultar-en-768px" class="text-center"></td>
                    <td class="ocultar-en-768px" class="text-center"></td>
                    <td class="ocultar-en-768px" class="text-center"></td>
                    <td class="text-center">
                        <button type="button" class="info-button" onclick="showAnimalDetails(${Animal.tipoAnimalID})">
                            <i class="fa-solid fa-info-circle"></i>
                        </button>
                    </td>
                </tr>
                `;

                $.each(Animal.vistaAnimales, function (index, Animales) {
                    contenidoTabla += `
                    <tr>
                        <td class="text-center"></td>
                        <td class="text-center">${Animales.caravana}</td>
                        <td class="ocultar-en-768px" class="text-center">${Animales.apodo || ''}</td>
                        <td class="ocultar-en-768px" class="text-center">${Animales.establecimiento}</td>
                        <td class="ocultar-en-768px" class="text-center">${Animales.fechaNacimientoString}</td>
                        <td class="ocultar-en-768px" class="text-center">${Animales.nombrePadre || ''}</td>
                        <td class="ocultar-en-768px" class="text-center">${Animales.nombreMadre || ''}</td>
                        <td class="text-center"></td>
                    </tr>
                    `;
                });
            });
            document.getElementById("tbody-informeAnimales").innerHTML = contenidoTabla;
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado :(');
        }
    });
}

function showAnimalDetails(tipoAnimalID) {
    // Encuentra el animal con el ID dado en la variable global
    const animal = vistaInformeAnimalesGlobal.find(a => a.tipoAnimalID === tipoAnimalID);

    // Crea el contenido para el modal
    const modalContent = `
        <h5>${animal.tipoAnimalNombre}</h5>
        <ul>
            ${animal.vistaAnimales.map(a => `
                <li>
                    <strong>Caravana:</strong> ${a.caravana}<br>
                    <strong>Apodo:</strong> ${a.apodo}<br>
                    <strong>Establecimiento:</strong> ${a.establecimiento}<br>
                    <strong>Fecha de Nacimiento:</strong> ${a.fechaNacimientoString}<br>
                    <strong>Nombre del Padre:</strong> ${a.nombrePadre}<br>
                    <strong>Nombre de la Madre:</strong> ${a.nombreMadre}
                </li>
            `).join('')}
        </ul>
    `;

    // Asigna el contenido al modal
    document.getElementById("modalContentInformeAnimales").innerHTML = modalContent;

    // Muestra el modal
    var myModal = new bootstrap.Modal(document.getElementById('informeAnimalesModal'));
    myModal.show();
}
