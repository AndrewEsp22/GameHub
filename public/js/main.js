import { getItems, getItem, createItem, updateItem, deleteItem } from "./services/api.js";
import { renderItems, resetForm, fillForm } from "./ui/ui.js";

const form = document.getElementById("itemForm");
const tableBody = document.getElementById("itemsTable");
const submitBtn = document.getElementById("submitBtn");
let editingId = null;

// delegacion de eventos en la tabla
tableBody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = Number(btn.dataset.id);

    if (btn.classList.contains("btn-delete")) {
        try {
            await deleteItem(id);
            loadItems();
        } catch (err) {
            console.error("Error eliminando:", err);
            alert("No se pudo eliminar el item.");
        }
    } else if (btn.classList.contains("btn-edit")) {
        try {
            if (editingId === id) {
                resetForm(form, submitBtn);
                editingId = null;
                return;
            }
            const item = await getItem(id);
            fillForm(form, item, submitBtn);
            editingId = id;
        } catch (err) {
            console.error("Error cargando item:", err);
            alert("No se pudo cargar el item para edición.");
        }
    }
});

// envio del formulario con todos los campos
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.querySelector("#name").value;
    const description = form.querySelector("#description").value;
    const price = Number(form.querySelector("#price").value) || 0;
    const category = form.querySelector("#category").value;
    const stock = Number(form.querySelector("#stock").value) || 0;
    const platform = form.querySelector("#platform").value;
    const image = form.querySelector("#image").value;

    if (!name) {
        alert("El campo nombre es obligatorio");
        return;
    }

    const itemData = { name, description, price, category, stock, platform, image };

    try {
        if (editingId) {
            await updateItem(editingId, itemData);
            editingId = null;
        } else {
            await createItem(itemData);
        }

        resetForm(form, submitBtn);
        loadItems();
    } catch (err) {
        console.error("Error guardando item:", err);
        alert("No se pudo guardar el item.");
    }
});

// cargar items al inicio
async function loadItems() {
    try {
        const items = await getItems();
        renderItems(items, tableBody);
    } catch (err) {
        console.error("Error cargando lista:", err);
        alert("No se pudieron cargar los items.");
    }
}

loadItems();