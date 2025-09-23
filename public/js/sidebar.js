// This event is used to set the active link based on session storage when the page loads
document.addEventListener("DOMContentLoaded", function () {
  let saved = sessionStorage.getItem("activeLink");
  let links = document.querySelectorAll(".nav-link");

  links.forEach(link => {
    if (saved && link.textContent.trim() === saved) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  //if no activeLink saved → set default
  if (!saved) {
    links[0].classList.add("active"); // make the first link active by default
  }
});

// This code adds click event listeners to all navigation links to manage the 'active' class and store the active link in session storage
const navLinks = document.querySelectorAll('.nav .nav-link');

navLinks.forEach(link => {
link.addEventListener('click', function () {
  navLinks.forEach(l => l.classList.remove('active'));
  this.classList.add('active');
  sessionStorage.setItem("activeLink", link.textContent.trim());
  
});
});

const activeText = sessionStorage.getItem("activeLink");

if (activeText) {
  navLinks.forEach(link => {
    if (link.textContent.trim() === activeText) {
      link.classList.add("active");
    }
  });
}
