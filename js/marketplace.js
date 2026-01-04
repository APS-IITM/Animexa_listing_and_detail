// Supabase config
const SUPABASE_URL = "https://kfzzfjiicoqvirofkvyy.supabase.co";
const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmenpmamlpY29xdmlyb2Zrdnl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNjk5NjYsImV4cCI6MjA4Mjg0NTk2Nn0.3Eciwhgr7tY1bT7ixbziaOx-eKGS8rDS58dY365mOVk";


/* ---------------- CATEGORY RESOLUTION ---------------- */
const params = new URLSearchParams(window.location.search);
let category = params.get("category"); // animated | 3d | canva

// fallback to index page selection
if (!category) {
    category = localStorage.getItem("productType");
}

// fail-safe
if (!category) {
    document.getElementById("marketTitle").innerText = "Category Not Selected";
    throw new Error("No category provided");
}

/* ---------------- UI SETUP ---------------- */
let currentType = "bundle";

const titleMap = {
    animated: "Animated Wallpapers",
    "3d": "3D Live Wallpapers",
    canva: "Canva Animated Cards"
};

document.getElementById("marketTitle").innerText = titleMap[category];

const grid = document.getElementById("productGrid");
const tabs = document.querySelectorAll(".tab");

tabs.forEach(tab => {
    tab.onclick = () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        currentType = tab.dataset.type;
        loadProducts();
    };
});

/* ---------------- DATA LOAD ---------------- */
async function loadProducts() {
    grid.innerHTML = "";

    const url =
        `${SUPABASE_URL}/rest/v1/products` +
        `?category=eq.${category}` +
        `&product_type=eq.${currentType}`;

    const res = await fetch(url, {
        headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`
        }
    });

    const products = await res.json();

    products.forEach(p => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${p.image_url}" />
            <h3>${p.name}</h3>
            <p>${p.short_desc || ""}</p>
            <div class="price">₹${p.price}</div>
        `;

        card.onclick = () => {
            localStorage.setItem("selectedProduct", JSON.stringify(p));
            window.location.href = "product.html";
        };

        grid.appendChild(card);
    });
}

loadProducts();
