import React from "react";
import { useShop } from "../context/ShopContext";
import "./Wishlist.css";

function Wishlist() {
  const { wishlist, removeFromWishlist, addToCart } = useShop();

  if (wishlist.length === 0) {
    return <h2 style={{ padding: "40px" }}>Your wishlist is empty ❤️</h2>;
  }

  return (
    <div className="wishlist-container">
      <h2>My Wishlist</h2>

      <div className="wishlist-grid">
        {wishlist.map((product) => (
          <div className="wishlist-card" key={product.id}>
            <img src={product.image} alt={product.name} />

            <div className="wishlist-info">
              <h4>{product.name}</h4>
              <p className="price">
                ₹{product.price.toLocaleString("en-IN")}
              </p>

              <div className="wishlist-actions">
                <button onClick={() => addToCart(product)}>
                  Add to Cart
                </button>

                <button
                  className="remove"
                  onClick={() => removeFromWishlist(product.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
