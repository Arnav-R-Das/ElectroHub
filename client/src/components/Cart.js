import React from "react";
import { useShop } from "../context/ShopContext";
import "./Cart.css"; // optional, only if you want styling

function Cart() {
  const { cart, removeFromCart } = useShop();

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty 🛒</p>
      ) : (
        cart.map((item) => (
          <div className="cart-item" key={item.id}>
            <img src={item.image} alt={item.name} />

            <div className="cart-info">
              <h4>{item.name}</h4>
              <p>₹{item.price.toLocaleString("en-IN")}</p>
              <p>Quantity: {item.qty}</p>

              <button onClick={() => removeFromCart(item.id)}>
                Remove
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Cart;
