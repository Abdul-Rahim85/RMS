// Global array to hold order items {name, price, count}
let orderItems = [];
const printBtn = document.getElementById('printBtn');
const deleteBtn = document.getElementById('deleteBtn');

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


// Function to scroll the item rows
function scrollRow(rowId, distance) {
  const row = document.getElementById(rowId);  
  
  row.scrollBy({ left: distance, behavior: 'smooth' });
}

// Function to add item to receipt
function addToReceipt(name, price, category) {
  const receiptList = document.getElementById('receiptList');    
  const item = document.createElement('li');
  const count = 1; // default count is 1 user can increase it later

  if(orderItems.length >= 1) {

    for(let i = 0; i < receiptList.children.length; i++) {
      const orderitem = receiptList.children[i]; // existing item in the receipt
      const itemName = orderitem.children[0].textContent; // name of existing item

      if(itemName === name) {
        // If item already exists, increment its count
        const parts = orderitem.children;
        let currentCount = parseInt(parts[1].textContent.replace('X', '')) || 1;
        currentCount += 1;
        parts[1].innerHTML = `${currentCount}X`;

        // udate price if needed
        parts[2].innerHTML = `${price * currentCount} ج.س`;
        
        // update item price and count in orderItems array
        orderItems[i].count = currentCount;
        orderItems[i].price = price * currentCount;
        break;
        
        
      } else if(i === receiptList.children.length - 1) {
        item.className = "list-group-item d-flex justify-content-between align-items-center";
        item.innerHTML = `<span>${name}</span> <span>${count}X</span> <span>${price} ج.س</span>`;
        receiptList.appendChild(item);
        orderItems.push({ name, price, category, count });
        break;
      }
    }} else {
      
      item.className = "list-group-item d-flex justify-content-between align-items-center";
      item.innerHTML = `<span>${name}</span> <span>${count}X</span> <span>${price} ج.س</span>`;
      receiptList.appendChild(item);
      orderItems.push({ name, price, category, count });
      printBtn.disabled = false;
      deleteBtn.disabled = false;
    }
      
  updateTotal();
}

function updateTotal() {
  const totalElement = document.getElementById('totalAmount');
  const total = orderItems.reduce((sum, item) => sum + parseInt(item.price), 0);
  totalElement.textContent = `${total} ج.س`;
}

// Function to clear the receipt
function clearReceipt() {
  const receiptList = document.getElementById('receiptList');    
  receiptList.innerHTML = '';
  orderItems = [];
  updateTotal();
  printBtn.disabled = true;
  deleteBtn.disabled = true;
}

// Function to print the receipt
async function printReceipt() {
  // check if there are items to print
  if(orderItems.length === 0) {
    alert('لا يوجد أصناف في الفاتورة للطباعة');
    return;
  } else {
    const requestData = { orderItems: orderItems, total: orderItems.reduce((sum, item) => sum + parseInt(item.price), 0)};
    const response = await fetch(`${window.location.href}/order-print`, {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {'Content-Type': 'application/json'}
    });

    if (response.ok) {
      clearReceipt();
      const { totalItemsSold, totalSales, bestSellingItem } = (await response.json()).reports;

      // Update reports section if present
      const totalItemsSoldElement = document.getElementById('totalItemsSold');
      const totalSalesElement = document.getElementById('totalSales');
      const bestSellingItemElement = document.getElementById('bestSellingItem');

      // Update the DOM elements with new report data
      if(totalItemsSoldElement) totalItemsSoldElement.textContent = totalItemsSold;
      if(totalSalesElement) totalSalesElement.textContent = totalSales + ' ج.س';
      if(bestSellingItemElement) bestSellingItemElement.textContent = bestSellingItem;      
    } else {
      let errorData = await response.json();
      console.log('====================================');
      console.log(errorData);
      console.log('====================================');
    }
  }
  
}