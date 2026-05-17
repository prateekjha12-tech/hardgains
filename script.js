// HAMBURGER MENU
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

// DISABLE RIGHT CLICK
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

// PAGE LOAD FADE
window.addEventListener("load", () => {
  document.body.style.opacity = "1";

  const loader = document.querySelector(".loader");
  if (loader) loader.style.display = "none";
});

// SCROLL REVEAL
const reveals = document.querySelectorAll(".reveal");

function scrollReveal() {
  reveals.forEach((box) => {
    const windowHeight = window.innerHeight;
    const boxTop = box.getBoundingClientRect().top;

    if (boxTop < windowHeight - 80) {
      box.classList.add("active");
    }
  });
}

window.addEventListener("scroll", scrollReveal);
scrollReveal();

// 3D PARALLAX EFFECT (MOUSE MOVE)
document.addEventListener("mousemove", (e) => {
  const cards = document.querySelectorAll(".card-3d");

  let x = (window.innerWidth / 2 - e.pageX) / 25;
  let y = (window.innerHeight / 2 - e.pageY) / 25;

  cards.forEach((card) => {
    card.style.transform = `rotateY(${-x}deg) rotateX(${y}deg)`;
  });
});

// SMOOTH PAGE TRANSITION
document.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", (e) => {
    if (link.href.includes(window.location.origin)) {
      e.preventDefault();
      document.body.style.opacity = "0";
      setTimeout(() => {
        window.location.href = link.href;
      }, 500);
    }
  });
});

// dropdownjs
const dropdown = document.querySelector(".dropdown");
const dropBtn = document.querySelector(".dropbtn");

if (dropBtn && dropdown) {

  // open/close dropdown
  dropBtn.addEventListener("click", (e) => {
    dropdown.classList.toggle("active");
  });

  // close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });
}