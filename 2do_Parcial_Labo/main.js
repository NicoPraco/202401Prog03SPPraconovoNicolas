// import { LoadData } from './functions';

let lista = [];

const btnAgregar = document.getElementById('add-btn');

const btnAceptarFormABM = document.getElementById('abm-form-accept');
const btnCancelarFormABM = document.getElementById('abm-form-cancel');

// ======================================================================================================================================================

document.addEventListener('DOMContentLoaded', () => {
    const endpointURL = 'https://examenesutn.vercel.app/api/PersonaCiudadanoExtranjero'; // Reemplaza esto con la URL real en línea.

    MostrarSpinner();

    LoadData(endpointURL, function (success) {
        if (success) {
            OcultarSpinner();
        } else {
            console.error('Error al cargar los datos.');
        }
    });
});

btnAgregar.addEventListener('click', () => {
    AgregarElemento();
});

btnCancelarFormABM.addEventListener('click', () => {
    LimpiarFormularioABM();
    OcultarFormularioABM();
    MostrarFormularioLista();
});

// ======================================================================================================================================================

// #region Region de Funciones

function LoadData(url, callback) {
    const xmlRequest = new XMLHttpRequest();

    xmlRequest.open('GET', url, true);

    xmlRequest.onreadystatechange = function () {
        if (xmlRequest.readyState === XMLHttpRequest.DONE) {
            if (xmlRequest.status === 200) {
                const jsonResponse = xmlRequest.responseText;
                const dataList = GenerateList(jsonResponse);

                UpdateTable(dataList);
                lista = dataList;
                callback(true); // Llamar al callback con éxito
            } else {
                console.error('Error al cargar los datos.');
                callback(false); // Llamar al callback con error
            }
        }
    };

    xmlRequest.send();
}

function GenerateList(jsonString) {
    return JSON.parse(jsonString);
}

// ======================================================================================================================================================

async function EliminarElemento(index) {
    const elemento = lista[index];

    document.getElementById('abm-form-action-title').innerText = 'Eliminar';
    document.getElementById('abm-form-id').value = elemento.id;
    document.getElementById('abm-form-name').value = elemento.nombre;
    document.getElementById('abm-form-surname').value = elemento.apellido;
    document.getElementById('abm-form-birthday').value = elemento.fechaNacimiento;
    document.getElementById('abm-form-type').value = elemento.dni ? 'Ciudadano' : 'Extranjero';
    document.getElementById('abm-form-dni').value = elemento.dni || '';
    document.getElementById('abm-form-origen-country').value = elemento.paisOrigen || '';

    BloquearCamposFormulario();
    MostrarOpcionesSegunSelect();

    OcultarFormularioLista();
    MostrarFormularioABM();

    btnAceptarFormABM.addEventListener('click', async () => {
        try {
            HabilitarCamposFormulario();
            MostrarSpinner();

            const response = await fetch('https://examenesutn.vercel.app/api/PersonaCiudadanoExtranjero', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: elemento.id }),
            });

            if (response.ok) {
                lista.splice(index, 1);
                UpdateTable(lista);

                OcultarSpinner();
                OcultarFormularioABM();
                MostrarFormularioLista();
            } else {
                throw new Error('No se pudo realizar la operación');
            }
        } catch (error) {
            console.error(error);
            OcultarSpinner();
            OcultarFormularioABM();
            MostrarFormularioLista();
            alert('No se pudo realizar la operación');
        }
    });
}

function CargarFormularioParaModificar(elemento) {
    document.getElementById('abm-form-action-title').textContent = 'Modificar';
    document.getElementById('abm-form-id').value = elemento.id;
    document.getElementById('abm-form-id').disabled = true;
    document.getElementById('abm-form-name').value = elemento.nombre;
    document.getElementById('abm-form-surname').value = elemento.apellido;
    document.getElementById('abm-form-birthday').value = elemento.fechaNacimiento;
    document.getElementById('abm-form-type').disabled = true;

    if (elemento.dni) {
        document.getElementById('abm-form-type').value = 'Ciudadano';
        document.getElementById('abm-form-dni').value = elemento.dni;
        document.getElementById('abm-form-lbl-dni').classList.remove('hidden');
        document.getElementById('abm-form-dni').classList.remove('hidden');
        document.getElementById('abm-form-lbl-origen-country').classList.add('hidden');
        document.getElementById('abm-form-origen-country').classList.add('hidden');
    } else if (elemento.paisOrigen) {
        document.getElementById('abm-form-type').value = 'Extranjero';
        document.getElementById('abm-form-origen-country').value = elemento.paisOrigen;
        document.getElementById('abm-form-lbl-origen-country').classList.remove('hidden');
        document.getElementById('abm-form-origen-country').classList.remove('hidden');
        document.getElementById('abm-form-lbl-dni').classList.add('hidden');
        document.getElementById('abm-form-dni').classList.add('hidden');
    }
}

function ModificarElemento(index) {
    const elemento = lista[index];

    HabilitarCamposFormulario();
    MostrarOpcionesSegunSelect();

    OcultarFormularioLista();
    MostrarFormularioABM();

    CargarFormularioParaModificar(elemento);

    btnAceptarFormABM.addEventListener('click', () => {
        // Bloquear la pantalla con el contenedor Spinner
        MostrarSpinner();

        // Construir el objeto elemento con los datos modificados
        const elementoModificado = {
            id: elemento.id,
            nombre: document.getElementById('abm-form-name').value,
            apellido: document.getElementById('abm-form-surname').value,
            fechaNacimiento: document.getElementById('abm-form-birthday').value,
        };

        if (elemento.dni) {
            elementoModificado.dni = document.getElementById('abm-form-dni').value;
        } else if (elemento.paisOrigen) {
            elementoModificado.paisOrigen = document.getElementById('abm-form-origen-country').value;
        }

        // Realizar la solicitud PUT al API
        //fetch(`https://examenesutn.vercel.app/api/PersonaCiudadanoExtranjero/${elemento.id}`, {
        fetch('https://examenesutn.vercel.app/api/PersonaCiudadanoExtranjero', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(elementoModificado),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('No se pudo modificar el elemento');
                }
                return response.json();
            })
            .then((data) => {
                // Actualizar el elemento en la lista con los datos recibidos del servidor
                elemento.nombre = data.nombre;
                elemento.apellido = data.apellido;
                elemento.fechaNacimiento = data.fechaNacimiento;
                elemento.dni = data.dni;
                elemento.paisOrigen = data.paisOrigen;

                OcultarSpinner();
                OcultarFormularioABM();
                MostrarFormularioLista();
                UpdateTable(lista);
            })
            .catch((error) => {
                console.error(error);

                OcultarSpinner();
                OcultarFormularioABM();
                MostrarFormularioLista();

                // Mostrar advertencia de que no se pudo realizar la operación
                alert('No se pudo realizar la operación de modificación');
            });
    });
}

// ======================================================================================================================================================

function UpdateTable(dataList) {
    const tableContents = document.getElementById('table-contents');
    tableContents.innerHTML = '';

    dataList.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.nombre}</td>
            <td>${item.apellido}</td>
            <td>${item.fechaNacimiento}</td>
            <td>${item.dni || 'N/A'}</td>
            <td>${item.paisOrigen || 'N/A'}</td>
            <td><button class="modify-btn">Modificar</button></td>
            <td><button class="delete-btn">Eliminar</button></td>
        `;
        tableContents.appendChild(row);

        const modifyButton = row.querySelector('.modify-btn');
        modifyButton.addEventListener('click', () => {
            ModificarElemento(index);
        });

        // Agregar evento click al botón de eliminar
        const deleteButton = row.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => {
            EliminarElemento(index);
        });
    });
}

async function AgregarElemento() {
    document.getElementById('abm-form-action-title').innerText = 'Alta';

    HabilitarCamposFormulario();
    OcultarFormularioLista();
    MostrarFormularioABM();
    MostrarOpcionesSegunSelect();

    btnAceptarFormABM.addEventListener('click', async () => {
        const nombreABM = document.getElementById('abm-form-name').value;
        const apellidoABM = document.getElementById('abm-form-surname').value;
        const fechaNacimientoABM = document.getElementById('abm-form-birthday').value;
        const tipoElemento = document.getElementById('abm-form-type').value;
        const dniABM = document.getElementById('abm-form-dni').value;
        const paisOrigenABM = document.getElementById('abm-form-origen-country').value;

        const elemento = {
            nombre: nombreABM,
            apellido: apellidoABM,
            fechaNacimiento: fechaNacimientoABM,
        };

        if (tipoElemento === 'Ciudadano') {
            elemento.dni = dniABM;
        } else if (tipoElemento === 'Extranjero') {
            elemento.paisOrigen = paisOrigenABM;
        }

        try {
            MostrarSpinner();

            const response = await fetch('https://examenesutn.vercel.app/api/PersonaCiudadanoExtranjero', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(elemento),
            });

            if (response.ok) {
                const data = await response.json();
                elemento.id = data.id;

                AgregarElementoALista(elemento);

                OcultarSpinner();
                OcultarFormularioABM();
                MostrarFormularioLista();
            } else {
                throw new Error('No se pudo realizar la operación');
            }
        } catch (error) {
            console.error(error);
            OcultarSpinner();
            OcultarFormularioABM();
            MostrarFormularioLista();
            alert('No se pudo realizar la operación');
        }
    });
}

function AgregarElementoALista(elemento) {
    lista.push(elemento);
    UpdateTable(lista);
}

//#endregion

// ======================================================================================================================================================

//#region Region de funciones para Mostrar y Ocultar Elementos

function MostrarSpinner() {
    let contenedor = document.getElementById('contenedor-spinner');

    contenedor.classList.remove('hidden');
}

function OcultarSpinner() {
    let contenedor = document.getElementById('contenedor-spinner');

    contenedor.classList.add('hidden');
}

function MostrarFormularioLista() {
    let formLista = document.getElementById('list-form');

    formLista.classList.remove('hidden');
}

function OcultarFormularioLista() {
    let formLista = document.getElementById('list-form');

    formLista.classList.add('hidden');
}

function MostrarFormularioABM() {
    let formABM = document.getElementById('abm-form');

    formABM.classList.remove('hidden');
}

function OcultarFormularioABM() {
    let formABM = document.getElementById('abm-form');

    formABM.classList.add('hidden');
}

function MostrarOpcionesSegunSelect() {
    const select = document.getElementById('abm-form-type');

    select.addEventListener('change', () => {
        const selectValue = select.value;

        const lblPaisOrigen = document.getElementById('abm-form-lbl-origen-country');
        const inputPaisOrigen = document.getElementById('abm-form-origen-country');
        const lblDni = document.getElementById('abm-form-lbl-dni');
        const inputDni = document.getElementById('abm-form-dni');

        if (selectValue === 'Ciudadano') {
            lblPaisOrigen.classList.add('hidden');
            inputPaisOrigen.classList.add('hidden');
            lblDni.classList.remove('hidden');
            inputDni.classList.remove('hidden');
        } else if (selectValue === 'Extranjero') {
            lblDni.classList.add('hidden');
            inputDni.classList.add('hidden');
            lblPaisOrigen.classList.remove('hidden');
            inputPaisOrigen.classList.remove('hidden');
        }
    });

    // Disparar el evento change para que la UI esté en el estado correcto al cargar
    select.dispatchEvent(new Event('change'));
}

function LimpiarFormularioABM() {
    document.getElementById('abm-form-name').value = '';
    document.getElementById('abm-form-surname').value = '';
    document.getElementById('abm-form-birthday').value = '';
    document.getElementById('abm-form-dni').value = '';
    document.getElementById('abm-form-origen-country').value = '';
}

function HabilitarCamposFormulario() {
    document.getElementById('abm-form-id').disabled = false;
    document.getElementById('abm-form-name').disabled = false;
    document.getElementById('abm-form-surname').disabled = false;
    document.getElementById('abm-form-birthday').disabled = false;
    document.getElementById('abm-form-dni').disabled = false;
    document.getElementById('abm-form-origen-country').disabled = false;
}

function BloquearCamposFormulario() {
    document.getElementById('abm-form-id').disabled = true;
    document.getElementById('abm-form-name').disabled = true;
    document.getElementById('abm-form-surname').disabled = true;
    document.getElementById('abm-form-birthday').disabled = true;
    document.getElementById('abm-form-dni').disabled = true;
    document.getElementById('abm-form-origen-country').disabled = true;
}

//#endregion
