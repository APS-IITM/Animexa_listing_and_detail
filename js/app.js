// ============================================
// INDEX PAGE - HOME & CATEGORY SELECTION
// ============================================

/**
 * Select product type and navigate to marketplace
 * @param {string} type - Product type (animated, 3d, canva)
 */
function selectType(type) {
    // Store selected type in localStorage
    localStorage.setItem("productType", type);
    // Navigate to marketplace
    window.location.href = "marketplace.html";
}