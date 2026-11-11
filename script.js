// Simple JavaScript for the student project
const hamburger = document.querySelector(".hamburger");
const drawer = document.getElementById("mobileDrawer");

if (hamburger && drawer) {
  hamburger.addEventListener("click", function () {
    const isOpen = drawer.classList.toggle("open");
    document.body.classList.toggle("menu-open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
    hamburger.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  const closeMenu = drawer.querySelector(".drawer-close");
  if (closeMenu) {
    closeMenu.addEventListener("click", function () {
      drawer.classList.remove("open");
      document.body.classList.remove("menu-open");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "Open navigation");
    });
  }

  const mobileLinks = drawer.querySelectorAll("a");
  mobileLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      drawer.classList.remove("open");
      document.body.classList.remove("menu-open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

const page = document.body.dataset.page;
document.querySelectorAll(".desktop-nav [data-page]").forEach(function(link) {
  if (link.dataset.page === page || (page === "index" && link.dataset.page === "home")) {
    link.classList.add("active");
  }
});
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("pierogiCart") || "[]");
  } catch (error) {
    return [];
  }
}
function saveCart(items) {
  localStorage.setItem("pierogiCart", JSON.stringify(items));
}

// Small message after adding food to the cart
let messageTimer;

function showAddedMessage(foodName) {
  let message = document.getElementById("addedMessage");

  if (!message) {
    message = document.createElement("div");
    message.id = "addedMessage";
    message.className = "added-message";
    message.setAttribute("role", "status");
    message.setAttribute("aria-live", "polite");
    document.body.appendChild(message);
  }

  message.innerHTML = "";

  const check = document.createElement("span");
  check.className = "added-check";
  check.textContent = "✓";

  const words = document.createElement("div");
  const heading = document.createElement("strong");
  heading.textContent = "Added to Cart!";
  const name = document.createElement("small");
  name.textContent = foodName;
  words.appendChild(heading);
  words.appendChild(name);

  const link = document.createElement("a");
  link.href = "cart.html";
  link.textContent = "View Cart";

  message.appendChild(check);
  message.appendChild(words);
  message.appendChild(link);
  message.classList.add("show");

  clearTimeout(messageTimer);
  messageTimer = setTimeout(function () {
    message.classList.remove("show");
  }, 2500);
}

if (page === "menu") {
  const list = document.getElementById("menuList");
  menuSections.forEach(function(section) {
    const heading = document.createElement("h2");
    heading.className = "menu-heading";
    heading.id = section[0];
    heading.innerHTML = "<span>" + section[0] + "</span>";
    list.appendChild(heading);
    const grid = document.createElement("div");
    grid.className = "food-grid";
    section[1].forEach(function(food) {
      const button = document.createElement("button");
      button.className = "food-card";
      button.title = "Add " + food[0] + " to cart";
      const picture = document.createElement("img");
      picture.src = "images/" + encodeURIComponent(food[1]);
      picture.alt = food[0];
      const caption = document.createElement("span");
      caption.className = "food-name";
      caption.textContent = food[0];
      const price = document.createElement("small");
      price.textContent = "$" + food[2].toFixed(2);
      caption.appendChild(price);
      button.append(picture, caption);
      button.addEventListener("click", function() {
        const cart = getCart();
        cart.push({
          name: food[0],
          price: food[2]
        });
        saveCart(cart);
        showAddedMessage(food[0]);
      });
      grid.appendChild(button);
    });
    list.appendChild(grid);
  });
}
// Cart page
if (page === "cart") {
  const list = document.getElementById("cartItems");
  const total = document.getElementById("cartTotal");
  const count = document.getElementById("cartCount");
  const checkout = document.getElementById("checkout");

  // Find the picture from the menu data
  function findPicture(foodName) {
    let picture = "";
    menuSections.forEach(function(section) {
      section[1].forEach(function(food) {
        if (food[0] === foodName) {
          picture = food[1];
        }
      });
    });
    return picture;
  }

  function showCart() {
    const cart = getCart();
    list.innerHTML = "";
    let sum = 0;

    if (cart.length === 0) {
      const empty = document.createElement("div");
      empty.className = "cart-empty";
      empty.innerHTML = '<h2>Your cart is empty</h2><p>Explore our homemade Polish dishes and add something delicious.</p><a class="red-button" href="menu.html">VIEW OUR MENU</a>';
      list.appendChild(empty);
      count.textContent = "0 items";
      total.textContent = "$0.00";
      checkout.style.pointerEvents = "none";
      checkout.style.opacity = "0.5";
      return;
    }

    checkout.style.pointerEvents = "auto";
    checkout.style.opacity = "1";
    count.textContent = cart.length + (cart.length === 1 ? " item" : " items");

    cart.forEach(function(item, index) {
      sum = sum + Number(item.price);
      const row = document.createElement("div");
      row.className = "cart-line";

      const pictureName = findPicture(item.name);
      if (pictureName !== "") {
        const picture = document.createElement("img");
        picture.className = "cart-photo";
        picture.src = "images/" + encodeURIComponent(pictureName);
        picture.alt = item.name;
        row.appendChild(picture);
      }

      const info = document.createElement("div");
      info.className = "cart-info";
      const name = document.createElement("strong");
      name.textContent = item.name;
      const description = document.createElement("small");
      description.textContent = "Homemade Polish food";
      info.appendChild(name);
      info.appendChild(description);

      const price = document.createElement("span");
      price.className = "cart-price";
      price.textContent = "$" + Number(item.price).toFixed(2);

      const remove = document.createElement("button");
      remove.className = "cart-remove";
      remove.textContent = "Remove";
      remove.addEventListener("click", function() {
        cart.splice(index, 1);
        saveCart(cart);
        showCart();
      });

      row.appendChild(info);
      row.appendChild(price);
      row.appendChild(remove);
      list.appendChild(row);
    });

    total.textContent = "$" + sum.toFixed(2);
  }

  showCart();

}

// Simple checkout page for the class project
if (page === "checkout") {
  const items = getCart();
  const summary = document.getElementById("checkoutItems");
  const total = document.getElementById("checkoutTotal");
  let priceTotal = 0;

  if (items.length === 0) {
    summary.textContent = "Your cart is empty. Please choose food from the menu.";
  } else {
    items.forEach(function (item) {
      const line = document.createElement("p");
      const itemPrice = Number(item.price) || 0;
      line.textContent = item.name + " - $" + itemPrice.toFixed(2);
      summary.appendChild(line);
      priceTotal += itemPrice;
    });
  }
  total.textContent = "$" + priceTotal.toFixed(2);

  const orderType = document.getElementById("pickup");
  const deliveryAddress = document.getElementById("deliveryAddress");
  const addressInputs = deliveryAddress.querySelectorAll("input");

  function updateAddress() {
    const isDelivery = orderType.value === "Delivery";
    deliveryAddress.hidden = !isDelivery;
    addressInputs.forEach(function (input) {
      input.required = isDelivery;
    });
  }

  orderType.addEventListener("change", updateAddress);
  updateAddress();

  const form = document.getElementById("checkoutForm");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    document.getElementById("checkoutNotice").textContent =
      "This is a school project. No order or payment has been sent.";
  });
}
