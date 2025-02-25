import { storage } from "./globals.js";

let themable_elements = document.getElementsByClassName("themable");

let toggle_button_container = document.getElementById("theme-toggle-button-container");
let toggle_button = document.getElementById("theme-toggle-button");
let sun_img = document.getElementById("sun-img");
let moon_img = document.getElementById("moon-img");

if (!storage.getItem("theme")) {
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
        setTheme("dark");
    } else {
        setTheme("light");
    }
} else {
    setTheme(storage.getItem("theme"));
}

if (toggle_button_container) {
    toggle_button_container.onclick = toggleTheme;
}

function setTheme(theme) {
    let old_theme = (theme === "light") ? "dark": "light";

    storage.setItem("theme", theme);

    if (toggle_button) {
        sun_img.style.opacity = (theme === "light") ? 1 : 0;
        moon_img.style.opacity = (theme === "dark") ? 1 : 0;

        toggle_button.classList.remove(old_theme);
        toggle_button.classList.add(theme);
    }

    for (let element of themable_elements) {
        element.classList.remove(old_theme);
        element.classList.add(theme);

        if (element.id == "github-logo") {
            element.src = element.src.split("/").slice(0, -1).join("/") + `/github-logo-${theme}-mode.png`;
        }
    }
}

function toggleTheme() {
    if (storage.getItem("theme") === "light") {
        setTheme("dark");
    } else {
        setTheme("light");
    }
}
