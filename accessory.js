export { createInput, createLabel, createHr };

function createInput(id, name, className, type, value = "") {
  const input = document.createElement("input");
  input.id = id;
  input.name = name;
  input.className = className;
  input.type = type;
  input.value = value;
  return input;
}

function createLabel(htmlFor, innerText) {
  const label = document.createElement("label");
  label.htmlFor = htmlFor;
  label.innerText = innerText;
  return label;
}

function createHr(className) {
  let hr = document.createElement("hr");
  hr.className = className;
  return hr;
}
