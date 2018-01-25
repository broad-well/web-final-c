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
        targetElement.style.display = targetElement.style.display !== "flex" ? "flex" : "none";
    }))(element.getAttribute("triggers")));
}

/* Slideshow actuation support */

/*
 * Note: Upon updating the DOM of the slideshow element, initialize() should be called again
 *   to relabel the slide elements and recapture the left/right arrows and dots (as required)
 */
class Slideshow {

    get element() {
        return document.getElementById(this.id);
    }

    get slides() {
        return Array.from(this.element.children).filter(it => it.tagName.toLowerCase() === "slide");
    }

    get activeIndex() {
        for (let slide of this.slides) {
            if (slide.classList.contains("active-slide")) {
                return Number(slide.getAttribute("slide-number"));
            }
        }
        return null;
    }

    get dots() {
        return this.element.getElementsByTagName("dots")[0];
    }

    set activeIndex(newIndex) {
        const currentIndex = this.activeIndex;

        if (currentIndex !== null) {
            this.slides[currentIndex].classList.remove("active-slide");
        }

        this.slides[newIndex].classList.add("active-slide");
    }

    // --- INITIALIZATION PROCEDURES ---

    labelSlides() {
        this.slides.forEach((slide, index) => {
            slide.setAttribute("slideshow-id", this.id);
            slide.setAttribute("slide-number", index);
        });
    }

    captureArrowButtons() {
        Array.from(this.element.getElementsByTagName("left-arrow")).forEach(leftArrow => {
            leftArrow.addEventListener("click", this.onLeftArrow.bind(this));
        });
        Array.from(this.element.getElementsByTagName("right-arrow")).forEach(rightArrow => {
            rightArrow.addEventListener("click", this.onRightArrow.bind(this));
        });
    }

    resetDots() {
        if (this.dots === null || this.dots === undefined) {
            throw Error("Tried to reset dots when no <dots> element found");
            Slideshow.die();
            return;
        }

        this.dots.innerHTML = "";
        const slideCount = this.slides.length;
        for (let i = 0; i < slideCount; ++i) {
            const newDot = document.createElement("dot");
            newDot.setAttribute("for-slide-index", i.toString());
            newDot.addEventListener("click", (slides => (function () {
                slides.onDot(Number(this.getAttribute("for-slide-index")))
            }))(this));
            this.dots.appendChild(newDot);
        }
    }

    // ---

    onRightArrow() {
        this.activeIndex = (this.activeIndex + 1) % this.slides.length;
    }

    onLeftArrow() {
        const slideNum = this.slides.length;
        this.activeIndex = (this.activeIndex + slideNum - 1) % slideNum;
    }

    onDot(forIndex) {
        this.activeIndex = forIndex;
    }

    init() {
        this.labelSlides();
        this.captureArrowButtons();
        this.resetDots();
    }

    // ---

    /* Error proof */
    static die() {
        alert("I'm sorry, Michael messed up with his slideshows. See the console for more details.");
    }

    /**
     * Constructs a new slideshow model.
     * @param {string} id The ID of the enveloping <slideshow> element.
     */
    constructor(id) {
        this.id = id;
        this.activeIndex = 0;
        if (this.slides.length === 0) {
            throw Error(`Slideshow element with ID ${id} has no slides in it!`);
            Slideshow.die();
            return;
        }
        if (this.dots === undefined) {
            throw Error(`Slideshow element with ID ${id} has no dots element!`);
            return;
        }
        
        // Initialization functions
        this.init();
    }
}
let slideshows = {};
for (let slideshow of Array.from(document.querySelectorAll("slideshow"))) {
    slideshows[slideshow.id] = new Slideshow(slideshow.id);
}