let project_thumbnails = document.getElementsByClassName("project-thumbnail");

for (let thumbnail of project_thumbnails) {
    thumbnail.onpointerover = (event) => {

        for (let thumbnail of project_thumbnails) {
            thumbnail.classList.remove("elevated-anim");
        }

        if (event.pointerType === "mouse") {
            thumbnail.classList.add("elevated-anim");
        }
    }
};
