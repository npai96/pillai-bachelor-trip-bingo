// script.js

const prompts = [
  "Someone says 'shut up Mehar'",
  "Sheks says the work 'penjamin'",
  "Sahil Rupani tries to convince us to get a table",
  "Prabhav gets aggressive and pushes someone",
  "Rahul brings up a story from when he and Sacci were kids",
  "Sid makes a niche sports reference",
  "Someone brings up where they work",
  "Someone brings up their ex",
  "Zach tells you he loves you",
  "Someone calls Sacci (NOT Sid)",
  "Someone does a trick stunt into the pool",
  "Someone falls asleep on a couch",
  "Someone wins big (>$500)",
  "Abir complains about how many hours he works",
  "Someone asks what Arjun's nickname means",
  "Arjun tries to get into bed with someone",
  "Nihal spends >25 min in the bathroom",
  "Someone suggests late night Taco Bell",
  "Mehar wears his elephant shirt",
  "Someone challenges someone to basketball",
  "Someone pukes",
  "Someone bums a cig off someone not in the Bach party",
  "Someone does work",
  "Someone gets a phone #",
  "Jonny speaks in Stitch voice",
  "Theo breaks into a little dance",
  "Sehej mentions his hold handicap",
  "Sahil Mohan takes a hit off someone else's vape",
  "Placeholder 1",
  "Placeholder 2",
  "Placeholder 3",
  "Placeholder 4",
  "Placeholder 5",
  "Placeholder 6",
  "Placeholder 7",
  "Placeholder 8",
];

const board = document.getElementById("bingoBoard");
const shuffleButton = document.getElementById("shuffleButton");
const loginModal = document.getElementById("loginModal");
const loginForm = document.getElementById("loginForm");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");

let currentUser = null;

// Login system functions
function showLoginModal() {
  loginModal.style.display = "block";
}

function hideLoginModal() {
  loginModal.style.display = "none";
}

function saveUser(firstName, lastName) {
  const user = { firstName, lastName };
  localStorage.setItem("bingoUser", JSON.stringify(user));
  currentUser = user;
}

function loadUser() {
  const savedUser = localStorage.getItem("bingoUser");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    return true;
  }
  return false;
}

// Name matching functions
function shouldHidePrompt(prompt, user) {
  const promptLower = prompt.toLowerCase();
  const firstName = user.firstName.toLowerCase();
  const lastName = user.lastName.toLowerCase();
  
  // Special case for Sahil - need full name matching for both Sahils
  if (firstName === 'sahil') {
    return promptLower.includes(`${firstName} ${lastName}`);
  }
  
  // For everyone else, just match first name
  return promptLower.includes(firstName);
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function saveState() {
  const tiles = document.querySelectorAll(".bingo-tile");
  const boardOrder = [];
  const selectedTexts = [];
  
  tiles.forEach((tile) => {
    // Store the original prompt text, not the display text
    const originalText = tile.dataset.originalText || tile.textContent;
    boardOrder.push(originalText);
    if (tile.classList.contains("selected")) {
      selectedTexts.push(originalText);
    }
  });
  
  localStorage.setItem("bingoBoardOrder", JSON.stringify(boardOrder));
  localStorage.setItem("bingoSelections", JSON.stringify(selectedTexts));
}

function createBoard(useExistingOrder = false) {
  board.innerHTML = "";
  
  let boardOrder;
  const savedOrder = localStorage.getItem("bingoBoardOrder");
  const savedSelections = JSON.parse(localStorage.getItem("bingoSelections") || "[]");
  
  if (useExistingOrder && savedOrder) {
    boardOrder = JSON.parse(savedOrder);
  } else {
    const shuffled = shuffle([...prompts]);
    boardOrder = shuffled.slice(0, 36);
  }
  
  boardOrder.forEach(tileText => {
    const tile = document.createElement("div");
    tile.className = "bingo-tile";
    
    // Store the original text
    tile.dataset.originalText = tileText;
    
    // Check if this prompt should be hidden for the current user
    const shouldHide = currentUser && shouldHidePrompt(tileText, currentUser);
    
    if (shouldHide) {
      tile.textContent = "Hiding this one because it's about u ;)";
      tile.classList.add("hidden");
    } else {
      tile.textContent = tileText;
    }
    
    // Restore selection if this text was previously selected
    if (savedSelections.includes(tileText)) {
      tile.classList.add("selected");
    }
    
    tile.addEventListener("click", () => {
      tile.classList.toggle("selected");
      saveState();
    });
    board.appendChild(tile);
  });
  
  // Save the current board order
  if (!useExistingOrder) {
    saveState();
  }
}

// Event listeners
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  
  if (firstName && lastName) {
    saveUser(firstName, lastName);
    hideLoginModal();
    createBoard(true); // Recreate board with hidden prompts
  }
});

shuffleButton.addEventListener("click", () => {
  localStorage.removeItem("bingoSelections");
  localStorage.removeItem("bingoBoardOrder");
  createBoard(false);
});

// Initialize app
window.onload = () => {
  if (loadUser()) {
    hideLoginModal();
    createBoard(true);
  } else {
    showLoginModal();
  }
};
