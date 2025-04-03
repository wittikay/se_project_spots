const initialCards = [
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

const profileEditBtn = document.querySelector(".profile__edit-btn");
const profileEditModal = document.querySelector("#edit-profile-modal");
const closeEditModalBtn = profileEditModal.querySelector(".modal__close-btn");

profileEditBtn.addEventListener("click", function (){
  profileEditModal.classList.add("modal_is-opened");
});
closeEditModalBtn.addEventListener("click", function(){
  profileEditModal.classList.remove("modal_is-opened");
});

const profileAddBtn = document.querySelector(".profile__add-btn");
const profileAddModal = document.querySelector("#new-post-modal");
const closeAddModalBtn = profileAddModal.querySelector(".modal__close-btn");

profileAddBtn.addEventListener("click", function(){
  profileAddModal.classList.add("modal_is-opened");
});
closeAddModalBtn.addEventListener("click", function(){
  profileAddModal.classList.remove("modal_is-opened");
});
