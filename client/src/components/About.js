import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-container">
      <h1>About ElectroHub</h1>

      <p className="about-intro">
        ElectroHub is your one-stop destination for the latest and most
        reliable electronic products. From smart devices to home entertainment,
        we bring technology closer to you.
      </p>

      <section className="about-section">
        <h2>Who We Are</h2>
        <p>
          Founded with a passion for innovation, ElectroHub aims to deliver
          high-quality electronics at affordable prices. We carefully curate
          our products to ensure performance, durability, and value.
        </p>
      </section>

      <section className="about-section">
        <h2>What We Offer</h2>
        <ul>
          <li>✔ Latest gadgets & electronics</li>
          <li>✔ Trusted brands & quality assurance</li>
          <li>✔ Secure shopping experience</li>
          <li>✔ Fast delivery & customer support</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          Our mission is to make modern technology accessible to everyone by
          combining innovation, affordability, and excellent customer service.
        </p>
      </section>

      {/* ✅ OUR TEAM SECTION */}
      <section className="about-section">
        <h2>Our Team</h2>
        <p>
          ElectroHub is proudly built and managed by a passionate team committed
          to innovation and quality.
        </p>
        <ul>
          <li><strong>Aastha Patel</strong></li>
          <li><strong>Arnav Das</strong></li>
        </ul>
      </section>
    </div>
  );
}

export default About;
