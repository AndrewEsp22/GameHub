// logica del toggle de tema claro/oscuro
// se guarda en localStorage para que persista entre paginas

const toggle = document.getElementById("themeToggle");

// checked = noche (oscuro), unchecked = dia (claro)
function applyTheme(dark) {
    if (dark) {
        document.body.classList.remove("light-mode");
    } else {
        document.body.classList.add("light-mode");
    }
}

// revisar si hay algo guardado
const saved = localStorage.getItem("theme");

if (saved === "light") {
    toggle.checked = false;
    applyTheme(false);
} else {
    // por defecto oscuro
    toggle.checked = true;
    applyTheme(true);
}

toggle.addEventListener("change", () => {
    const isDark = toggle.checked;
    applyTheme(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
});
