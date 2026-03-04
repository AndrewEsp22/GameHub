
Copiar

const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "data", "items.json");

function readData() {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
}

function writeData(data) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

function handleItemsRoutes(req, res) {
    if (!req.url.startsWith("/api/items")) return false;

    res.setHeader("Content-Type", "application/json");

    // GET /api/items
    if (req.method === "GET" && req.url === "/api/items") {
        res.end(JSON.stringify(readData()));
        return true;
    }

    // GET /api/items/:id
    if (req.method === "GET" && req.url.startsWith("/api/items/")) {
        const id = parseInt(req.url.split("/").pop());

        if (!isNaN(id)) {
            const item = readData().find(i => i.id === id);
            res.end(JSON.stringify(item || { error: "No encontrado" }));
            return true;
        }
    }

    // POST /api/items
    if (req.method === "POST" && req.url === "/api/items") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            const items = readData();
            const data = JSON.parse(body);

            const nuevo = {
                id:          Date.now(),
                name:        data.name        || "",
                description: data.description || "",
                categoria:   data.categoria   || "",
                precio:      Number(data.precio) || 0,
                stock:       Number(data.stock)  || 0,
                imagen:      data.imagen      || "",
            };

            items.push(nuevo);
            writeData(items);
            res.end(JSON.stringify(nuevo));
        });
        return true;
    }

    // PUT /api/items/:id
    if (req.method === "PUT" && req.url.startsWith("/api/items/")) {
        const id = parseInt(req.url.split("/").pop());

        if (!isNaN(id)) {
            let body = "";
            req.on("data", chunk => body += chunk);
            req.on("end", () => {
                let items = readData();
                const idx = items.findIndex(i => i.id === id);

                if (idx >= 0) {
                    const data = JSON.parse(body);
                    const updated = {
                        ...items[idx],
                        name:        data.name        ?? items[idx].name,
                        description: data.description ?? items[idx].description,
                        categoria:   data.categoria   ?? items[idx].categoria,
                        precio:      data.precio !== undefined ? Number(data.precio) : items[idx].precio,
                        stock:       data.stock  !== undefined ? Number(data.stock)  : items[idx].stock,
                        imagen:      data.imagen      ?? items[idx].imagen,
                        id,
                    };
                    items[idx] = updated;
                    writeData(items);
                    res.end(JSON.stringify(updated));
                } else {
                    res.end(JSON.stringify({ error: "No encontrado" }));
                }
            });
            return true;
        }
    }

    // DELETE /api/items/:id
    if (req.method === "DELETE" && req.url.startsWith("/api/items/")) {
        const id = parseInt(req.url.split("/").pop());

        if (!isNaN(id)) {
            let items = readData();
            const newItems = items.filter(i => i.id !== id);

            if (newItems.length !== items.length) {
                writeData(newItems);
                res.end(JSON.stringify({ mensaje: "Eliminado" }));
            } else {
                res.end(JSON.stringify({ error: "No encontrado" }));
            }
            return true;
        }
    }

    return false;
}

module.exports = handleItemsRoutes;