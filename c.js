/* Modal closing support */

for (let closeButton of Array.from(document.querySelectorAll("close-button"))) {
    closeButton.setAttribute("triggers", closeButton.parentElement.id);
}

/* Modal activation support */

for (let element of Array.from(document.querySelectorAll("[triggers]"))) {
    element.addEventListener("click", ((targetId) => (() => {
        const targetElement = document.getElementById(targetId);
        if (targetElement === null || targetElement === undefined) {
            console.error(`ItemNotFoundError: Clicked button triggers ID '${targetId}', but it doesn't exist`);
            return;
        }
        targetElement.style.display = targetElement.style.display === "none" ? "flex" : "none";
    }))(element.getAttribute("triggers")));
}

/* Slideshow actuation support */

let slideshows = [];
for (let slideshow of Array.from(document.querySelectorAll("slideshow"))) {
    slideshows.push(slideshow.id);
    
}