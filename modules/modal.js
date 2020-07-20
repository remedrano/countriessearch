class Modal {
    constructor() {}

    initModal() {

        var modal = document.querySelector(".modal");
        var closeButton = document.querySelector(".close-button");
        closeButton.addEventListener("click", function() {
            modal.classList.toggle("show-modal");
        });

        return modal;
    }

}