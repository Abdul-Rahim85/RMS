const addItemForm = document.getElementById('addItemForm');
const itemsList = document.getElementById('itemsList')

itemsList.addEventListener("click", async function (event) {
  
  // Check if the clicked element is a delete button
  if (event.target.classList.contains("btn-danger")) {

    const itemElement = event.target.closest("div.row");   
    const itemId = itemElement.dataset.itemid;    

    const response = await fetch(`/items/${itemId}`, {
      method: "DELETE"
    });

    if (response.ok) {
      itemElement.remove(); // remove from page
    } else {
      console.error("Failed to delete item");
    }
  }
});

// Function to show status messages
function showMessage(text, type) {
  const msg = document.getElementById("statusMessage");

  msg.textContent = text;

  msg.className = "status-message"; // reset classes

  if (type === "success") {
    msg.classList.add("status-success");
  } else {
    msg.classList.add("status-error");
  }

  msg.classList.add("show");

  // Hide after 2.5 seconds
  setTimeout(() => {
    msg.classList.remove("show");
  }, 2500);
}



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
    showMessage("تم الحفظ بنجاح ✔︎", "success");
    form.reset();
    bootstrap.Modal.getInstance(document.getElementById("addItemModal")).hide();
    const newItem = await response.json();
    // Append the new item to the items list
    const item = newItem.item;
    const itemHtml = `
      <div class="row align-items-center mb-3" data-itemid="${item._id}">
        <div class="col-md-2">  
          ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}" class="img-fluid">` : 'No Image'}
        </div>
        <div class="col-md-3">${item.name}</div>
        <div class="col-md-3">${item.category}</div>
        <div class="col-md-2">${item.price.toFixed(2)} ر.س</div>
        <div class="col-md-2">
          <button class="btn btn-danger btn-sm">حذف</button>
        </div>
      </div>
    `;
    itemsList.insertAdjacentHTML('beforeend', itemHtml);

  } else {
    showMessage("حدث خطأ أثناء الحفظ ❌", "error");
  }
});
