
let orderItems = []; // Array to hold order items

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

// Function to scroll the item rows
function scrollRow(rowId, distance) {
  const row = document.getElementById(rowId);  
  
  row.scrollBy({ left: distance, behavior: 'smooth' });
}

// Function to add item to receipt
function addToReceipt(name, price) {
  const receiptList = document.getElementById('receiptList');    
  const item = document.createElement('li');
  const count = 1;

  if(orderItems.length >= 1) {
    console.log(receiptList.children);
    console.log(orderItems);
    
    item.className = "list-group-item d-flex justify-content-between align-items-center";
    item.innerHTML = `${name} ${count}X <span class="">${price} ج.س</span>`;
    receiptList.appendChild(item);
    orderItems.push({ name, price,count });

  } else {
    item.className = "list-group-item d-flex justify-content-between align-items-center";
    item.innerHTML = `${name} ${count}X <span class="">${price} ج.س</span>`;
    receiptList.appendChild(item);
    orderItems.push({ name, price });
  }

  }