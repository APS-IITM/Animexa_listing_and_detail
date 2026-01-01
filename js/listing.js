const SHEET_ID = "1r0sIGtTOQ4Qmko_syfvaR5f55mrdmS-jQiiyO1gF2lA";
const SHEET_NAME = "Products"; // <-- Update with your tab name
const SHEET_URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

const type = new URLSearchParams(window.location.search).get("type");

const titles = {
  tools: "🚀 Premium Tools",
  templates: "🎨 Pro Templates",
  services: "🧠 Expert Services"
};

document.getElementById("pageTitle").innerText =
  titles[type] || "Products";

const loader = document.getElementById("loader");
const list = document.getElementById("product-list");

let products = [];

fetch(SHEET_URL)
  .then(res => res.json())
  .then(data => {
    products = data.filter(p => p.product_type === type);
    loader.style.display = "none";
    render(products);
  });

function render(data) {
  list.innerHTML = "";
  data.forEach(p => {
    list.innerHTML += `
      <div class="product-card">
        <img src="${p.image_url}">
        <h3>${p.name}</h3>
        <p>${p.short_desc}</p>
        <p>⭐ ${p.rating}</p>
        <div class="buttons">
          <button onclick="view('${p.id}')">View</button>
          <a href="${p.gumroad_link}" target="_blank">
            <button class="buy-btn">Buy</button>
          </a>
        </div>
      </div>
    `;
  });
}

function view(id) {
  window.top.location.href = `product.html?id=${id}&type=${type}`;
}

document.getElementById("search").oninput = e => {
  const v = e.target.value.toLowerCase();
  render(products.filter(p =>
    p.name.toLowerCase().includes(v) ||
    p.tags.toLowerCase().includes(v)
  ));
};

document.getElementById("sort").onchange = e => {
  let sorted = [...products];
  if (e.target.value === "rating")
    sorted.sort((a,b)=>b.rating-a.rating);
  if (e.target.value === "price_low")
    sorted.sort((a,b)=>a.price-b.price);
  if (e.target.value === "price_high")
    sorted.sort((a,b)=>b.price-a.price);
  render(sorted);
};
