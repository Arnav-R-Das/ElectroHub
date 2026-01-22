import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import "./Landing.css";
import FeaturedProducts from "./FeaturedProducts";
import { ShopContext } from "../context/ShopContext";

function Landing() {
  const navigate = useNavigate();
  const { products } = useContext(ShopContext);

  // Fallback images (ALWAYS visible)
  const fallbackImages = [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    // "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  ];

  // Use products if available, otherwise fallback
  const heroImages =
    products && products.length > 0
      ? products.map((p) => p.image)
      : fallbackImages;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="hero-content">
          <span className="badge">Best Prices</span>

          <h1 className="animated-heading">
            Incredible Prices <br /> on All Your <br /> Favorite Items
          </h1>

          <p>Get more for less on selected brands</p>

          <button className="shop-btn" onClick={() => navigate("/shop")}>
            Shop Now
          </button>
        </div>

        <div className="hero-image">
          <img
            src={heroImages[currentIndex]}
            alt="Product"
          />
        </div>
      </section>

      <FeaturedProducts />
    </>
  );
}

export default Landing;
