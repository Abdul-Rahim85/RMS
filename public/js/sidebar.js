document.addEventListener("DOMContentLoaded", function () {
  let links = document.querySelectorAll(".nav-link");
  let currentPath = window.location.pathname; // e.g. "/dashboard/items"

  links.forEach(link => {
    // Remove any active first
    link.classList.remove("active");

    // If the link's href ends with the current path → mark it active
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });
});
