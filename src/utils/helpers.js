export function setButtonText(button, text) {
  if (button) {
    button.textContent = text;
  } else {
    console.warn('Button element is not defined');
  }
}
