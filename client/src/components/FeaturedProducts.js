import React, { useState, useEffect } from "react";
import "./FeaturedProducts.css";

const products = [
  {
    id: 1,
    name: "JP - Space Tablet 10.4\" Wi-Fi 32GB",
    images: [
    //   "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    ],
    oldPrice: 7000,
    price: 5500,
    onSale: true,
  },
  {
    id: 2,
    name: "Ocean Pro 11 - 12.3\" Touch Screen",
    images: [
    //   "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    ],
    oldPrice: 7000,
    price: 5500,
    onSale: true,
  },
  {
    id: 3,
    name: "Shel 50\" Class LED 4K UHD Smart TV",
    images: [
    //   "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1",
      "https://images.unsplash.com/photo-1601944177325-f8867652837f",
    ],
    price: 7500,
    onSale: false,
  },
  {
    id: 4,
    name: "Fitboot Inspire Fitness Tracker",
    images: [
    //   "https://images.unsplash.com/photo-1518441902117-fad0b8b0f3a6",
      "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7",
    ],
    oldPrice: 7000,
    price: 5500,
    onSale: true,
  },
];

const FeaturedProducts = () => {
  return (
    <div className="featured-products">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % product.images.length);
    }, 2500);

    return () => clearInterval(timer);
  }, [product.images.length]);

  return (
    <div className="product-card">
      {product.onSale && <span className="sale-badge">SALE</span>}

      <img
        src={product.images[index]}
        alt={product.name}
        className="product-img slider-img"
      />

      <h3 className="product-name">{product.name}</h3>

      {product.onSale && (
        <p className="old-price">₹{product.oldPrice.toLocaleString()}</p>
      )}
      <p className="price">₹{product.price.toLocaleString()}</p>
    </div>
  );
};

export default FeaturedProducts;
