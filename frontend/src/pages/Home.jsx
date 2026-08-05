import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard';
import { apiFetch } from '../api';

const Home = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
      const res = await apiFetch('/api/products');
        const data = await res.json();
        setProducts(data.slice(0, 4));
      }
      catch (error) {
        console.log(error);
      }
      finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home-container">
      <section className="hero-section">
        <h1 className="hero-title" style={{color:'blue'}}>Welcome to DailyCart</h1>
        <p className="hero-subtitle" style={{color:'white'}}>Your one-stop shop for all your daily needs, from essentials to trending favorites.</p>
      </section>

      <section className="featured-section">
        <h2 className="featured-title" style={{marginLeft:'10px'}}>Featured Products</h2>
        {loading ? (
          <div className="loading-state">Loading products...</div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home