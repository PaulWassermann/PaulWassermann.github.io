let french_flag = document.getElementById("french-flag");
let storage = sessionStorage;
let usa_flag = document.getElementById("usa-flag");

// Configure flags to set correct language
html_tag = document.querySelector("html")
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

if (storage.getItem("language") || "fr-FR") {
    french_flag.style.display = "none";
} else {
    usa_flag.style.display = "none";
}

// TODO : handle the case where localization is not properly initialized
if (!storage.getItem("text_data")) {
    // fetch("https://PaulWassermann.github.io/localization/text.json").then(
    fetch("https://raw.githubusercontent.com/PaulWassermann/PaulWassermann.github.io/refs/heads/main/localization/text.json").then(
        response => response.json()
    ).then(
        response => {
            storage.setItem("text_data", JSON.stringify(response));
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
    let text_data = JSON.parse(storage.getItem("text_data"));
    if (force_refresh || language !== storage.getItem("language")) {
        storage.setItem("language", language);

        // Get the current displayed page
        let page = location.href.split("/").pop();
        if (page === "") page = "index.html";
        
        // Set the language of the document for accessibility
        html_tag.lang = language;
        
        if (page in text_data) {
            let elements = document.querySelectorAll(".localize");
            elements.forEach(element => {
                if (element.id in text_data[page]) {
                    if (!(language in text_data[page][element.id])) {
                        console.warn(
                            "Language:", language, 
                            "is not available for element id:", 
                            element.id,
                            "on page:", page, 
                            ". Localization data:", text_data[page][element.id]
                        )
                    }
                    switch (element.tagName) {
                        case "IMG":
                            element.alt = text_data[page][element.id][language];
                            break;
                        default:
                            element.innerHTML = text_data[page][element.id][language];
                            break;
                    }
                } else {
                    console.warn(
                        "Element id:", element.id, 
                        "is not referenced for page:", page,
                        ". Localization data:", text_data[page]
                    )
                }
            });
        } else {
            console.warn(
                "Page:", page, "is not referenced in localization data:",
                text_data
            );
        }
    }
}
