export function renderItems(items, tableBody) {
    tableBody.innerHTML = "";
    items.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.description || ""}</td>
            <td>${item.categoria || ""}</td>
            <td>$${Number(item.precio).toLocaleString("es-CO")}</td>
            <td>${item.stock}</td>
            <td>
                <button class="btn-edit" data-id="${item.id}">Editar</button>
                <button class="btn-delete" data-id="${item.id}">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

export function resetForm(form, submitBtn) {
    form.reset();
    if (submitBtn) submitBtn.textContent = "Agregar";
}

export function fillForm(form, item, submitBtn) {
    form.querySelector("#name").value        = item.name;
    form.querySelector("#description").value = item.description || "";
    form.querySelector("#categoria").value   = item.categoria   || "";
    form.querySelector("#precio").value      = item.precio      || 0;
    form.querySelector("#stock").value       = item.stock       || 0;
    form.querySelector("#imagen").value      = item.imagen      || "";
    if (submitBtn) submitBtn.textContent = "Guardar cambios";
}