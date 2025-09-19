const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");

let lastActionWasResult = false;

function appendValue(value) {
  if (display.value === "Error") {
    display.value = value;
    lastActionWasResult = false;
    return;
  }
  if (lastActionWasResult) {
    if (["+", "-", "*", "/"].includes(value)) {
      display.value += value;
    } else {
      display.value = value;
    }
  } else {
    display.value += value;
  }
  lastActionWasResult = false;
}

function deleteLast() {
  if (display.value) {
    display.value = display.value.slice(0, -1);
  }
  lastActionWasResult = false;
}

function clearDisplay() {
  if (display.value === "Error") {
    display.value = display.value.slice(0, -1);
  } else {
    display.value = "";
  }
  lastActionWasResult = false;
}

function calculate() {
  try {
    if (!display.value) return;
    display.value = eval(display.value);
    lastActionWasResult = true;
  } catch {
    display.value = "Error";
    lastActionWasResult = false;
  }
}

function sqrt() {
  try {
    if (!display.value) return;
    let value = eval(display.value);
    if (value < 0) {
      display.value = "Error";
      return;
    }
    display.value = Math.sqrt(value);
    lastActionWasResult = true;
  } catch {
    display.value = "Error";
    lastActionWasResult = false;
  }
}

// Vincular botones
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    const value = btn.dataset.value;

    if (action === "clear") return clearDisplay();
    if (action === "delete") return deleteLast();
    if (action === "calculate") return calculate();
    if (action === "sqrt") return sqrt();

    if (value !== undefined) appendValue(value);
  });
});
