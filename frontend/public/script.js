const API_URL = "http://localhost:5050/api";


// Элементы интерфейса
const productsSection = document.getElementById("products-section");
const addProductSection = document.getElementById("add-product-section");
const updateProductSection = document.getElementById("update-product-section");
const loginSection = document.getElementById("login-section");
const registerSection = document.getElementById("register-section");
const ordersSection = document.getElementById("orders-section");
const userManagementSection = document.getElementById("user-management-section");
const twoFactorSection = document.getElementById("two-factor-section");
const searchSection = document.getElementById("search-section"); // Секция для поиска

const productsList = document.getElementById("products-list");
const addProductForm = document.getElementById("add-product-form");
const updateProductForm = document.getElementById("update-product-form");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const ordersList = document.getElementById("orders-list");
const twoFactorForm = document.getElementById("two-factor-form");
const searchForm = document.getElementById("search-form"); // Форма для поиска
const searchResults = document.getElementById("search-results"); // Результаты поиска

const addProductBtn = document.getElementById("add-product-btn");
const deleteProductBtn = document.getElementById("delete-product-btn");
const checkoutBtn = document.getElementById("checkout-btn");

let token = localStorage.getItem("token");

// Переключение между секциями
document.getElementById("home-link").addEventListener("click", () => {
  showSection(productsSection);
  loadProducts();
});

document.getElementById("login-link").addEventListener("click", () => {
  showSection(loginSection);
});

document.getElementById("register-link").addEventListener("click", () => {
  showSection(registerSection);
});

document.getElementById("orders-link").addEventListener("click", () => {
  showSection(ordersSection);
  loadOrders();
});

document.getElementById("user-management-link").addEventListener("click", () => {
  showSection(userManagementSection);
});

addProductBtn.addEventListener("click", () => {
  showSection(addProductSection);
});

// Показать секцию
function showSection(section) {
  const sections = [
    productsSection,
    addProductSection,
    updateProductSection,
    loginSection,
    registerSection,
    ordersSection,
    userManagementSection,
    twoFactorSection,
    searchSection,
  ];
  sections.forEach((sec) => (sec.style.display = sec === section ? "block" : "none"));
}

// Загрузка продуктов
async function loadProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    const products = await response.json();
    productsList.innerHTML = products
      .map(
        (product) => `
      <div class="product-card" data-id="${product._id}">
        <h3>${product.name}</h3>
        <p>Price: $${product.price}</p>
        <p>Category: ${product.category}</p>
        <p>Stock: ${product.stock}</p>
        <p>${product.description}</p>
        <button onclick="showUpdateForm('${product._id}')">Edit</button>
        <button onclick="deleteProduct('${product._id}')">Delete</button>
      </div>
    `
      )
      .join("");
  } catch (error) {
    console.error("Error loading products:", error);
    alert("Failed to load products. Please try again later.");
  }
}

// Поиск продуктов с фильтрами
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("search-name").value;
  const category = document.getElementById("search-category").value;
  const minPrice = document.getElementById("search-min-price").value;
  const maxPrice = document.getElementById("search-max-price").value;
  const minStock = document.getElementById("search-min-stock").value;

  try {
    const response = await fetch(
      `${API_URL}/products/search?name=${name}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}&minStock=${minStock}`
    );

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    const products = await response.json();

    // Отображение результатов поиска
    searchResults.innerHTML = products
      .map(
        (product) => `
      <div class="product-card" data-id="${product._id}">
        <h3>${product.name}</h3>
        <p>Price: $${product.price}</p>
        <p>Category: ${product.category}</p>
        <p>Stock: ${product.stock}</p>
        <p>${product.description}</p>
      </div>
    `
      )
      .join("");
  } catch (error) {
    console.error("Error searching products:", error);
    alert("Failed to search products. Please try again later.");
  }
});


// Добавление продукта
addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const category = document.getElementById("category").value;
  const stock = document.getElementById("stock").value;
  const description = document.getElementById("description").value;
  const image = document.getElementById("image").value;

  if (!name || !price || !category || !stock || !description) {
    alert("Please fill in all fields.");
    return;
  }

  const product = { name, price, category, stock, description, image };

  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });

    if (response.ok) {
      alert("Product added successfully");
      loadProducts();
      showSection(productsSection);
    } else if (response.status === 403) {
      alert("Access denied. Admin role required.");
    } else {
      const data = await response.json();
      alert(`Failed to add product: ${data.message}`);
    }
  } catch (error) {
    console.error("Error adding product:", error);
    alert("An error occurred while adding the product.");
  }
});

// Обновление продукта
updateProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const productId = document.getElementById("update-id").value;
  const product = {
    name: document.getElementById("update-name").value,
    price: document.getElementById("update-price").value,
    category: document.getElementById("update-category").value,
    stock: document.getElementById("update-stock").value,
    description: document.getElementById("update-description").value,
    image: document.getElementById("update-image").value,
  };

  try {
    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });

    if (response.ok) {
      alert("Product updated successfully");
      loadProducts();
      showSection(productsSection);
    } else if (response.status === 403) {
      alert("Access denied. Admin role required.");
    } else {
      const data = await response.json();
      alert(`Failed to update product: ${data.message}`);
    }
  } catch (error) {
    console.error("Error updating product:", error);
    alert("An error occurred while updating the product.");
  }
});

// Удаление продукта
async function deleteProduct(productId) {
  if (!confirm("Are you sure you want to delete this product?")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      alert("Product deleted successfully");
      loadProducts();
    } else if (response.status === 403) {
      alert("Access denied. Admin role required.");
    } else {
      const data = await response.json();
      alert(`Failed to delete product: ${data.message}`);
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("An error occurred while deleting the product.");
  }
}

// Показать форму обновления продукта
function showUpdateForm(productId) {
  const product = document.querySelector(`.product-card[data-id="${productId}"]`);
  document.getElementById("update-id").value = productId;
  document.getElementById("update-name").value = product.querySelector("h3").textContent;
  document.getElementById("update-price").value = product.querySelector("p:nth-child(2)").textContent.replace("Price: $", "");
  document.getElementById("update-category").value = product.querySelector("p:nth-child(3)").textContent.replace("Category: ", "");
  document.getElementById("update-stock").value = product.querySelector("p:nth-child(4)").textContent.replace("Stock: ", "");
  document.getElementById("update-description").value = product.querySelector("p:nth-child(5)").textContent;
  document.getElementById("update-image").value = "";

  showSection(updateProductSection);
}

// Вход в систему
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email-login").value;
  const password = document.getElementById("password-login").value;

  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  const credentials = { email, password };

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.requires2FA) {
        // Если требуется 2FA, показываем секцию для ввода кода
        showSection(twoFactorSection);
        document.getElementById("2fa-user-id").value = data.userId; // Сохраняем ID пользователя
      } else {
        // Если 2FA не требуется, сохраняем токен и перенаправляем
        token = data.token;
        localStorage.setItem("token", token);
        alert("Login successful");
        showSection(productsSection);
        loadProducts();
      }
    } else {
      alert(`Login failed: ${data.message}`);
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("An error occurred during login.");
  }
});

// Проверка кода 2FA
twoFactorForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userId = document.getElementById("2fa-user-id").value;
  const token = document.getElementById("2fa-token").value;

  try {
    const response = await fetch(`${API_URL}/auth/2fa/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, token }),
    });

    const data = await response.json();

    if (response.ok) {
      // Сохраняем токен и перенаправляем
      localStorage.setItem("token", data.token);
      alert("2FA verification successful");
      showSection(productsSection);
      loadProducts();
    } else {
      alert(`2FA verification failed: ${data.message}`);
    }
  } catch (error) {
    console.error("Error during 2FA verification:", error);
    alert("An error occurred during 2FA verification.");
  }
});

// Регистрация
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name-register").value;
  const email = document.getElementById("email-register").value;
  const password = document.getElementById("password-register").value;

  if (!name || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  const user = { name, email, password };

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registration successful");
      showSection(loginSection);
    } else {
      alert(`Registration failed: ${data.message}`);
    }
  } catch (error) {
    console.error("Error during registration:", error);
    alert("An error occurred during registration.");
  }
});

// Загрузка заказов
async function loadOrders() {
  if (!token) {
    alert("You need to log in to view orders.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const orders = await response.json();
    ordersList.innerHTML = orders
      .map(
        (order) => `
      <div class="order-card">
        <p>Total: $${order.total}</p>
        <p>Status: ${order.status}</p>
        <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
      </div>
    `
      )
      .join("");
  } catch (error) {
    console.error("Error loading orders:", error);
    alert("An error occurred while loading orders.");
  }
}

// Инициализация
loadProducts();
showSection(productsSection);