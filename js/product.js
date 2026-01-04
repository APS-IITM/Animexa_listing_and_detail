const product = JSON.parse(localStorage.getItem("selectedProduct"));

if (!product) {
    window.location.href = "marketplace.html";
}

document.getElementById("image").src = product.image_url;
document.getElementById("name").innerText = product.name;
document.getElementById("desc").innerText =
    product.full_desc || product.short_desc;

document.getElementById("price").innerText = `₹${product.price}`;

document.getElementById("buy").onclick = () => {
    window.location.href = product.gumroad_url;
};
