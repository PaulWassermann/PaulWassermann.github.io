import { storage } from "./globals.js";

// VERSION NUMBER DISPLAY
if (!storage.getItem("version")) {
    import("../package.json", { with: { type: "json" } }).then(
        response => {
            let { default: package_data } = response;
            storage.setItem("version", package_data.version);
            displayVersion();
        }
    ).catch(
        err => console.error(err)
    )
} else {
    displayVersion();
}


function displayVersion() {
    let element = document.getElementById("version");
    element.innerHTML = storage.getItem("version");
}
