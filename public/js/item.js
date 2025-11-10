const addItemForm = document.getElementById('addItemForm');

// Send a POST request to add an item to the database
addItemForm.addEventListener("submit", async (e) => {
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
