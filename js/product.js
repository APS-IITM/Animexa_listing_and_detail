const product = JSON.parse(localStorage.getItem("selectedProduct"));

if (!product) {
    window.location.href = "marketplace.html";
}

// ✅ UPDATED: Use video_url instead of image_url
document.getElementById("video").src = product.video_url;
document.getElementById("name").innerText = product.name;
document.getElementById("desc").innerText =
    product.full_desc || product.short_desc;

document.getElementById("price").innerText = `₹${product.price}`;

// NEW: License display
document.getElementById("license").innerText =
    product.license;

document.getElementById("buy").onclick = () => {
    window.location.href = product.gumroad_url;
};