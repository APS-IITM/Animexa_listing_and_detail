// ============================================
// SUPABASE CONFIG - USING JS CLIENT
// ============================================
const SUPABASE_URL = "https://kfzzfjiicoqvirofkvyy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmenpmamlpY29xdmlyb2Zrdnl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNjk5NjYsImV4cCI6MjA4Mjg0NTk2Nn0.3Eciwhgr7tY1bT7ixbziaOx-eKGS8rDS58dY365mOVk";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const params = new URLSearchParams(window.location.search);
let category = params.get("category");

if (!category) {
    category = localStorage.getItem("productType");
}

if (category) {
    category = category.toLowerCase().trim();
}

if (!category) {
    document.getElementById("marketTitle").innerText = "No Category Selected";
    document.getElementById("productGrid").innerHTML = `
        <div style="color: #ff6b6b; text-align: center; padding: 40px; grid-column: 1/-1;">
            <p>Please select a category from the dashboard first.</p>
            <a href="dashboard.html" style="color: #00e5ff;">← Back to Dashboard</a>
        </div>
    `;
    throw new Error("No category provided");
}

document.getElementById("marketTitle").innerText = `${category.charAt(0).toUpperCase() + category.slice(1)} Products`;

let currentType = "bundle";
let currentLicense = "personal";

const grid = document.getElementById("productGrid");
const typeTabs = document.querySelectorAll(".tab");
const licenseTabs = document.querySelectorAll(".license");

typeTabs.forEach(tab => {
    tab.addEventListener("click", function () {
        typeTabs.forEach(t => t.classList.remove("active"));
        this.classList.add("active");
        currentType = this.dataset.type.toLowerCase().trim();
        console.log("Type changed to:", currentType);
        loadProducts();
    });
});

licenseTabs.forEach(btn => {
    btn.addEventListener("click", function () {
        licenseTabs.forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        currentLicense = this.dataset.license.toLowerCase().trim();
        console.log("License changed to:", currentLicense);
        loadProducts();
    });
});

async function loadProducts() {
    try {
        grid.innerHTML = '<p style="color: #999; text-align: center; padding: 40px; grid-column: 1/-1;">Loading products...</p>';

        console.log("🔍 Searching with filters:", {
            category: category,
            product_type: currentType,
            license: currentLicense
        });

        let query = supabaseClient
            .from("products")
            .select("*")
            .eq("category", category)
            .eq("product_type", currentType)
            .eq("license", currentLicense);

        const { data: products, error } = await query;

        if (error) {
            console.error("❌ Supabase Error:", error);
            grid.innerHTML = `
                <div style="color: #ff6b6b; text-align: center; padding: 40px; grid-column: 1/-1;">
                    <p>Error loading products: ${error.message}</p>
                    <p style="font-size: 12px; color: #999;">
                        Category: <strong>${category}</strong> | 
                        Type: <strong>${currentType}</strong> | 
                        License: <strong>${currentLicense}</strong>
                    </p>
                </div>
            `;
            return;
        }

        if (!products || products.length === 0) {
            grid.innerHTML = `
                <div style="color: #999; text-align: center; padding: 40px; grid-column: 1/-1;">
                    <p>No products found for this category.</p>
                    <p style="font-size: 12px;">
                        Searching for: <strong>${category}</strong> | <strong>${currentType}</strong> | <strong>${currentLicense}</strong>
                    </p>
                    <p style="font-size: 12px;">Try different filters or add products from the dashboard</p>
                </div>
            `;
            console.warn("⚠️ No products found with current filters");
            return;
        }

        grid.innerHTML = "";
        products.forEach(p => {
            const card = document.createElement("div");
            card.className = "card";

            const videourl = p.video_url || "";
            const thumbUrl =
                p.thumbnail_url ||
                p.video_url ||
                "https://via.placeholder.com/260x160?text=No+Preview";
            const price = p.price ? `₹${p.price}` : "Contact";
            const description = p.short_desc || "No description available";
            const name = p.name || "Untitled";

            card.innerHTML = `
        <div class="card-media" style="position: relative; width: 100%; height: 160px; overflow: hidden; background:#000;">
            <img
                class="card-thumb"
                src="${thumbUrl}"
                alt="${name}"
                style="width:100%;height:100%;object-fit:cover;display:block;transition:opacity 250ms ease;"
                onerror="this.src='https://via.placeholder.com/260x160?text=No+Image';"
            />
            ${videourl
                    ? `
            <video
                class="card-video"
                src="${videourl}"
                muted
                loop
                playsinline
                style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity 250ms ease;"
            ></video>`
                    : ""
                }
        </div>
        <h3>${name}</h3>
        <p>${description}</p>
        <div class="price">${price}</div>
        <div class="meta">
            <span>${p.product_type}</span>
            <span>${p.license}</span>
        </div>
    `;

            // Hover: play video
            card.addEventListener("mouseenter", () => {
                const thumb = card.querySelector(".card-thumb");
                const video = card.querySelector(".card-video");
                if (!video) return;

                if (thumb) thumb.style.opacity = "0";
                video.style.opacity = "1";
                video.currentTime = 0;

                const playPromise = video.play();
                if (playPromise && playPromise.catch) {
                    playPromise.catch(() => {
                        // Autoplay blocked → revert to image
                        if (thumb) thumb.style.opacity = "1";
                        video.style.opacity = "0";
                    });
                }
            });

            // Leave: pause video
            card.addEventListener("mouseleave", () => {
                const thumb = card.querySelector(".card-thumb");
                const video = card.querySelector(".card-video");
                if (!video) return;

                video.pause();
                video.currentTime = 0;
                video.style.opacity = "0";
                if (thumb) thumb.style.opacity = "1";
            });

            // Click → go to detail
            card.addEventListener("click", () => {
                localStorage.setItem("selectedProduct", JSON.stringify(p));
                window.location.href = "product.html";
            });

            grid.appendChild(card);
        });

        console.log(`✅ Loaded ${products.length} products`);

    } catch (err) {
        console.error("❌ JavaScript Error:", err);
        grid.innerHTML = `
            <div style="color: #ff6b6b; text-align: center; padding: 40px; grid-column: 1/-1;">
                <p>Something went wrong!</p>
                <p style="font-size: 12px; color: #999;">${err.message}</p>
            </div>
        `;
    }
}

loadProducts();

console.log(`📦 Marketplace initialized for category: ${category}`);
