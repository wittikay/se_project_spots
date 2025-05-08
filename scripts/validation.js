const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit_inactive",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error",
};

const showInputError = (formEl, inputEl, errorMsg) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = errorMsg;
  inputEl.classList.add(settings.inputErrorClass);
};
const hideInputError = (formEl, inputEl) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = "";
  inputEl.classList.remove(settings.inputErrorClass);
};

const checkInputValidity = (formEl, inputEl) => {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage);
  } else {
    hideInputError(formEl, inputEl);
  }
};
const hasInvalidInput = (inputLi) => {
  return inputLi.some((inputEl) => {
    return !inputEl.validity.valid;
  });
};

const disableBtn = (buttonEl, config) => {
  buttonEl.disabled = true;
  buttonEl.classList.add(settings.inactiveButtonClass);
};
const toggleButtonState = (inputLi, buttonEl) => {
  if (hasInvalidInput(inputLi)) {
    disableBtn(buttonEl);
  } else {
    buttonEl.disabled = false;
    buttonEl.classList.remove(settings.inactiveButtonClass);
  }
};
const setEventListeners = (formEl) => {
  const inputLi = Array.from(formEl.querySelectorAll(settings.inputSelector));
  const buttonEl = formEl.querySelector(settings.submitButtonSelector);
  toggleButtonState(inputLi, buttonEl);
  inputLi.forEach((inputEl) => {
    inputEl.addEventListener("input", () => {
      checkInputValidity(formEl, inputEl);
      toggleButtonState(inputLi, buttonEl);
    });
  });
};
const enableValidation = (config) => {
  const formLi = document.querySelectorAll(settings.formSelector);
  formLi.forEach((formEl) => {
    setEventListeners(formEl);
  });
};
enableValidation(settings);
