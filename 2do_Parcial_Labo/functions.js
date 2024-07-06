document.addEventListener('DOMContentLoaded', () => {});

export function LoadData(url) {
    const xmlRequest = new XMLHttpRequest();

    xmlRequest.open('GET', url, true);

    xmlRequest.onreadystatechange = function () {
        if (xmlRequest.readyState === XMLHttpRequest.DONE) {
            if (xmlRequest.status === 200) {
                const jsonResponse = xmlRequest.responseText;
                const dataList = GenerateList(jsonResponse);

                UpdateTable(dataList);
            } else {
                console.error('Error al cargar los datos.');
            }
        }
    };

    xmlRequest.send();
}

function GenerateList(jsonString) {
    return JSON.parse(jsonString);
}

function UpdateTable(dataList) {
    const tableContents = document.getElementById('table-contents');
    tableContents.innerHTML = '';

    dataList.forEach((item) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id || 'N/A'}</td>
            <td>${item.nombre || 'N/A'}</td>
            <td>${item.apellido || 'N/A'}</td>
            <td>${item.edad || 'N/A'}</td>
            <td>${item.sueldo || 'N/A'}</td>
            <td>${item.ventas || 'N/A'}</td>
            <td>${item.compras || 'N/A'}</td>
            <td>${item.telefono || 'N/A'}</td>
            <td><button class="modify-btn">Modificar</button></td>
            <td><button class="delete-btn">Eliminar</button></td>
        `;
        tableContents.appendChild(row);
    });
}
