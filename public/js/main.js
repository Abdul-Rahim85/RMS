// Highlight the active navigation link based on the current URL path
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

// Send a POST request to add an item to the database
document.getElementById("addItemForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  
  const formData = new FormData(form); // Collect form data including files  

  const response = await fetch(window.location.href, {
    method: "POST",
    body: formData
  });

  if (response.ok) {
    alert("تم حفظ الصنف بنجاح 🎉");
    form.reset();
    bootstrap.Modal.getInstance(document.getElementById("addItemModal")).hide();
  } else {
    alert("حدث خطأ أثناء الحفظ 😢");
  }
});
