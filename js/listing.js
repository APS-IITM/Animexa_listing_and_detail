const SHEET_ID = "2PACX-1vSVSfl-Irot953M2HL_tY9qzbA0MOHtROcCIhELcIcjwL_YpZZjvhNBH5A9NPSQHssA8AJsuZQ7rsvk/pubhtml";
const SHEET_NAME = "Sheet1";
const SHEET_URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

fetch(SHEET_URL)
  .then(res => res.json())
  .then(products => {
    const list = document.getElementById("product-list");

    products.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p>${p.short_desc}</p>
        <p>⭐ ${p.rating}</p>
        <div class="buttons">
          <button class="view-btn" onclick="viewProduct('${p.id}')">View</button>
          <a href="${p.gumroad_link}" target="_blank">
            <button class="buy-btn">Buy</button>
          </a>
        </div>
      `;

      list.appendChild(card);
    });
  });

function viewProduct(id) {
  window.location.href = `product.html?id=${id}`;
}
