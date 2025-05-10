const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit_inactive",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error",
};

const showInputError = (formEl, inputEl, errorMsg, config) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = errorMsg;
  errorMsgEl.classList.add(config.errorClass); // Add the error class to the error message
  inputEl.classList.add(config.inputErrorClass); // Add the error class to the input
};

const hideInputError = (formEl, inputEl, config) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = ""; // Clear the error message
  errorMsgEl.classList.remove(config.errorClass); // Remove the error class from the error message
  inputEl.classList.remove(config.inputErrorClass); // Remove the error class from the input
};

const checkInputValidity = (formEl, inputEl, config) => {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage, config);
  } else {
    hideInputError(formEl, inputEl, config);
  }
};
const hasInvalidInput = (inputLi) => {
  return inputLi.some((inputEl) => {
    return !inputEl.validity.valid;
  });
};

const disableBtn = (buttonEl, config) => {
  buttonEl.disabled = true;
  buttonEl.classList.add(config.inactiveButtonClass);
};
const toggleButtonState = (inputLi, buttonEl, config) => {
  if (hasInvalidInput(inputLi)) {
    disableBtn(buttonEl, config);
  } else {
    buttonEl.disabled = false;
    buttonEl.classList.remove(config.inactiveButtonClass);
  }
};
const setEventListeners = (formEl, config) => {
  const inputLi = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonEl = formEl.querySelector(config.submitButtonSelector);
  toggleButtonState(inputLi, buttonEl, config);
  inputLi.forEach((inputEl) => {
    inputEl.addEventListener("input", () => {
      checkInputValidity(formEl, inputEl, config);
      toggleButtonState(inputLi, buttonEl, config);
    });
  });
};
const enableValidation = (config) => {
  const formLi = document.querySelectorAll(config.formSelector);
  formLi.forEach((formEl) => {
    setEventListeners(formEl, config);
  });
};
enableValidation(settings);
