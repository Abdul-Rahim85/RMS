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

  } else if (event.target.classList.contains("btn-warning")) {
    // Handle edit button click (to be implemented)
    console.log(event.target);
    
  } else {
    return; // Do nothing if other areas are clicked
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
      <div id="itemContainer" class="row d-flex align-items-center py-2" data-itemid="${item._id}">
        <div class="col-2">${itemsList.children.length === 2 ? 1 : itemsList.children.length-1}</div>
        <div class="col-md-2">${item.name}</div>
        <div class="col-md-2">${item.category}</div>
        <div class="col-md-2">${item.price.toFixed(2)} ج.س</div>
        <div class="col-md-2">  
          ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}" class="h-100 w-25">` : 'No Image'}
        </div>
        <div class="col-2">
          <button class="btn btn-sm btn-warning editItem" data-bs-target="#itemModal" data-bs-toggle="modal">
            تعديل
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn btn-sm btn-danger deleteItem">
            حذف
            <i class="bi bi-trash-fill"></i>
          </button>
        </div>
      </div>
    `;
    itemsList.insertAdjacentHTML('beforeend', itemHtml);

  } else {
    showMessage("حدث خطأ أثناء الحفظ ❌", "error");
  }
});