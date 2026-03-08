// funcion para formatear precio en pesos colombianos
function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);
}

export function renderItems(items, tableBody) {
    tableBody.innerHTML = "";
    items.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${formatPrice(item.price || 0)}</td>
            <td>${item.category || "—"}</td>
            <td>${item.stock ?? 0}</td>
            <td>${item.platform || "—"}</td>
            <td class="actions-cell">
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
    form.querySelector("#name").value = item.name;
    form.querySelector("#description").value = item.description || "";
    form.querySelector("#price").value = item.price || "";
    form.querySelector("#category").value = item.category || "";
    form.querySelector("#stock").value = item.stock ?? "";
    form.querySelector("#platform").value = item.platform || "";
    form.querySelector("#image").value = item.image || "";
    if (submitBtn) submitBtn.textContent = "Guardar cambios";
}