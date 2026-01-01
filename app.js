/* ================= CONFIG ================= */

const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_PUBLIC_ANON_KEY";

const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`
};

/* ================= HELPERS ================= */

const params = new URLSearchParams(location.search);
const type = params.get("type");
const id = params.get("id");

/* ================= LISTING ================= */

async function loadProducts() {
  if (!document.getElementById("productGrid")) return;

  let url = `${SUPABASE_URL}/rest/v1/products?select=*`;

  if (type) url += `&product_type=eq.${type}`;

  const res = await fetch(url, { headers });
  const data = await res.json();

  renderProducts(data);

  search.oninput = () => {
    const q = search.value.toLowerCase();
    renderProducts(data.filter(p => p.name.toLowerCase().includes(q)));
  };

  sort.onchange = () => {
    const [key, dir] = sort.value.split(".");
    renderProducts([...data].sort((a, b) =>
      dir === "asc" ? a[key] - b[key] : b[key] - a[key]
    ));
  };
}

function renderProducts(products) {
  productGrid.innerHTML = "";

  products.forEach(p => {
    const img =
      p.image_url ||
      (Array.isArray(p.image_urls) ? p.image_urls[0] : p.image_urls?.split(",")[0]);

    productGrid.innerHTML += `
      <div class="card">
        <img src="${img}">
        <div class="content">
          <h3>${p.name}</h3>
          <p>${p.short_desc}</p>
          <div class="price">₹${p.price}</div>
          <a class="buy" href="product.html?id=${p.id}">View</a>
        </div>
      </div>
    `;
  });
}

/* ================= DETAIL (WITH CAROUSEL) ================= */

async function loadProductDetail() {
  if (!id || !document.getElementById("productDetail")) return;

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?id=eq.${id}&select=*`,
    { headers }
  );

  const p = (await res.json())[0];
  if (!p) return;

  let images = [];

  if (Array.isArray(p.image_urls)) {
    images = p.image_urls;
  } else if (typeof p.image_urls === "string") {
    images = p.image_urls.split(",").map(i => i.trim());
  } else if (p.image_url) {
    images = [p.image_url];
  }

  productDetail.innerHTML = `
    <div class="carousel">
      <button class="nav left" onclick="prevImage()">‹</button>
      <img id="carouselImage" src="${images[0]}">
      <button class="nav right" onclick="nextImage()">›</button>
    </div>

    <h1>${p.name}</h1>
    <p>⭐ ${p.rating}</p>
    <p>${p.full_desc}</p>
    <h2 class="price">₹${p.price}</h2>
    <a class="buy" href="${p.gumroad_link}" target="_blank">Buy Now</a>
  `;

  window.carouselImages = images;
  window.currentIndex = 0;
}

/* ================= CAROUSEL CONTROLS ================= */

function nextImage() {
  currentIndex = (currentIndex + 1) % carouselImages.length;
  document.getElementById("carouselImage").src = carouselImages[currentIndex];
}

function prevImage() {
  currentIndex =
    (currentIndex - 1 + carouselImages.length) % carouselImages.length;
  document.getElementById("carouselImage").src = carouselImages[currentIndex];
}

/* ================= INIT ================= */

loadProducts();
loadProductDetail();
