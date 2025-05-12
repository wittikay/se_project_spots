const initialCards = [
  {
    name: "Landscape example",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },

  {
    name: "A multi-story library filled with bookshelves.",
    link: "https://images.unsplash.com/photo-1741850820882-1cb02da0f04f?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1MHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    name: "A proud lioness rests admist her pride.",
    link: "https://images.unsplash.com/photo-1741850820591-f6954a90c7ba?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1MXx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    name: "A modern, angular building with a large window.",
    link: "https://images.unsplash.com/photo-1741540420762-91a78becdf92?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE5fE04alZiTGJUUndzfHxlbnwwfHx8fHw%3D",
  },

  {
    name: "People pray at a temple with incense smoke.",
    link: "https://images.unsplash.com/photo-1742268351334-bf9328f293ce?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDI2fHRvd0paRnNrcEdnfHxlbnwwfHx8fHw%3D",
  },

  {
    name: "Two people holding hands over coffee.",
    link: "https://images.unsplash.com/photo-1741217531460-fb52b48107b6?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEzfHhqUFI0aGxrQkdBfHxlbnwwfHx8fHw%3D",
  },

  {
    name: "Gray metal chalkboard with whatever it takes written.",
    link: "https://images.unsplash.com/photo-1491234323906-4f056ca415bc?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE5fF9oYi1kbDRRLTRVfHxlbnwwfHx8fHw%3D",
  },
];
//Edit profile
const profileEditBtn = document.querySelector(".profile__edit-btn");
const profileEditModal = document.querySelector("#edit-profile-modal");
const closeEditModalBtn = profileEditModal.querySelector(".modal__close-btn");
const editProfileForm = document.forms["modal__form"];

const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const editProfileName = profileEditModal.querySelector("#name");
const editProfileDescription = profileEditModal.querySelector("#description");

const openModal = (modal) => {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscKey);
  modal.addEventListener("click", handleOverlayClick);
  };

const closeModal = function (modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscKey);
  modal.removeEventListener("click", handleOverlayClick);
};

const addOpenModalListener = (trigger, modal) => {
  trigger.addEventListener("click", () => openModal(modal));
};

const addCloseModalListener = (button, modal) => {
  button.addEventListener("click", () => closeModal(modal));
};

const addLikeListener = (likeBtn) => {
  likeBtn.addEventListener("click", () => {
    likeBtn.classList.toggle("card__like-btn_active");
  });
};

const addDeleteListener = (delBtn, cardElement) => {
  delBtn.addEventListener("click", () => {
    cardElement.remove();
  });
};

const addPreviewListener = (cardImage, data) => {
  cardImage.addEventListener("click", () => {
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });
};

profileEditBtn.addEventListener("click", () => {
  editProfileName.value = profileName.textContent;
  editProfileDescription.value = profileDescription.textContent;
  openModal(profileEditModal);
});
addCloseModalListener(closeEditModalBtn, profileEditModal);

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editProfileName.value;
  profileDescription.textContent = editProfileDescription.value;
  closeModal(profileEditModal);
}

editProfileForm.addEventListener("submit", handleProfileFormSubmit);

// Add post
const profileAddBtn = document.querySelector(".profile__add-btn");
const profileAddModal = document.querySelector("#new-post-modal");
const closeAddModalBtn = profileAddModal.querySelector(".modal__close-btn");
const modalSaveBtn = document.querySelector(".modal__submit-btn");
const profileAddForm = profileAddModal.querySelector(".modal__form");

const profileAddLink = profileAddModal.querySelector("#link");
const profileAddCaption = profileAddModal.querySelector("#caption");

addOpenModalListener(profileAddBtn, profileAddModal);
addCloseModalListener(closeAddModalBtn, profileAddModal);

// Preview image
const previewModal = document.querySelector("#preview-modal");
const closePreviewModalBtn = previewModal.querySelector(
  ".modal__close-btn_preview"
);
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");

const renderCard = (cardData, container) => {
  const cardElement = getCardElement(cardData); // Create the card element
  container.prepend(cardElement); // Add the card element to the container
};

function handleProfileAddFormSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    name: profileAddCaption.value,
    link: profileAddLink.value,
  };
  renderCard(inputValues, cardsList);
  profileAddForm.reset();
  disableBtn(modalSaveBtn, settings);
  closeModal(profileAddModal);
}

profileAddForm.addEventListener("submit", handleProfileAddFormSubmit);

const cardsList = document.querySelector(".cards__list");

const cardTemplate = document
  .querySelector("#cards__template")
  .content.querySelector(".card");

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  cardTitle.textContent = data.name;
  cardImage.alt = data.name;
  cardImage.src = data.link;

  const likeBtn = cardElement.querySelector(".card__like-btn");
  addLikeListener(likeBtn);
  const delBtn = cardElement.querySelector(".card__del-btn");
  addDeleteListener(delBtn, cardElement);

  addPreviewListener(cardImage, data);

  return cardElement;
}
addCloseModalListener(closePreviewModalBtn, previewModal);

initialCards.forEach((item) => {
  renderCard(item, cardsList);
});


// Function to close the modal when clicking outside its borders
const handleOverlayClick = (evt) => {
  if (evt.target.classList.contains("modal_is-opened")) {
    closeModal(evt.target);
  }
};

// Function to close the modal when pressing the Esc key
const handleEscKey = (evt) => {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
};

// Add event listeners for all modals