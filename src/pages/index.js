import "./index.css";
import { Api } from "../utils/Api.js";
import {
  enableValidation,
  resetValidation,
  disableBtn,
  settings,
} from "../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";
import headerLogoSrc from "../images/Logo.svg";
import profileAvatarPencilSrc from "../images/pencil-whte.svg";
import profileImgSrc from "../images/avatar.jpg";
import profileEditImgSrc from "../images/Group-2.svg";
import profileAddImgSrc from "../images/Group-26.svg";
import modalBlackXSrc from "../images/close-iconblk.svg";
import modalWhiteXSrc from "../images/close-iconwht.svg";

let currentUserId;
let selectedCard = null,
  selectedCardId = null;

const headerLogo = document.getElementById("header__logo");
const profileImg = document.getElementById("profile__image");
const profileAvatarPencil = document.getElementById("profile__image-btn-img");
const profileEditImg = document.getElementById("profile__edit-btn-img");
const profileAddImg = document.getElementById("profile__add-btn-img");
const avatarModalBlackX = document.getElementById(
  "modal__close-btn-img-avatar"
);
const deleteModalWhiteX = document.getElementById(
  "modal__close-btn-img-delete"
);
const editModalBlackX = document.getElementById("modal__close-btn-img-edit");
const addModalBlackX = document.getElementById("modal__close-btn-img-add");
const modalWhiteX = document.getElementById("modal__close-btn-img-whte");
const cardsList = document.querySelector(".cards__list");
const cardTemplate = document
  .getElementById("cards__template")
  .content.querySelector(".card");
const avatarEditForm = document.forms["edit-avatar-form"];
const avatarEditBtn = document.querySelector(".profile__image-btn");
const avatarEditSaveBtn = document.querySelector(
  "#edit-avatar-modal .modal__submit-btn"
);
const avatarEditModal = document.querySelector("#edit-avatar-modal");
const avatarEditInput = document.querySelector("#edit-avatar-modal #link");
const avatarCloseBtn = document.querySelector(
  "#edit-avatar-modal .modal__close-btn"
);
const profileEditBtn = document.querySelector(".profile__edit-btn");
const profileEditModal = document.querySelector("#edit-profile-modal");
const closeEditModalBtn = document.querySelector(
  "#edit-profile-modal .modal__close-btn"
);
const editProfileForm = document.forms["edit-profile"];
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const editProfileName = document.querySelector("#edit-profile-modal #name");
const editProfileDescription = document.querySelector(
  "#edit-profile-modal #description"
);
const profileAddBtn = document.querySelector(".profile__add-btn");
const profileAddModal = document.querySelector("#new-post-modal");
const closeAddModalBtn = document.querySelector(
  "#new-post-modal .modal__close-btn"
);
const modalSaveBtn = document.querySelector(".modal__submit-btn");
const profileAddForm = document.querySelector("#new-post-modal .modal__form");
const addModalSaveBtn = profileAddModal.querySelector(".modal__submit-btn");
const profileAddLink = document.querySelector("#new-post-modal #link");
const profileAddCaption = document.querySelector("#new-post-modal #caption");
const deletePostModal = document.querySelector("#delete-modal");
const submitDeletePostBtn = document.querySelector(".modal__delSubmit-btn");
const cancelDeletePostBtn = document.querySelector(".modal__delCancel-btn");
const closeDeletePostModalBtn = document.querySelector(
  ".modal__delModal-close-btn"
);
const previewModal = document.getElementById("preview-modal");
const closePreviewModalBtn = document.querySelector(
  "#preview-modal .modal__close-btn_preview"
);
const previewImage = document.querySelector("#preview-modal .modal__image");
const previewCaption = document.querySelector("#preview-modal .modal__caption");

(function setImageSources() {
  headerLogo.src = headerLogoSrc;
  profileImg.src = profileImgSrc;
  profileAvatarPencil.src = profileAvatarPencilSrc;
  avatarModalBlackX.src = modalBlackXSrc;
  deleteModalWhiteX.src = modalWhiteXSrc;
  editModalBlackX.src = modalBlackXSrc;
  addModalBlackX.src = modalBlackXSrc;
  profileEditImg.src = profileEditImgSrc;
  profileAddImg.src = profileAddImgSrc;
  modalWhiteX.src = modalWhiteXSrc;
})();

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "43cc3865-d5d1-4d69-b4db-e6be73290a5f",
    "Content-Type": "application/json",
  },
});

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
  const cardElement = cardTemplate.cloneNode(true);
  cardElement.querySelector(".card__title").textContent = data.name;
  const cardImage = cardElement.querySelector(".card__image");
  cardImage.alt = data.name;
  cardImage.src = data.link;
  const likeBtn = cardElement.querySelector(".card__like-btn");
  if (data.isLiked) {
    likeBtn.classList.add("card__like-btn_active");
  } else {
    likeBtn.classList.remove("card__like-btn_active");
  }
  likeBtn.addEventListener("click", () => handleLikeClick(likeBtn, data._id));
  cardElement
    .querySelector(".card__del-btn")
    .addEventListener("click", () => handleDelCard(cardElement, data));
  cardImage.addEventListener("click", () => openPreviewModal(data));
  return cardElement;
}

function renderCard(data, container) {
  const cardElement = getCardElement(data);
  container.prepend(cardElement);
}

function openPreviewModal(data) {
  previewImage.src = data.link;
  previewImage.alt = data.name;
  previewCaption.textContent = data.name;
  openModal(previewModal);
}

function handleDelCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  submitDeletePostBtn.disabled = false;
  submitDeletePostBtn.classList.remove("modal__submit_inactive");
  openModal(deletePostModal);
}

function handleDelSubmit(evt) {
  evt.preventDefault();
  setButtonText(submitDeletePostBtn, "Deleting...");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deletePostModal);
      selectedCard = null;
      selectedCardId = null;
      disableBtn(submitDeletePostBtn, settings);
    })
    .catch((err) => console.error("Error deleting card:", err))
    .finally(() => {
      setButtonText(submitDeletePostBtn, "Delete");
    });
}
submitDeletePostBtn.addEventListener("click", handleDelSubmit);

function handleAvatarEditSave(evt) {
  evt.preventDefault();
  setButtonText(avatarEditSaveBtn, "Saving...");
  api
    .editAvatar({ avatar: avatarEditInput.value })
    .then((user) => {
      profileImg.src = user.avatar;
      closeModal(avatarEditModal);
      avatarEditForm.reset();
      disableBtn(avatarEditSaveBtn, settings);
    })
    .catch((err) => console.error("Error updating avatar:", err))
    .finally(() => {
      setButtonText(avatarEditSaveBtn, "Save");
      disableBtn(avatarEditSaveBtn, settings);
    });
}
avatarEditForm.addEventListener("submit", handleAvatarEditSave);

addOpenModalListener(avatarEditBtn, avatarEditModal, () => {
  resetValidation(
    avatarEditModal,
    Array.from(avatarEditModal.querySelectorAll(settings.inputSelector)),
    settings
  );
});
addCloseModalListener(avatarCloseBtn, avatarEditModal);

addOpenModalListener(profileEditBtn, profileEditModal, () => {
  editProfileName.value = profileName.textContent;
  editProfileDescription.value = profileDescription.textContent;
  resetValidation(
    editProfileForm,
    Array.from(editProfileForm.querySelectorAll(settings.inputSelector)),
    settings
  );
});
addCloseModalListener(closeEditModalBtn, profileEditModal);

addOpenModalListener(profileAddBtn, profileAddModal, () => {
  (
    profileAddForm.querySelector(settings.submitButtonSelector),
    settings
  );
});
addCloseModalListener(closeAddModalBtn, profileAddModal);

addCloseModalListener(closeDeletePostModalBtn, deletePostModal);
addCloseModalListener(cancelDeletePostBtn, deletePostModal);
addCloseModalListener(closePreviewModalBtn, previewModal);

editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  setButtonText(modalSaveBtn, "Saving...");
  api
    .editUserInfo({
      name: editProfileName.value,
      about: editProfileDescription.value,
    })
    .then((user) => {
      profileImg.src = user.avatar;
      profileName.textContent = user.name;
      profileDescription.textContent = user.about;
      closeModal(profileEditModal);
    })
    .catch((err) => console.error("Error updating user info:", err))
    .finally(() => {
      setButtonText(modalSaveBtn, "Save");
      disableBtn(modalSaveBtn, settings);
    });
});

profileAddForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  addModalSaveBtn.textContent = "Saving...";
  console.log("Add card payload:", {
  name: profileAddCaption.value,
  link: profileAddLink.value,
});
  api
    .addNewCard({
      name: profileAddCaption.value,
      link: profileAddLink.value,
    })
    .then((card) => {
      renderCard(card, cardsList);
      profileAddForm.reset();
      disableBtn(modalSaveBtn, settings);
      closeModal(profileAddModal);
    })
    .catch((err) => console.error("Error adding new card:", err))
    .finally(() => {
      addModalSaveBtn.textContent = "Save";
      disableBtn(modalSaveBtn, settings);
    });
});

api
  .getAppInfo()
  .then(([user, cards]) => {
    currentUserId = user._id;
    profileName.textContent = user.name;
    profileDescription.textContent = user.about;
    profileImg.src = user.avatar;
    cards.forEach((card) => renderCard(card, cardsList));
  })
  .catch((err) => console.error("Error fetching initial data:", err));
