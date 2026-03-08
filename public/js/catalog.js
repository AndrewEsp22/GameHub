import { getItems, getItem } from "./services/api.js";

const catalogContainer = document.getElementById("catalogContainer");
const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");

// referencias del modal
const modal = document.getElementById("gameModal");
const closeModalBtn = document.getElementById("closeModal");
const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalCategory = document.getElementById("modalCategory");
const modalPlatform = document.getElementById("modalPlatform");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalStock = document.getElementById("modalStock");

let allItems = [];

// formatea el precio a pesos colombianos
function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', minimumFractionDigits: 0
    }).format(price);
}

// crea la card de un juego y la retorna como elemento html
function createCard(item) {
    const card = document.createElement("div");
    card.classList.add("game-card");

    card.innerHTML = `
        <img class="card-cover" src="${item.image || 'https://via.placeholder.com/300x400?text=Sin+Imagen'}" alt="${item.name}">
        <div class="card-textBox">
            <p class="card-head">${item.name}</p>
            <div class="card-tags">
                <span class="tag">${item.category || "General"}</span>
                <span class="tag tag-platform">${item.platform || "N/A"}</span>
            </div>
            <p class="card-price">${formatPrice(item.price || 0)}</p>
            <button class="btn-detail" data-id="${item.id}">Ver detalle</button>
        </div>
    `;

    // al hacer click en el boton se abre el modal
    card.querySelector(".btn-detail").addEventListener("click", () => openModal(item.id));

    return card;
}

// renderiza las cards en el contenedor
function renderCatalog(items) {
    catalogContainer.innerHTML = "";

    if (items.length === 0) {
        catalogContainer.innerHTML = `<p class="empty-msg">No se encontraron juegos 😕</p>`;
        return;
    }

    items.forEach(item => {
        catalogContainer.appendChild(createCard(item));
    });
}

// llena el select de categorias sin repetir
function populateCategories(items) {
    const cats = [...new Set(items.map(i => i.category).filter(Boolean))];
    cats.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        filterCategory.appendChild(opt);
    });
}

// filtra los items segun el texto y la categoria
function filterItems() {
    const query = searchInput.value.toLowerCase().trim();
    const cat = filterCategory.value;

    let filtered = allItems;

    if (query) {
        filtered = filtered.filter(item =>
            item.name.toLowerCase().includes(query) ||
            (item.description && item.description.toLowerCase().includes(query))
        );
    }

    if (cat) {
        filtered = filtered.filter(item => item.category === cat);
    }

    renderCatalog(filtered);
}

// abre el modal y carga la info del juego por id
async function openModal(id) {
    try {
        const item = await getItem(id);

        modalImage.src = item.image || "https://via.placeholder.com/300x400?text=Sin+Imagen";
        modalImage.alt = item.name;
        modalName.textContent = item.name;
        modalCategory.textContent = item.category || "General";
        modalPlatform.textContent = item.platform || "N/A";
        modalDescription.textContent = item.description || "Sin descripción disponible.";
        modalPrice.textContent = formatPrice(item.price || 0);
        modalStock.textContent = item.stock != null ? `${item.stock} unidades` : "No disponible";

        modal.style.display = "flex";
        // bloquear scroll del body cuando el modal esta abierto
        document.body.style.overflow = "hidden";
    } catch (err) {
        console.error("Error cargando detalle:", err);
        alert("No se pudo cargar el detalle del juego");
    }
}

// cierra el modal
function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "";
}

// eventos
closeModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
    // si hace click fuera del contenido se cierra
    if (e.target === modal) closeModal();
});

// cerrar con Escape tambien
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "flex") {
        closeModal();
    }
});

searchInput.addEventListener("input", filterItems);
filterCategory.addEventListener("change", filterItems);

// cargar catalogo al inicio
async function loadCatalog() {
    try {
        allItems = await getItems();
        populateCategories(allItems);
        renderCatalog(allItems);
    } catch (err) {
        console.error("Error cargando catálogo:", err);
        catalogContainer.innerHTML = `<p class="empty-msg">Error al cargar el catálogo 😢</p>`;
    }
}

loadCatalog();