/* Daily Shop - script.js
   Catálogo, filtros, carrito, modal, checkout demo.
   Author: EG WEB SOLUTIONS (demo)
*/

/* ---------------------------
   Demo product data (editable)
   --------------------------- */
const PRODUCTS = [
  {
    id: "ds-001",
    title: "Buzo Classic Oversize - Gris",
    price: 6200,
    imgs: [
      "https://images.unsplash.com/photo-1602810319060-b30e944e0a84?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80"
    ],
    category: "urban",
    sizes: ["S","M","L","XL"],
    colors: ["#1f2937","#9ca3af"],
    badge: "Nuevo",
    description: "Buzo de algodón premium, corte cómodo y térmico. Ideal para todo el año.",
    featured: true
  },
  {
    id: "ds-002",
    title: "Remera Essential - Blanca",
    price: 3200,
    imgs: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80"
    ],
    category: "urban",
    sizes: ["XS","S","M","L"],
    colors: ["#ffffff"],
    badge: "Oferta",
    description: "Remera algodón peinado, estampado discreto. Cómoda y versátil.",
    featured: true
  },
  {
    id: "ds-003",
    title: "Campera Field - Verde Oliva",
    price: 15800,
    imgs: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80"
    ],
    category: "luxe",
    sizes: ["M","L","XL"],
    colors: ["#334155"],
    badge: "",
    description: "Campera con forro térmico y detalles en cuero sintético. Impermeable.",
    featured: false
  },
  {
    id: "ds-004",
    title: "Jogging Comfy - Negro",
    price: 5400,
    imgs: [
      "https://images.unsplash.com/photo-1520975685091-3e0b6b3d5c0c?auto=format&fit=crop&w=1200&q=80"
    ],
    category: "weekend",
    sizes: ["S","M","L","XL"],
    colors: ["#000000"],
    badge: "",
    description: "Pantalón jogging de tela stretch, acabado soft-touch.",
    featured: true
  },
  {
    id: "ds-005",
    title: "Vajilla (camiseta) Drop - Azul",
    price: 4200,
    imgs: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80"
    ],
    category: "weekend",
    sizes: ["S","M","L"],
    colors: ["#3b82f6"],
    badge: "Edición",
    description: "Camiseta de edición limitada con tejido premium.",
    featured: false
  },
  {
    id: "ds-006",
    title: "Vestido Silk - Rosa Palo",
    price: 13200,
    imgs: [
      "https://images.unsplash.com/photo-1520975698514-1f6668b6a0c6?auto=format&fit=crop&w=1200&q=80"
    ],
    category: "luxe",
    sizes: ["S","M","L"],
    colors: ["#ffb6c1"],
    badge: "",
    description: "Vestido elegante en seda sintética, ideal para eventos.",
    featured: false
  }
];

/* ---------------------------
   App state
   --------------------------- */
let state = {
  products: PRODUCTS.slice(),
  filters: {
    q: "",
    category: "",
    sizes: [],
    colors: [],
    priceMin: null,
    priceMax: null,
    sort: "featured"
  },
  cart: JSON.parse(localStorage.getItem("ds_cart") || "[]"),
  page: 1,
  perPage: 9
};

/* ---------------------------
   Utilities
   --------------------------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const formatPrice = (n) => n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

/* ---------------------------
   Init / DOM refs
   --------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initUI();
  hydrateFilters();
  renderProducts();
  renderCart();
  initHeroSwiper();
  document.getElementById("year").textContent = new Date().getFullYear();
});

/* ---------------------------
   UI Init
   --------------------------- */
function initUI(){
  // Header controls
  const hamburger = $("#hamburger");
  const mobilePanel = $("#mobilePanel");
  const mobileClose = $("#mobileClose");
  const overlay = $("#overlay");



  hamburger?.addEventListener("click", ()=> {
    mobilePanel?.setAttribute("aria-hidden", "false");
    mobilePanel?.classList.add("open");
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    hamburger.setAttribute("aria-expanded","true");
  });

  mobileClose?.addEventListener("click", closeMobile);
  overlay?.addEventListener("click", closeMobile);

  function closeMobile(){
    mobilePanel?.setAttribute("aria-hidden", "true");
    mobilePanel?.classList.remove("open");
    overlay.hidden = true;
    document.body.style.overflow = "";
    hamburger.setAttribute("aria-expanded","false");
  }

  // Search header
  $("#searchInput")?.addEventListener("input", (e) => {
    const val = e.target.value.trim();
    $("#filterSearch").value = val;
    state.filters.q = val;
    renderProducts();
  });

  // Catalog controls
  $("#filterSearch")?.addEventListener("input", (e)=> {
    state.filters.q = e.target.value.trim();
  });
  $("#applyFilters")?.addEventListener("click", () => {
    applyFiltersFromUI();
    renderProducts();
  });
  $("#resetFilters")?.addEventListener("click", () => {
    resetFilters();
    renderProducts();
  });
  $("#sortSelect")?.addEventListener("change", (e)=> {
    state.filters.sort = e.target.value;
    renderProducts();
  });

  // Cart toggles
  $("#cartToggle")?.addEventListener("click", toggleCart);
  $("#cartClose")?.addEventListener("click", closeCart);
  $("#checkoutBtn")?.addEventListener("click", demoCheckout);
  $("#checkoutMP")?.addEventListener("click", mercadoPagoDemo);

  // Modal close
  $("#modalClose")?.addEventListener("click", ()=> {
    try { $("#productModal").close(); } catch(e){ }
  });

  // Favorites (demo)
  $("#favoritesBtn")?.addEventListener("click", ()=> {
    alert("Funcionalidad de favoritos (demo). Podemos integrarla con cuenta de usuario en la versión pro.");
  });
  // ... todo tu código original ...

  // Cerrar menú al hacer clic en un enlace
  $$(".mobile-nav a").forEach(link => {
    link.addEventListener("click", () => {
      mobilePanel?.setAttribute("aria-hidden", "true");
      mobilePanel?.classList.remove("open");
      overlay.hidden = true;
      document.body.style.overflow = "";
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
 

}

/* ---------------------------
   Filters / UI helpers
   --------------------------- */
function hydrateFilters(){
  // categories, sizes, colors
  const cats = [...new Set(PRODUCTS.map(p => p.category))];
  const catSel = $("#filterCategory");
  cats.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = capitalize(c);
    catSel.appendChild(opt);
  });

  // sizes
  const sizesAll = [...new Set(PRODUCTS.flatMap(p => p.sizes))];
  const sizesWrap = $("#filterSizes");
  sizesAll.forEach(sz => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = sz;
    btn.addEventListener("click", ()=> {
      toggleArray(state.filters.sizes, sz);
      btn.classList.toggle("active");
    });
    sizesWrap.appendChild(btn);
  });

  // colors
  const colorsAll = [...new Set(PRODUCTS.flatMap(p => p.colors))];
  const colorsWrap = $("#filterColors");
  colorsAll.forEach(c => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.style.background = c;
    btn.title = c;
    btn.addEventListener("click", ()=> {
      toggleArray(state.filters.colors, c);
      btn.classList.toggle("active");
    });
    colorsWrap.appendChild(btn);
  });
}

function applyFiltersFromUI(){
  state.filters.category = $("#filterCategory").value || "";
  const min = parseInt($("#priceMin").value) || null;
  const max = parseInt($("#priceMax").value) || null;
  state.filters.priceMin = min; state.filters.priceMax = max;
}

/* ---------------------------
   Products render + pagination
   --------------------------- */
function filterProducts(){
  let out = state.products.slice();

  // query
  const q = (state.filters.q || "").toLowerCase();
  if(q){
    out = out.filter(p => (p.title + " " + (p.description||"")).toLowerCase().includes(q));
  }
  // category
  if(state.filters.category){
    out = out.filter(p => p.category === state.filters.category);
  }
  // sizes
  if(state.filters.sizes.length){
    out = out.filter(p => p.sizes.some(s => state.filters.sizes.includes(s)));
  }
  // colors
  if(state.filters.colors.length){
    out = out.filter(p => p.colors.some(c => state.filters.colors.includes(c)));
  }
  // price
  if(state.filters.priceMin != null){
    out = out.filter(p => p.price >= state.filters.priceMin);
  }
  if(state.filters.priceMax != null){
    out = out.filter(p => p.price <= state.filters.priceMax);
  }

  // sorting
  if(state.filters.sort === "price-asc") out.sort((a,b)=>a.price-b.price);
  if(state.filters.sort === "price-desc") out.sort((a,b)=>b.price-a.price);
  if(state.filters.sort === "new") out.sort((a,b)=> (b.featured?1:0) - (a.featured?1:0) );
  if(state.filters.sort === "featured") out.sort((a,b)=> (b.featured?1:0) - (a.featured?1:0) );

  return out;
}

function renderProducts(){
  const grid = $("#productsGrid");
  grid.innerHTML = "";
  const items = filterProducts();
  const total = items.length;
  $("#resultsCount").textContent = total;

  // simple pagination (client-side)
  const start = (state.page-1)*state.perPage;
  const paged = items.slice(start, start+state.perPage);

  paged.forEach(p => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <img class="product-thumb" loading="lazy" src="${p.imgs[0]}" alt="${escapeHtml(p.title)}">
      <div class="product-body">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div class="product-title">${escapeHtml(p.title)}</div>
            <div class="product-tag">${escapeHtml(p.category)}</div>
          </div>
          <div>${p.badge ? `<span class="badge">${escapeHtml(p.badge)}</span>` : ""}</div>
        </div>
        <div class="product-price">${formatPrice(p.price)}</div>
        <div class="product-actions">
          <button class="btn-card" data-quick="${p.id}">Vista rápida</button>
          <button class="btn-card" data-add="${p.id}">Agregar</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  // attach events
  $$("[data-quick]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.getAttribute("data-quick");
      openProductModal(id);
    });
  });
  $$("[data-add]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.getAttribute("data-add");
      addToCart(id);
    });
  });

  renderPagination(Math.ceil(total / state.perPage));
}

/* pagination control */
function renderPagination(pages){
  const wrap = $("#pagination");
  wrap.innerHTML = "";
  if(pages <= 1) return;
  for(let i=1;i<=pages;i++){
    const b = document.createElement("button");
    b.textContent = i;
    b.className = i===state.page ? "btn-small" : "btn-link";
    b.addEventListener("click", ()=> {
      state.page = i; renderProducts();
      window.scrollTo({top:220, behavior:"smooth"});
    });
    wrap.appendChild(b);
  }
}

/* ---------------------------
   Product modal / quick view
   --------------------------- */
function openProductModal(id){
  const p = PRODUCTS.find(x => x.id === id);
  if(!p) return;
  const modal = $("#productModal");

  // gallery
  const gallery = $("#modalGallery");
  gallery.innerHTML = "";
  p.imgs.forEach(src=>{
    const img = document.createElement("img");
    img.src = src;
    img.alt = p.title;
    gallery.appendChild(img);
  });

  // info
  const info = $("#modalInfo");
  info.innerHTML = `
    <h3>${escapeHtml(p.title)}</h3>
    <p class="muted">${escapeHtml(p.description)}</p>
    <div><strong>${formatPrice(p.price)}</strong></div>
    <div class="quantity-select">
      <label for="modalSize">Talla</label>
      <select id="modalSize">${p.sizes.map(s=>`<option value="${s}">${s}</option>`).join("")}</select>
    </div>
    <div style="margin-top:8px;">
      <label for="modalColor">Color</label>
      <select id="modalColor">${p.colors.map(c=>`<option value="${c}">${c}</option>`).join("")}</select>
    </div>
    <div style="margin-top:12px;">
      <label for="modalQty">Cantidad</label>
      <input id="modalQty" type="number" min="1" value="1" style="width:80px;padding:8px;border-radius:8px;border:1px solid #ddd;">
    </div>
    <div style="margin-top:12px;display:flex;gap:8px;">
      <button id="modalAdd" class="btn-primary">Agregar al carrito</button>
      <button id="modalBuy" class="btn-outline">Comprar ahora</button>
    </div>
  `;

  // show
  try{ modal.showModal(); } catch(e){ modal.setAttribute("open",""); modal.style.display="block"; }
  modal.removeAttribute("aria-hidden");

  // handlers
  $("#modalAdd").onclick = () => {
    const size = $("#modalSize").value;
    const color = $("#modalColor").value;
    const qty = parseInt($("#modalQty").value) || 1;
    addToCart(id, { size, color, qty });
    // close modal
    try{ modal.close(); } catch(e){ modal.style.display="none"; }
  };
  $("#modalBuy").onclick = () => {
    // add and go to checkout
    const size = $("#modalSize").value;
    const color = $("#modalColor").value;
    const qty = parseInt($("#modalQty").value) || 1;
    addToCart(id, { size, color, qty });
    openCartAndScrollToCheckout();
    try{ modal.close(); } catch(e){ modal.style.display="none"; }
  };
}

/* ---------------------------
   Cart logic
   --------------------------- */
function saveCart(){ localStorage.setItem("ds_cart", JSON.stringify(state.cart)); }
function renderCart(){
  const wrap = $("#cartItems");
  if(!wrap) return;
  wrap.innerHTML = "";
  if(state.cart.length === 0){
    wrap.innerHTML = `<p>Tu carrito está vacío.</p>`;
  } else {
    state.cart.forEach((item, idx) => {
      const p = PRODUCTS.find(x=>x.id===item.id);
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <img src="${p.imgs[0]}" alt="${escapeHtml(p.title)}">
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div><strong>${escapeHtml(p.title)}</strong><div style="font-size:13px;color:${'#6b7280'}">T: ${item.size || "-"} • C: ${colorLabel(item.color) || "-"}</div></div>
            <div>${formatPrice(p.price)}</div>
          </div>
          <div style="margin-top:8px;display:flex;gap:8px;align-items:center;">
            <button class="btn-small" data-dec="${idx}">−</button>
            <div aria-live="polite">${item.qty}</div>
            <button class="btn-small" data-inc="${idx}">+</button>
            <button class="btn-link" data-rem="${idx}">Eliminar</button>
          </div>
        </div>
      `;
      wrap.appendChild(div);
    });

    // events
    $$("[data-inc]").forEach(b => {
      b.addEventListener("click", (e)=> {
        const idx = parseInt(e.currentTarget.getAttribute("data-inc"));
        state.cart[idx].qty += 1; saveCart(); renderCart(); renderCartCount();
      });
    });
    $$("[data-dec]").forEach(b => {
      b.addEventListener("click", (e)=> {
        const idx = parseInt(e.currentTarget.getAttribute("data-dec"));
        state.cart[idx].qty = Math.max(1, state.cart[idx].qty - 1); saveCart(); renderCart(); renderCartCount();
      });
    });
    $$("[data-rem]").forEach(b => {
      b.addEventListener("click", (e)=> {
        const idx = parseInt(e.currentTarget.getAttribute("data-rem"));
        state.cart.splice(idx,1); saveCart(); renderCart(); renderCartCount();
      });
    });
  }

  // subtotal
  const subtotal = state.cart.reduce((s,it)=> {
    const p = PRODUCTS.find(x=>x.id===it.id);
    return s + (p.price * it.qty);
  }, 0);
  $("#cartSubtotal").textContent = formatPrice(subtotal);
  renderCartCount();
}

function renderCartCount(){
  const n = state.cart.reduce((s,it)=>s+it.qty,0);
  $("#cartCount").textContent = n;
}

/* open/close cart */
function toggleCart(){
  const cs = $("#cartSidebar");
  const isOpen = !cs.hasAttribute("hidden");
  if(isOpen){ closeCart(); } else { openCart(); }
}
function openCart(){
  const cs = $("#cartSidebar");
  cs.hidden = false;
  cs.classList.add("show");
  cs.setAttribute("open","true");
  $("#cartToggle").setAttribute("aria-expanded","true");
  document.body.style.overflow = "hidden";
}
function closeCart(){
  const cs = $("#cartSidebar");
  cs.hidden = true;
  cs.classList.remove("show");
  cs.removeAttribute("open");
  $("#cartToggle").setAttribute("aria-expanded","false");
  document.body.style.overflow = "";
}
function openCartAndScrollToCheckout(){
  openCart();
  setTimeout(()=> {
    document.getElementById("checkoutBtn").scrollIntoView({behavior:"smooth", block:"center"});
  }, 350);
}

/* add to cart */
function addToCart(id, opts = {}) {
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  const size = opts.size || p.sizes[0] || "";
  const color = opts.color || p.colors[0] || "";
  const qty = opts.qty || 1;

  // if same item with same size/color exists, increase qty
  const existing = state.cart.find(c => c.id===id && c.size===size && c.color===color);
  if(existing){ existing.qty += qty; }
  else { state.cart.push({ id, size, color, qty }); }
  saveCart();
  renderCart();
  showToast("Agregado al carrito");
}

/* ---------------------------
   Demo checkout - simulate payment
   --------------------------- */
function demoCheckout(){
  if(state.cart.length === 0){ alert("Agrega productos al carrito antes de pagar."); return; }
  // Simple simulation: show order summary
  const subtotal = state.cart.reduce((s,it)=> {
    const p = PRODUCTS.find(x=>x.id===it.id); return s + p.price*it.qty;
  },0);
  const shipping = subtotal > 15000 ? 0 : 800;
  const total = subtotal + shipping;
  const confirmMsg = `Resumen de pedido:\nSubtotal: ${formatPrice(subtotal)}\nEnvío: ${formatPrice(shipping)}\nTotal: ${formatPrice(total)}\n\nEste es un pago DEMO. En la integración real te redirigiremos a Mercado Pago (Sandbox). ¿Simular pago ahora?`;
  if(confirm(confirmMsg)){
    // clear cart for demo
    state.cart = []; saveCart(); renderCart();
    closeCart();
    showToast("Pago simulado: ¡orden confirmada!");
  }
}

/* ---------------------------
   Mercado Pago (instructions + placeholder)
   --------------------------- */
function mercadoPagoDemo(){
  if(state.cart.length === 0){ alert("Agrega productos al carrito antes de pagar."); return; }

  /* NOTE:
     To integrate Mercado Pago Checkout Pro you MUST create a preference server-side.
     This client-side demo will open a placeholder modal with instructions and an example.
     Below is the flow you'd implement in production:

     1) On your server (Node, PHP, Python...), call Mercado Pago API to create a preference:
        POST https://api.mercadopago.com/checkout/preferences
        Headers: Authorization: Bearer YOUR_ACCESS_TOKEN (Sandbox token)
        Body: {
          items: [{title, quantity, currency_id:"ARS", unit_price}],
          back_urls: { success, failure, pending },
          auto_return: "approved"
        }
        Response contains `init_point` or `sandbox_init_point`.

     2) Return that URL to your front-end and redirect:
        window.location.href = preference.sandbox_init_point;

     For demo purposes we show an informative modal:
  */

  let summary = state.cart.map(it => {
    const p = PRODUCTS.find(x=>x.id===it.id);
    return `- ${p.title} x${it.qty}: ${formatPrice(p.price*it.qty)}`;
  }).join("\n");

  alert("Mercado Pago (Sandbox) - DEMO\n\nTu orden:\n" + summary + "\n\nPara activar Mercado Pago real, implementa la creación de preferencia en el servidor. Puedo ayudarte con ese código cuando quieras.");
}

/* ---------------------------
   Helpers / small UX
   --------------------------- */
function showToast(msg, timeout=2200){
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  t.style.position = "fixed";
  t.style.bottom = "18px";
  t.style.left = "50%";
  t.style.transform = "translateX(-50%)";
  t.style.background = "rgba(0,0,0,0.8)";
  t.style.color = "#fff";
  t.style.padding = "10px 16px";
  t.style.borderRadius = "10px";
  t.style.zIndex = 2000;
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), timeout);
}

/* small utilities */
function toggleArray(arr, val){
  const i = arr.indexOf(val);
  if(i === -1) arr.push(val); else arr.splice(i,1);
}
function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
function escapeHtml(s){ return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }
function colorLabel(c){ if(!c) return ""; if(c.startsWith("#")) return c; return c; }

/* ---------------------------
   Hero swiper
   --------------------------- */
function initHeroSwiper(){
  try {
    const swiper = new Swiper('.hero-swiper', {
      loop: true,
      autoplay: { delay: 3000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      effect: 'slide'
    });
  } catch(e){}
}

/* ---------------------------
   Escape hatch for further customization
   --------------------------- */
// You can extend PRODUCTS array, change currencies, or wire backend endpoints.
// For Mercado Pago integration we provide the client-side placeholder above.
// If you want, te puedo generar el código exacto de servidor (Node/Express) para crear la preference en Sandbox y redirigir automáticamente.

const searchInput = document.getElementById("search-input");
const products = document.querySelectorAll(".product-card");

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();

    products.forEach((card) => {
      const name = card.querySelector("h3")?.textContent.toLowerCase();
      if (name && name.includes(query)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
}
