import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import localProductService from '../services/localProductService';

const ShoesPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shoeTypeFilter, setShoeTypeFilter] = useState('');

  useEffect(() => {
    const loadShoesProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await localProductService.getProducts();
        // Filter for shoes category only
        const shoeProducts = allProducts.filter(product => product.category === 'shoes');
        setProducts(shoeProducts);
        setFilteredProducts(shoeProducts);
      } catch (error) {
        console.error('Error loading shoes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadShoesProducts();
  }, []);

  useEffect(() => {
    if (shoeTypeFilter) {
      setFilteredProducts(products.filter(product => 
        product.subcategory && product.subcategory === shoeTypeFilter
      ));
    } else {
      setFilteredProducts(products);
    }
  }, [shoeTypeFilter, products]);

  if (loading) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading shoes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light text-foreground mb-4">Shoes Collection</h1>
          <p className="text-muted-foreground mb-6">
            {filteredProducts.length} shoes available
          </p>
          
          {/* Shoe Type Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">Filter by Type</label>
            <select
              value={shoeTypeFilter}
              onChange={(e) => setShoeTypeFilter(e.target.value)}
              className="input px-4 py-2"
            >
              <option value="">All Types</option>
              <option value="running">Running Shoes</option>
              <option value="casual">Casual Sneakers</option>
              <option value="training">Training Shoes</option>
              <option value="walking">Walking Shoes</option>
              <option value="basketball">Basketball Shoes</option>
              <option value="fashion">Fashion Sneakers</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No shoes found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card group">
                <Link to={`/products/${product.id}`}>
                  <div className="aspect-square bg-muted mb-4 flex items-center justify-center overflow-hidden rounded-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full items-center justify-center text-muted-foreground">
                      Image not found
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-foreground mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground mb-2 capitalize">{product.subcategory} - {product.fit}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-semibold text-foreground">${product.price}</p>
                      <div className="flex items-center text-yellow-400">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                        <span className="text-sm text-muted-foreground ml-1">
                          {typeof product.rating === 'object' ? product.rating.average : product.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoesPage;