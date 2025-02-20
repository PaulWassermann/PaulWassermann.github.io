import { storage } from "./globals.js";

let french_flag = document.getElementById("french-flag");
let usa_flag = document.getElementById("usa-flag");

let page = location.href.split("/").pop();
if (page === "") page = "index.html";

let storage_item = "text_" + page;

// Configure flags to set correct language
let html_tag = document.querySelector("html")
french_flag.onclick = () => {
    setLanguage("fr-FR", false);
    french_flag.style.display = "none";
    usa_flag.style.display = "block";
}
usa_flag.onclick = () => {
    setLanguage("en-US", false);
    usa_flag.style.display = "none";
    french_flag.style.display = "block";
}

if ((storage.getItem("language") || "fr-FR") === "fr-FR") {
    french_flag.style.display = "none";
} else {
    usa_flag.style.display = "none";
}

// TODO : handle the case where localization is not properly initialized
if (!storage.getItem(storage_item)) {
    let text_file = page.split(".")[0];
    import(`../static/localization/${text_file}.json`, { with: { type: "json"} }).then(
        response => {
            let { default: text_data } = response;
            storage.setItem(storage_item, JSON.stringify(text_data));
            // Set the page to initial language
            setLanguage((storage.getItem("language") || "fr-FR"), true);
        }
    ).catch(
        err => console.error(err)
    )
} else {
    // Set the page to initial language
    setLanguage((storage.getItem("language") || "fr-FR"), true);
}

function setLanguage(language, force_refresh) {
    let text_data = JSON.parse(storage.getItem(storage_item));
    if (force_refresh || language !== storage.getItem("language")) {
        storage.setItem("language", language);

        // Modify the language of the document for accessibility
        html_tag.lang = language;
        
        let elements = document.querySelectorAll(".localize");
        elements.forEach(element => {
            if (element.id in text_data) {
                if (!(language in text_data[element.id])) {
                    console.warn(
                        "Language:", language, 
                        "is not available for element id:", 
                        element.id,
                        "on page:", page, 
                        ". Localization data:", text_data[element.id]
                    )
                }
                switch (element.tagName) {
                    case "IMG":
                        element.alt = text_data[element.id][language];
                        break;
                    default:
                        element.innerHTML = text_data[element.id][language];
                        break;
                }
            } else {
                console.warn(
                    "Element id:", element.id, 
                    "is not referenced for page:", page,
                    ". Localization data:", text_data
                )
            }
        });
    }
}
