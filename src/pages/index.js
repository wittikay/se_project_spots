// ========== Imports ==========
import "./index.css";
import { Api } from "../utils/Api.js";
import {
  enableValidation,
  resetValidation,
  disableBtn,
  settings,
} from "../scripts/validation.js";
import headerLogoSrc from "../images/Logo.svg";
import profileAvatarPencilSrc from "../images/pencil-whte.svg";
import profileImgSrc from "../images/avatar.jpg";
import profileEditImgSrc from "../images/Group-2.svg";
import profileAddImgSrc from "../images/Group-26.svg";
import modalBlackXSrc from "../images/close-iconblk.svg";
import modalWhiteXSrc from "../images/close-iconwht.svg";

// ========== Globals ==========
let currentUserId;
let selectedCard = null, selectedCardId = null;

// ========== DOM Elements ==========
const dom = {
  headerLogo: document.getElementById("header__logo"),
  profileImg: document.getElementById("profile__image"),
  profileAvatarPencil: document.getElementById("profile__image-btn-img"),
  profileEditImg: document.getElementById("profile__edit-btn-img"),
  profileAddImg: document.getElementById("profile__add-btn-img"),
  avatarModalBlackX: document.getElementById("modal__close-btn-img-avatar"),
  deleteModalWhiteX: document.getElementById("modal__close-btn-img-delete"),
  editModalBlackX: document.getElementById("modal__close-btn-img-edit"),
  addModalBlackX: document.getElementById("modal__close-btn-img-add"),
  modalWhiteX: document.getElementById("modal__close-btn-img-whte"),
  cardsList: document.querySelector(".cards__list"),
  cardTemplate: document.getElementById("cards__template").content.querySelector(".card"),
  avatarEditForm: document.forms["edit-avatar-form"],
  avatarEditBtn: document.querySelector(".profile__image-btn"),
  avatarEditSaveBtn: document.querySelector("#edit-avatar-modal .modal__submit-btn"),
  avatarEditModal: document.querySelector("#edit-avatar-modal"),
  avatarEditInput: document.querySelector("#edit-avatar-modal #link"),
  avatarCloseBtn: document.querySelector("#edit-avatar-modal .modal__close-btn"),
  profileEditBtn: document.querySelector(".profile__edit-btn"),
  profileEditModal: document.querySelector("#edit-profile-modal"),
  closeEditModalBtn: document.querySelector("#edit-profile-modal .modal__close-btn"),
  editProfileForm: document.forms["edit-profile"],
  profileName: document.querySelector(".profile__name"),
  profileDescription: document.querySelector(".profile__description"),
  editProfileName: document.querySelector("#edit-profile-modal #name"),
  editProfileDescription: document.querySelector("#edit-profile-modal #description"),
  profileAddBtn: document.querySelector(".profile__add-btn"),
  profileAddModal: document.querySelector("#new-post-modal"),
  closeAddModalBtn: document.querySelector("#new-post-modal .modal__close-btn"),
  modalSaveBtn: document.querySelector(".modal__submit-btn"),
  profileAddForm: document.querySelector("#new-post-modal .modal__form"),
  profileAddLink: document.querySelector("#new-post-modal #link"),
  profileAddCaption: document.querySelector("#new-post-modal #caption"),
  deletePostModal: document.querySelector("#delete-modal"),
  submitDeletePostBtn: document.querySelector(".modal__delSubmit-btn"),
  cancelDeletePostBtn: document.querySelector(".modal__delCancel-btn"),
  closeDeletePostModalBtn: document.querySelector(".modal__delModal-close-btn"),
  previewModal: document.getElementById("preview-modal"),
  closePreviewModalBtn: document.querySelector("#preview-modal .modal__close-btn_preview"),
  previewImage: document.querySelector("#preview-modal .modal__image"),
  previewCaption: document.querySelector("#preview-modal .modal__caption"),
};

// ========== Set Image Sources ==========
(function setImageSources() {
  dom.headerLogo.src = headerLogoSrc;
  dom.profileImg.src = profileImgSrc;
  dom.profileAvatarPencil.src = profileAvatarPencilSrc;
  dom.avatarModalBlackX.src = modalBlackXSrc;
  dom.deleteModalWhiteX.src = modalWhiteXSrc;
  dom.editModalBlackX.src = modalBlackXSrc;
  dom.addModalBlackX.src = modalBlackXSrc;
  dom.profileEditImg.src = profileEditImgSrc;
  dom.profileAddImg.src = profileAddImgSrc;
  dom.modalWhiteX.src = modalWhiteXSrc;
})();

// ========== API Instance ==========
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "43cc3865-d5d1-4d69-b4db-e6be73290a5f",
    "Content-Type": "application/json",
  },
});

// ========== Modal Helpers ==========
const openModal = (modal) => {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscKey);
  modal.addEventListener("click", handleOverlayClick);
};

const closeModal = (modal) => {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscKey);
  modal.removeEventListener("click", handleOverlayClick);
};

const addOpenModalListener = (trigger, modal, cb) => {
  trigger.addEventListener("click", () => {
    if (cb) cb();
    openModal(modal);
  });
};

const addCloseModalListener = (button, modal) => {
  button.addEventListener("click", () => closeModal(modal));
};

function handleOverlayClick(evt) {
  if (evt.target.classList.contains("modal_is-opened")) {
    closeModal(evt.target);
  }
}

function handleEscKey(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) closeModal(openedModal);
  }
}

// ========== Card Helpers ==========
function handleLikeClick(likeBtn, cardId) {
  const isLiked = likeBtn.classList.contains("card__like-btn_active");
  api
    .changeLikeStatus(cardId, !isLiked)
    .then((card) => {
      const isNowLiked = card.isLiked;
      likeBtn.classList.toggle("card__like-btn_active", isNowLiked);
    })
    .catch((err) => console.error("Error changing like status:", err));
}

function getCardElement(data) {
  const cardElement = dom.cardTemplate.cloneNode(true);
  cardElement.querySelector(".card__title").textContent = data.name;
  const cardImage = cardElement.querySelector(".card__image");
  cardImage.alt = data.name;
  cardImage.src = data.link;

  const likeBtn = cardElement.querySelector(".card__like-btn");
  const isLiked = (data.likes || []).some((user) => user._id === currentUserId);
  likeBtn.classList.toggle("card__like-btn_active", isLiked);

  if (data.isLiked) {
    likeBtn.classList.add("card__like-btn_active");
  } else {
    likeBtn.classList.remove("card__like-btn_active");
  }

  likeBtn.addEventListener("click", () => handleLikeClick(likeBtn, data._id));
  cardElement.querySelector(".card__del-btn").addEventListener("click", () => handleDelCard(cardElement, data));
  cardImage.addEventListener("click", () => openPreviewModal(data));
  return cardElement;
}

function renderCard(data, container) {
  const cardElement = getCardElement(data);
  container.prepend(cardElement);
}

function openPreviewModal(data) {
  dom.previewImage.src = data.link;
  dom.previewImage.alt = data.name;
  dom.previewCaption.textContent = data.name;
  openModal(dom.previewModal);
}

// ========== Delete Card ==========
function handleDelCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(dom.deletePostModal);
}

function handleDelSubmit(evt) {
  evt.preventDefault();
  api.deleteCard(selectedCardId).then(() => {
    selectedCard.remove();
    closeModal(dom.deletePostModal);
    selectedCard = null;
    selectedCardId = null;
  });
}
dom.submitDeletePostBtn.addEventListener("click", handleDelSubmit);

// ========== Avatar Edit ==========
function handleAvatarEditSave(evt) {
  evt.preventDefault();
  // Add avatar update logic here
  console.log(dom.avatarEditInput.value);
}
dom.avatarEditForm.addEventListener("submit", handleAvatarEditSave);

// ========== Modal Listeners ==========
addOpenModalListener(dom.avatarEditBtn, dom.avatarEditModal, () => {
  resetValidation(
    dom.avatarEditModal,
    Array.from(dom.avatarEditModal.querySelectorAll(settings.inputSelector)),
    settings
  );
});
addCloseModalListener(dom.avatarCloseBtn, dom.avatarEditModal);

addOpenModalListener(dom.profileEditBtn, dom.profileEditModal, () => {
  dom.editProfileName.value = dom.profileName.textContent;
  dom.editProfileDescription.value = dom.profileDescription.textContent;
  resetValidation(
    dom.editProfileForm,
    Array.from(dom.editProfileForm.querySelectorAll(settings.inputSelector)),
    settings
  );
});
addCloseModalListener(dom.closeEditModalBtn, dom.profileEditModal);

addOpenModalListener(dom.profileAddBtn, dom.profileAddModal, () => {
  dom.profileAddForm.reset();
  resetValidation(
    dom.profileAddForm,
    Array.from(dom.profileAddForm.querySelectorAll(settings.inputSelector)),
    settings
  );
  disableBtn(
    dom.profileAddForm.querySelector(settings.submitButtonSelector),
    settings
  );
});
addCloseModalListener(dom.closeAddModalBtn, dom.profileAddModal);

addCloseModalListener(dom.closeDeletePostModalBtn, dom.deletePostModal);
addCloseModalListener(dom.cancelDeletePostBtn, dom.deletePostModal);
addCloseModalListener(dom.closePreviewModalBtn, dom.previewModal);

// ========== Form Submissions ==========
dom.editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  api
    .editUserInfo({
      name: dom.editProfileName.value,
      about: dom.editProfileDescription.value,
    })
    .then((user) => {
      dom.profileImg.src = user.avatar;
      dom.profileName.textContent = user.name;
      dom.profileDescription.textContent = user.about;
      closeModal(dom.profileEditModal);
    })
    .catch((err) => console.error("Error updating user info:", err));
});

dom.profileAddForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  api
    .addNewCard({
      name: dom.profileAddCaption.value,
      link: dom.profileAddLink.value,
    })
    .then((card) => {
      renderCard(card, dom.cardsList);
      dom.profileAddForm.reset();
      disableBtn(dom.modalSaveBtn, settings);
      closeModal(dom.profileAddModal);
    })
    .catch((err) => console.error("Error adding new card:", err));
});

// ========== Initial Data Load ==========
api
  .getAppInfo()
  .then(([user, cards]) => {
    currentUserId = user._id;
    dom.profileName.textContent = user.name;
    dom.profileDescription.textContent = user.about;
    dom.profileImg.src = user.avatar;
    cards.forEach((card) => renderCard(card, dom.cardsList));
  })
  .catch((err) => console.error("Error fetching initial data:", err));
