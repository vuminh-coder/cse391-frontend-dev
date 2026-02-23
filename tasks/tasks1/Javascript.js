// --- API CONFIG ---
const API_URL = "http://localhost:5000/api/products";
let productsData = [];

// Reset dữ liệu về mặc định
async function resetData() {
  // Logic reset sẽ cần gọi API xóa hết và nạp lại (nếu cần)
  // Ở đây tạm thời reload trang để fetch lại
  location.reload();
}

// --- RENDER PRODUCTS ---
function renderProducts(data) {
  const sections = {
    iphone: document.querySelector("#section-iphone .content-ct"),
    laptop: document.querySelector("#section-laptop .content-ct"),
    audio: document.querySelector("#section-audio .content-ct"),
    accessory: document.querySelector("#section-accessories .content-ct"),
  };

  // Group products by category for efficient rendering
  const productsByCategory = data.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  // Render each section once
  for (const category in sections) {
    const container = sections[category];
    if (container) {
      const categoryProducts = productsByCategory[category] || [];
      const html = categoryProducts
        .map((product) => {
          const priceFormatted = product.price.toLocaleString("vi-VN") + "đ";
          const badgeColor = product.badgeColor ? product.badgeColor : "";
          const voucherHTML = product.voucher
            ? `<span class="voucher-tag">${product.voucher}</span>`
            : "";
          const specsHTML = product.specs
            .map((spec) => `<li>${spec}</li>`)
            .join("");

          return `
                <div class="col-3 content" data-product-id="${product.id}" data-price="${product.price}">
                    <img src="${product.img}" alt="${product.name}" loading="lazy" />
                    <div class="product-card">
                        <div class="product-badge ${badgeColor}">${product.badge}</div>
                        <h3 class="product-name">${product.name}</h3>
                        <div class="product-price">
                            <span class="current-price">${priceFormatted}</span>
                            ${voucherHTML}
                        </div>
                        <div class="product-info">
                            <ul>${specsHTML}</ul>
                        </div>
                    </div>
                </div>
            `;
        })
        .join("");
      container.innerHTML = html;
    }
  }

  updateSectionVisibility();
}

function updateSectionVisibility() {
  const allProductSections = document.querySelectorAll(
    "#section-iphone, #section-laptop, #section-audio, #section-accessories",
  );

  allProductSections.forEach((section) => {
    const contentContainer = section.querySelector(".content-ct");
    if (contentContainer && contentContainer.children.length > 0) {
      section.style.display = "block";
    } else {
      section.style.display = "none";
    }
  });
}

// --- FETCH DATA FROM API ---
async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch data");
    productsData = await response.json();
    renderProducts(productsData);
    if (document.getElementById("adminTableBody")) renderAdminTable();
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm:", error);
    showToast(
      "Không thể kết nối tới Server! Hãy chạy 'node server.js'",
      "error",
    );
    // Hiển thị lỗi lên bảng Admin nếu đang ở trang Admin
    const tbody = document.getElementById("adminTableBody");
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="color: red; padding: 20px;">
        ❌ <b>Lỗi kết nối Server!</b><br>
        Hãy chắc chắn rằng bạn đã chạy lệnh <code>node server.js</code> trong thư mục backend.
      </td></tr>`;
    }
  }
}

// Call render on load
document.addEventListener("DOMContentLoaded", () => {
  // Initial render
  fetchProducts(); // Thay thế renderProducts trực tiếp
  loadCart();

  // --- EVENT LISTENERS (using Event Delegation where possible) ---

  // Product click listener (main page)
  const productContainer = document.querySelector(".right-aside");
  if (productContainer) {
    productContainer.addEventListener("click", (e) => {
      const card = e.target.closest(".content[data-product-id]");
      if (card) {
        const productId = Number(card.dataset.productId);
        const product = productsData.find((p) => p.id === productId);
        if (product) {
          openProductDetailModal(product);
        }
      }
    });
  }

  // Admin page specific listeners
  const adminTableBody = document.getElementById("adminTableBody");
  if (adminTableBody) {
    renderAdminTable();
    document
      .getElementById("addProductBtn")
      .addEventListener("click", () => openProductModal());
    document
      .getElementById("resetDataBtn")
      .addEventListener("click", resetData);
    document
      .getElementById("productForm")
      .addEventListener("submit", handleProductSubmit);

    // Use event delegation for edit/delete buttons in the admin table
    adminTableBody.addEventListener("click", (e) => {
      const button = e.target.closest("button.action-btn");
      if (!button) return;
      const id = Number(button.dataset.id);
      if (button.classList.contains("btn-edit")) openProductModal(id);
      if (button.classList.contains("btn-delete")) deleteProduct(id);
    });
  }

  // Tự động cuộn lên đầu trang khi tải lại
  window.scrollTo(0, 0);
});

// --- DARK MODE ---
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  // Cập nhật lại màu chữ biểu đồ nếu đang ở trang Admin
  if (typeof productChart !== "undefined" && productChart) {
    productChart.options.plugins.legend.labels.color =
      document.body.classList.contains("dark-mode") ? "#fff" : "#333";
    productChart.options.plugins.title.color = document.body.classList.contains(
      "dark-mode",
    )
      ? "#fff"
      : "#333";
    productChart.update();
  }
}

window.addEventListener("scroll", () => {
  let current = "";
  const sections = document.querySelectorAll("section"); // Lấy các nhóm sản phẩm
  const navLinks = document.querySelectorAll(".nav-link");

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 100) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
});

// --- TÍNH NĂNG TÌM KIẾM & LỌC ---
const searchInput = document.getElementById("searchInput");
const priceFilter = document.getElementById("priceFilter");
const categoryFilter = document.getElementById("categoryFilter");

function filterProducts() {
  const searchText = searchInput.value.toLowerCase();
  const priceValue = priceFilter.value;
  const categoryValue = categoryFilter.value;

  const filteredData = productsData.filter((product) => {
    // 1. Filter by Name
    const isMatchSearch = product.name.toLowerCase().includes(searchText);

    // 2. Filter by Price
    let isMatchPrice = true;
    if (priceValue === "low") {
      isMatchPrice = product.price < 10000000;
    } else if (priceValue === "mid") {
      isMatchPrice = product.price >= 10000000 && product.price <= 20000000;
    } else if (priceValue === "high") {
      isMatchPrice = product.price > 20000000;
    }

    // 3. Filter by Category
    let isMatchCategory =
      categoryValue === "all" || product.category === categoryValue;

    return isMatchSearch && isMatchPrice && isMatchCategory;
  });

  renderProducts(filteredData);
}

if (searchInput && priceFilter && categoryFilter) {
  searchInput.addEventListener("input", filterProducts);
  priceFilter.addEventListener("change", filterProducts);
  categoryFilter.addEventListener("change", filterProducts);
}

// --- LOGIC GIỎ HÀNG & MODAL ---
let cart = [];
let currentProduct = {};

// Mở Modal Chi tiết sản phẩm (called by event listener)
function openProductDetailModal(product) {
  const priceFormatted = product.price.toLocaleString("vi-VN") + "đ";
  const specsHTML = product.specs.map((spec) => `<li>${spec}</li>`).join("");

  // Lưu thông tin sản phẩm hiện tại để thêm vào giỏ hàng
  currentProduct = {
    img: product.img,
    title: product.name,
    price: product.price,
    priceStr: priceFormatted,
  };

  // Điền dữ liệu vào Modal
  document.getElementById("modalImg").src = product.img;
  document.getElementById("modalTitle").innerText = product.name;
  document.getElementById("modalPrice").innerText = priceFormatted;
  document.getElementById("modalSpecs").innerHTML = specsHTML;

  // Hiển thị Modal
  document.getElementById("productModal").style.display = "block";
}
// Đóng Modal
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// Đóng modal khi click ra ngoài
window.onclick = function (event) {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
  }
};

// --- LOCAL STORAGE (Lưu giỏ hàng) ---
function saveCart() {
  localStorage.setItem("shoppingCart", JSON.stringify(cart));
}

function loadCart() {
  const savedCart = localStorage.getItem("shoppingCart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartUI();
  }
}

// Thêm vào giỏ hàng từ Modal
function addToCartFromModal() {
  addToCart(currentProduct);
  closeModal("productModal");
  showToast("Đã thêm " + currentProduct.title + " vào giỏ hàng!", "success");
}

// Logic thêm vào giỏ hàng
function addToCart(product) {
  const existingItem = cart.find((item) => item.title === product.title);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(); // Lưu ngay khi thêm
  updateCartUI();
}

// Cập nhật giao diện giỏ hàng (số lượng, danh sách)
function updateCartUI() {
  const cartCount = document.querySelector(".cart-count");
  if (!cartCount) return; // Safety check cho trang admin
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.innerText = totalItems;

  // Render danh sách trong Modal Giỏ hàng
  const container = document.getElementById("cartItemsContainer");
  container.innerHTML = "";
  let totalPrice = 0;

  if (cart.length === 0) {
    container.innerHTML =
      '<p class="empty-cart text-center">Giỏ hàng trống trơn 😢</p>';
  } else {
    const itemsHTML = cart
      .map((item, index) => {
        totalPrice += item.price * item.quantity;
        return `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.title}">
                    <div class="cart-item-info">
                        <h4>${item.title}</h4>
                        <p>${item.priceStr}</p>
                        <div class="qty-controls">
                            <button class="qty-btn" onclick="decreaseQty(${index})">−</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" onclick="increaseQty(${index})">+</button>
                        </div>
                    </div>
                    <div class="cart-item-remove" onclick="removeFromCart(${index})">🗑️</div>
                </div>
            `;
      })
      .join("");
    container.innerHTML = itemsHTML;
  }

  document.getElementById("cartTotal").innerText =
    totalPrice.toLocaleString("vi-VN") + "đ";
  document.getElementById("paymentTotal").innerText =
    totalPrice.toLocaleString("vi-VN") + "đ";
}

// Tăng số lượng
function increaseQty(index) {
  cart[index].quantity += 1;
  saveCart();
  updateCartUI();
}

// Giảm số lượng
function decreaseQty(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
    saveCart();
    updateCartUI();
  } else {
    // Nếu còn 1 mà giảm thì hỏi xóa
    if (confirm("Bạn muốn xóa sản phẩm này?")) removeFromCart(index);
  }
}

// Xóa sản phẩm khỏi giỏ
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart(); // Lưu ngay khi xóa
  updateCartUI();
}

// Mở/Đóng Giỏ hàng
function toggleCart() {
  document.getElementById("cartModal").style.display = "block";
}

// Mở Modal Thanh toán
function openPayment() {
  if (cart.length === 0) {
    showToast("Giỏ hàng trống, vui lòng mua thêm!", "error");
    return;
  }
  closeModal("cartModal");

  // Reset form về bước 1
  document.getElementById("paymentForm").style.display = "block";
  document.getElementById("paymentQR").style.display = "none";

  document.getElementById("paymentModal").style.display = "block";
}

// Xử lý chuyển bước trong thanh toán
function showQR() {
  const name = document.getElementById("cusName").value;
  const phone = document.getElementById("cusPhone").value;
  const address = document.getElementById("cusAddress").value;

  if (!name || !phone || !address) {
    showToast("Vui lòng điền đầy đủ thông tin giao hàng! 🚚", "error");
    return;
  }

  // Validate Phone Number (VN Phone Regex)
  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
  if (!phoneRegex.test(phone)) {
    showToast("Số điện thoại không hợp lệ! Vui lòng kiểm tra lại.", "error");
    return;
  }

  // 1. Tính tổng tiền
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 2. Tạo mã QR VietQR động (Tự động điền số tiền và nội dung)
  // Ngân hàng: MB Bank, STK: 0000000000 (Demo), Tên: TECHSTORE
  const BANK_ID = "MB";
  const ACCOUNT_NO = "0000000000";
  const TEMPLATE = "compact2"; // Mẫu QR gọn đẹp
  const DESCRIPTION = `Thanh toan don hang ${phone}`; // Dùng SĐT làm nội dung
  const ACCOUNT_NAME = "TECHSTORE";

  // URL API VietQR
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${total}&addInfo=${encodeURIComponent(DESCRIPTION)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  // Cập nhật ảnh QR trong Modal
  const qrImg = document.getElementById("qrImage");
  if (qrImg) {
    qrImg.src = qrUrl;
  }

  // Chuyển sang bước 2
  document.getElementById("paymentForm").style.display = "none";
  document.getElementById("paymentQR").style.display = "block";
}

function backToForm() {
  document.getElementById("paymentForm").style.display = "block";
  document.getElementById("paymentQR").style.display = "none";
}

function finishPayment() {
  // Giả lập hiệu ứng đang kiểm tra giao dịch
  const btn = document.querySelector("#paymentModal button");
  const originalText = btn.innerText;

  btn.innerText = "Đang kiểm tra giao dịch...";
  btn.disabled = true;
  btn.style.backgroundColor = "#ccc";
  btn.style.cursor = "wait";

  setTimeout(() => {
    cart = [];
    saveCart(); // Xóa giỏ hàng trong storage
    updateCartUI();
    closeModal("paymentModal");

    launchConfetti(); // Bắn pháo hoa chúc mừng
    showToast("✅ Thanh toán thành công! Cảm ơn bạn đã mua hàng.", "success");

    // Reset trạng thái nút
    btn.innerText = originalText;
    btn.disabled = false;
    btn.style.backgroundColor = "";
    btn.style.cursor = "pointer";
  }, 2000); // Đợi 2 giây giả lập
}

// --- HIỆU ỨNG PHÁO HOA (CONFETTI) ---
function launchConfetti() {
  var duration = 3 * 1000;
  var animationEnd = Date.now() + duration;
  var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10001 };

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  var interval = setInterval(function () {
    var timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    var particleCount = 50 * (timeLeft / duration);
    // Bắn từ 2 bên góc dưới màn hình
    confetti({
      ...defaults,
      particleCount,
      origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
}

// --- LOGIN LOGIC ---
function openLogin() {
  document.getElementById("loginModal").style.display = "block";
}

function login() {
  const user = document.getElementById("username").value;
  if (user) {
    showToast("Xin chào " + user + "! Đăng nhập thành công.", "success");
    closeModal("loginModal");
    // Use a more specific ID to avoid changing the wrong button
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
      loginBtn.innerText = "👤 " + user;
    }
  } else {
    showToast("Vui lòng nhập tên đăng nhập", "error");
  }
}

// --- TOAST NOTIFICATION FUNCTION ---
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;

  container.appendChild(toast);

  // Tự động xóa sau 3s (khớp với animation CSS)
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// --- ADMIN DASHBOARD LOGIC ---

// --- CHART LOGIC ---
let productChart = null;

function renderChart() {
  const ctx = document.getElementById("productChart");
  if (!ctx) return;

  // Thống kê số lượng theo danh mục
  const stats = {
    iphone: 0,
    laptop: 0,
    audio: 0,
    accessory: 0,
  };

  productsData.forEach((p) => {
    if (stats[p.category] !== undefined) {
      stats[p.category]++;
    }
  });

  // Xóa biểu đồ cũ nếu có để vẽ lại
  if (productChart) {
    productChart.destroy();
  }

  const isDarkMode = document.body.classList.contains("dark-mode");
  const textColor = isDarkMode ? "#fff" : "#333";

  productChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Điện thoại", "Laptop", "Âm thanh", "Phụ kiện"],
      datasets: [
        {
          data: [stats.iphone, stats.laptop, stats.audio, stats.accessory],
          backgroundColor: ["#ff9966", "#0072ff", "#e926a8", "#00c6ff"],
          borderWidth: 0,
          hoverOffset: 10,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: textColor, font: { family: "Segoe UI" } },
        },
        title: { display: false },
      },
    },
  });
}

// Render bảng sản phẩm
function renderAdminTable() {
  const tbody = document.getElementById("adminTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (productsData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 20px;">Chưa có sản phẩm nào.</td></tr>`;
    return;
  }

  productsData.forEach((p, index) => {
    // Thêm animation delay để tạo hiệu ứng xuất hiện lần lượt
    const row = `
            <tr style="animation: fadeIn 0.4s ease forwards; animation-delay: ${index * 0.05}s;">
                <td>#${p.id}</td>
                <td><img src="${p.img}" alt="${p.name}"></td>
                <td><strong>${p.name}</strong></td>
                <td style="color: #e926a8; font-weight: bold;">${p.price.toLocaleString("vi-VN")}đ</td>
                <td><span class="badge-category">${p.category}</span></td>
                <td>
                    <button class="action-btn btn-edit" onclick="openProductModal(${p.id})">✏️ Sửa</button>
                    <button class="action-btn btn-delete" onclick="deleteProduct(${p.id})">🗑️ Xóa</button>
                </td>
            </tr>
        `;
    tbody.innerHTML += row;
  });

  // Vẽ lại biểu đồ mỗi khi bảng cập nhật
  renderChart();
}

// Mở Modal Thêm/Sửa
function openProductModal(id = null) {
  const modal = document.getElementById("adminModal");
  const title = document.getElementById("adminModalTitle");
  const form = document.getElementById("productForm");

  form.reset(); // Xóa dữ liệu cũ

  if (id) {
    // Chế độ Sửa
    const product = productsData.find((p) => p.id === id);
    if (product) {
      title.innerText = "Cập Nhật Sản Phẩm";
      document.getElementById("prodId").value = product.id;
      document.getElementById("prodName").value = product.name;
      document.getElementById("prodPrice").value = product.price;
      document.getElementById("prodCategory").value = product.category;
      document.getElementById("prodImg").value = product.img;
      document.getElementById("prodBadge").value = product.badge || "";
      document.getElementById("prodVoucher").value = product.voucher || "";
      document.getElementById("prodSpecs").value = product.specs
        ? product.specs.join("\n")
        : "";
    }
  } else {
    // Chế độ Thêm mới
    title.innerText = "Thêm Sản Phẩm Mới";
    document.getElementById("prodId").value = "";
  }

  modal.style.display = "block";
}

// Xử lý Submit Form
async function handleProductSubmit(e) {
  e.preventDefault();

  const id = document.getElementById("prodId").value;
  const newProduct = {
    id: id ? parseInt(id) : Date.now(), // Nếu không có ID thì tạo ID mới bằng timestamp
    name: document.getElementById("prodName").value,
    price: parseInt(document.getElementById("prodPrice").value),
    category: document.getElementById("prodCategory").value,
    img: document.getElementById("prodImg").value,
    badge: document.getElementById("prodBadge").value,
    voucher: document.getElementById("prodVoucher").value,
    specs: document
      .getElementById("prodSpecs")
      .value.split("\n")
      .filter((line) => line.trim() !== ""),
  };

  try {
    let response;
    if (id) {
      // Update API
      response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
    } else {
      // Create API
      response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
    }

    if (response.ok) {
      showToast(id ? "Đã cập nhật!" : "Đã thêm mới!", "success");
      fetchProducts(); // Tải lại dữ liệu mới
      closeModal("adminModal");
    } else {
      showToast("Có lỗi xảy ra!", "error");
    }
  } catch (error) {
    console.error(error);
    showToast("Lỗi kết nối server", "error");
  }
}

// Xóa sản phẩm
async function deleteProduct(id) {
  if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (response.ok) {
        showToast("Đã xóa sản phẩm!", "success");
        fetchProducts();
      } else {
        showToast("Lỗi khi xóa!", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Lỗi kết nối server", "error");
    }
  }
}
