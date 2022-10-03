export const CANVAS = document.getElementById("Canvas");
export const CTX2D = CANVAS.getContext("2d");
export function canvasFitWindow() {
    CANVAS.width = window.innerWidth - 20;
    CANVAS.height = window.innerHeight - 20;
}
