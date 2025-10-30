const Product = require('../models/Product');
const axios = require('axios');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

const seedProducts = async (req, res) => {
  try {
    await Product.deleteMany();
    
    const products = [
      {
        name: 'Wireless Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        price: 99.99,
        description: 'Premium wireless headphones with noise cancellation and crystal-clear sound quality.'
      },
      {
        name: 'Smart Watch',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        price: 249.99,
        description: 'Track your fitness goals with this sleek smartwatch featuring heart rate monitoring.'
      },
      {
        name: 'Laptop Backpack',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        price: 59.99,
        description: 'Durable and stylish laptop backpack with multiple compartments and USB charging port.'
      },
      {
        name: 'Bluetooth Speaker',
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
        price: 79.99,
        description: 'Portable Bluetooth speaker with 360-degree sound and 12-hour battery life.'
      },
      {
        name: 'USB-C Hub',
        image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
        price: 49.99,
        description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery.'
      },
      {
        name: 'Mechanical Keyboard',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
        price: 129.99,
        description: 'RGB mechanical keyboard with premium switches for the ultimate typing experience.'
      },
      {
        name: 'Wireless Mouse',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
        price: 39.99,
        description: 'Ergonomic wireless mouse with adjustable DPI and silent clicks.'
      },
      {
        name: 'Phone Stand',
        image: 'https://images.unsplash.com/photo-1609801338359-e6c5e0a7a070?w=500',
        price: 24.99,
        description: 'Adjustable aluminum phone stand compatible with all smartphones and tablets.'
      }
    ];

    const createdProducts = await Product.insertMany(products);
    res.status(201).json({ message: 'Products seeded successfully', products: createdProducts });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding products', error: error.message });
  }
};

const seedFromFakeStore = async (req, res) => {
  try {
    await Product.deleteMany();
    
    const response = await axios.get('https://fakestoreapi.com/products');
    const fakeStoreProducts = response.data;
    
    const products = fakeStoreProducts.map(item => ({
      name: item.title,
      image: item.image,
      price: item.price,
      description: item.description,
      category: item.category,
      brand: 'Fake Store',
      countInStock: 10,
      rating: item.rating.rate,
      numReviews: item.rating.count
    }));

    const createdProducts = await Product.insertMany(products);
    res.status(201).json({ 
      message: 'Products seeded from Fake Store API successfully', 
      count: createdProducts.length,
      products: createdProducts 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding products from Fake Store API', error: error.message });
  }
};

module.exports = { getProducts, seedProducts, seedFromFakeStore };
