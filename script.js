const PRICE = 19.99;
const PRODUCT_NAME = "Desi Style Durum Atta";
const BACKEND_CHECKOUT_URL = "/api/create-checkout-session";

/* ===== PAGES ===== */
const pages = {
  home: "page-home",
  explore: "page-explore",
  product: "page-product",
  story: "page-story",
  vision: "page-vision",
  community: "page-community",
  faq: "page-faq",
  support: "page-support",
  privacy: "page-privacy",
  terms: "page-terms",
};

/* Simple in-site history so Back works */
let historyStack = ["home"];

function renderPage(key) {
  const id = pages[key] || pages.home;

  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showPage(key) {
  if (!pages[key]) key = "home";

  const last = historyStack[historyStack.length - 1];
  if (key !== last) historyStack.push(key);

  renderPage(key);
}

/* Nav clicks */
document.querySelectorAll("[data-nav]").forEach((el) => {
  el.addEventListener("click", () => showPage(el.getAttribute("data-nav")));
});

/* Back button */
const backBtn = document.getElementById("backBtn");
backBtn?.addEventListener("click", () => {
  if (historyStack.length > 1) historyStack.pop();
  const prev = historyStack[historyStack.length - 1] || "home";
  renderPage(prev);
});

/* ===== MENU ===== */
const menu = document.getElementById("sideMenu");
const overlay = document.getElementById("menuOverlay");
const openMenuBtn = document.getElementById("openMenuBtn");
const closeMenuBtn = document.getElementById("closeMenuBtn");

function openMenu() {
  menu.classList.add("open");
  overlay.classList.add("open");
}

function closeMenu() {
  menu.classList.remove("open");
  overlay.classList.remove("open");
}

openMenuBtn?.addEventListener("click", openMenu);
closeMenuBtn?.addEventListener("click", closeMenu);
overlay?.addEventListener("click", closeMenu);

document.querySelectorAll(".menuLink").forEach((btn) => {
  btn.addEventListener("click", () => {
    showPage(btn.getAttribute("data-nav"));
    closeMenu();
  });
});

/* ===== CART ===== */
const cartDrawer = document.getElementById("cartDrawer");
const cartBackdrop = document.getElementById("cartBackdrop");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartLoading = document.getElementById("cartLoading");
const cartContent = document.getElementById("cartContent");

const menuCartBtn = document.getElementById("menuCartBtn");
const buyNowBtn = document.getElementById("buyNowBtn");
const addToCartBtn = document.getElementById("addToCartBtn");
const exploreCartBtn = document.getElementById("exploreCartBtn");
const communityCartBtn = document.getElementById("communityCartBtn");
const checkoutBtn = document.getElementById("checkoutBtn");

let qty = 1;
let isCheckingOut = false;

const qtyEl = document.getElementById("qty");
const totalEl = document.getElementById("total");
const minusBtn = document.getElementById("minusBtn");
const plusBtn = document.getElementById("plusBtn");

function money(n) {
  return `$${n.toFixed(2)}`;
}

function updateTotal() {
  if (qtyEl) qtyEl.textContent = String(qty);
  if (totalEl) totalEl.textContent = money(qty * PRICE);
}

function openCart() {
  cartDrawer?.classList.add("open");
  cartBackdrop?.classList.add("open");

  cartContent?.classList.remove("show");
  if (cartLoading) cartLoading.style.display = "flex";

  setTimeout(() => {
    if (cartLoading) cartLoading.style.display = "none";
    cartContent?.classList.add("show");
  }, 250);
}

function closeCart() {
  cartDrawer?.classList.remove("open");
  cartBackdrop?.classList.remove("open");
}

openCartBtn?.addEventListener("click", openCart);
closeCartBtn?.addEventListener("click", closeCart);
cartBackdrop?.addEventListener("click", closeCart);

menuCartBtn?.addEventListener("click", () => {
  closeMenu();
  openCart();
});

buyNowBtn?.addEventListener("click", openCart);
addToCartBtn?.addEventListener("click", openCart);
exploreCartBtn?.addEventListener("click", openCart);
communityCartBtn?.addEventListener("click", openCart);

minusBtn?.addEventListener("click", () => {
  qty = Math.max(1, qty - 1);
  updateTotal();
});

plusBtn?.addEventListener("click", () => {
  qty += 1;
  updateTotal();
});

async function startCheckout() {
  if (isCheckingOut) return;

  const safeQty = Math.max(1, parseInt(qty, 10) || 1);

  try {
    isCheckingOut = true;

    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = "Redirecting...";
    }

    const response = await fetch(BACKEND_CHECKOUT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity: safeQty,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Checkout failed.");
    }

    if (!data.url) {
      throw new Error("No checkout URL returned from server.");
    }

    window.location.href = data.url;
  } catch (error) {
    console.error("Checkout error:", error);
    alert(error.message || "Something went wrong while starting checkout.");
  } finally {
    isCheckingOut = false;

    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.textContent = "Checkout Securely";
    }
  }
}

checkoutBtn?.addEventListener("click", startCheckout);

updateTotal();

/* Footer year */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* Instagram */
const instaUrl = "https://instagram.com/virsa_flour_mills";
const ig1 = document.getElementById("instagramLink");
const ig2 = document.getElementById("instagramLink2");

if (ig1) ig1.href = instaUrl;
if (ig2) ig2.href = instaUrl;