import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import "./Shop.css";

const productsData = [
  {
    id: 1,
    name: "Sheer 10.2 Tablet",
    price: 5999,
    category: "Tablets",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    sale: true,
  },
  {
    id: 2,
    name: "JP Space Tablet 10.4",
    price: 8499,
    category: "Tablets",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    sale: true,
  },
  {
    id: 3,
    name: "Pilates Go Tablet",
    price: 7999,
    category: "Tablets",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    sale: false,
  },
  {
    id: 4,
    name: "Wireless Headphones",
    price: 7499,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    sale: true,
  },
  {
    id: 5,
    name: "Smart Speaker",
    price: 6499,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad",
    sale: false,
  },
  {
    id: 6,
    name: "Gaming Laptop",
    price: 58999,
    category: "Computers",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    sale: true,
  },
  {
    id: 7,
    name: "DSLR Camera",
    price: 80999,
    category: "Cameras",
    image: "https://images.unsplash.com/photo-1519183071298-a2962eadcdb2",
    sale: false,
  },
  {
    id: 8,
    name: "Drone Pro",
    price: 85999,
    category: "Drones",
    image: "https://images.unsplash.com/photo-1508614999368-9260051292e5",
    sale: true,
  },
  {
    id: 9,
    name: "Smart Watch",
    price: 6999,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b",
    sale: false,
  },
  {
    id: 10,
    name: "4K Smart TV",
    price: 45999,
    category: "TV",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6",
    sale: true,
  },
  {
    id: 11,
    name: "Bluetooth Speaker",
    price: 5999,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1587574293340-e0011c4e8ec6",
    sale: false,
  },
  {
    id: 12,
    name: "Wireless Mouse",
    price: 2499,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04",
    sale: false,
  },
];

function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(90000);

  const {
    cart,
    wishlist,
    addToCart,
    addToWishlist,
    removeFromWishlist,
    searchQuery, // ✅ SEARCH
  } = useShop();

  // ✅ FINAL FILTER (category + price + search)
  const filteredProducts = productsData.filter(
    (product) =>
      (selectedCategory === "All" ||
        product.category === selectedCategory) &&
      product.price <= maxPrice &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleWishlist = (product) => {
    const exists = wishlist.find((item) => item.id === product.id);
    if (exists) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="shop-container">
      {/* LEFT FILTER */}
      <aside className="filter-sidebar">
        <h3>All Products</h3>

        <div className="filter-section">
          <h4>Category</h4>
          {[
            "All",
            "Tablets",
            "Audio",
            "Computers",
            "Cameras",
            "Drones",
            "Wearables",
            "TV",
            "Accessories",
          ].map((cat) => (
            <p
              key={cat}
              className={selectedCategory === cat ? "active" : ""}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </p>
          ))}
        </div>

        <div className="filter-section">
          <h4>Price</h4>
          <input
            type="range"
            min="2000"
            max="90000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <p>Up to ₹{Number(maxPrice).toLocaleString("en-IN")}</p>
        </div>
      </aside>

      {/* PRODUCT GRID */}
      <main className="products-grid">
        {filteredProducts.map((product) => {
          const isWishlisted = wishlist.some(
            (item) => item.id === product.id
          );

          const isInCart = cart.some(
            (item) => item.id === product.id
          );

          return (
            <div className="product-card" key={product.id}>
              <img src={product.image} alt={product.name} />

              <div className="product-info">
                <h4>{product.name}</h4>
                <p className="price">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>

                <div className="cart-wishlist-wrapper">
                  <button
                    className="add-cart-btn"
                    onClick={() => addToCart(product)}
                    disabled={isInCart}
                    style={{
                      backgroundColor: isInCart ? "#aaa" : "#6c5ce7",
                      cursor: isInCart ? "not-allowed" : "pointer",
                    }}
                  >
                    {isInCart ? "Added to Cart ✔" : "Add to Cart"}
                  </button>

                  <span
                    className="wishlist"
                    onClick={() => toggleWishlist(product)}
                    style={{
                      color: isWishlisted ? "red" : "#999",
                    }}
                  >
                    {isWishlisted ? "♥" : "♡"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}

export default Shop;
