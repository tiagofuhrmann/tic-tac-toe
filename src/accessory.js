export { createHr };

function createHr(className) {
    let hr = document.createElement("hr");
    hr.className = className;
    return hr;
}
