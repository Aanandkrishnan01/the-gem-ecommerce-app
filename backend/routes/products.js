const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isIn(['clothes', 'shoes', 'accessories']),
  query('minPrice').optional().isNumeric(),
  query('maxPrice').optional().isNumeric(),
  query('sort').optional().isIn(['name', 'price', 'rating', 'newest', 'sales'])
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Invalid query parameters',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 20,
      category,
      tags,
      minPrice,
      maxPrice,
      search,
      sort = 'newest',
      featured
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (tags) {
      filter.tags = { $in: tags.split(',') };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'price':
        sortObj.price = 1;
        break;
      case 'price-desc':
        sortObj.price = -1;
        break;
      case 'rating':
        sortObj['rating.average'] = -1;
        break;
      case 'name':
        sortObj.name = 1;
        break;
      case 'sales':
        sortObj.salesCount = -1;
        break;
      case 'newest':
      default:
        sortObj.createdAt = -1;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-reviews'),
      Product.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const currentPage = parseInt(page);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    res.json({
      products,
      pagination: {
        total,
        totalPages,
        currentPage,
        limit: parseInt(limit),
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? currentPage + 1 : null,
        prevPage: hasPrevPage ? currentPage - 1 : null
      },
      filters: {
        category,
        tags,
        minPrice,
        maxPrice,
        search,
        sort,
        featured
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error fetching products'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews');

    if (!product || !product.isActive) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.json(product);

  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'Product not found'
      });
    }
    res.status(500).json({
      message: 'Error fetching product'
    });
  }
});

// @route   GET /api/products/category/:category
// @desc    Get products by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20, sort = 'newest' } = req.query;

    if (!['clothes', 'shoes', 'accessories'].includes(category)) {
      return res.status(400).json({
        message: 'Invalid category'
      });
    }

    const filter = { category, isActive: true };

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'price':
        sortObj.price = 1;
        break;
      case 'price-desc':
        sortObj.price = -1;
        break;
      case 'rating':
        sortObj['rating.average'] = -1;
        break;
      case 'name':
        sortObj.name = 1;
        break;
      default:
        sortObj.createdAt = -1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(filter)
    ]);

    res.json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error fetching products by category'
    });
  }
});

// @route   POST /api/products
// @desc    Create new product (Admin only)
// @access  Private/Admin
router.post('/', [auth, admin, [
  body('name').notEmpty().trim().isLength({ max: 200 }),
  body('description').notEmpty().isLength({ max: 2000 }),
  body('price').isNumeric().custom(value => value > 0),
  body('category').isIn(['clothes', 'shoes', 'accessories']),
  body('stock').isInt({ min: 0 })
]], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error creating product'
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product (Admin only)
// @access  Private/Admin
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.json({
      message: 'Product updated successfully',
      product
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error updating product'
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (Admin only)
// @access  Private/Admin
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    // Soft delete by setting isActive to false
    product.isActive = false;
    await product.save();

    res.json({
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error deleting product'
    });
  }
});

// @route   GET /api/products/search/:term
// @desc    Search products
// @access  Public
router.get('/search/:term', async (req, res) => {
  try {
    const { term } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const filter = {
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: term, $options: 'i' } },
            { description: { $regex: term, $options: 'i' } },
            { tags: { $in: [new RegExp(term, 'i')] } }
          ]
        }
      ]
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ 'rating.average': -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(filter)
    ]);

    res.json({
      searchTerm: term,
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error searching products'
    });
  }
});

module.exports = router;