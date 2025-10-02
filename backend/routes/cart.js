const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

// In-memory cart storage for demo purposes
// In production, this should be stored in database or session
const carts = new Map();

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = carts.get(userId) || { items: [], total: 0 };

    res.json({
      cart,
      itemCount: cart.items.length,
      totalAmount: cart.total
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error fetching cart'
    });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', [auth, [
  body('productId').notEmpty().isMongoId(),
  body('quantity').isInt({ min: 1 }),
  body('size').optional().notEmpty(),
  body('color').optional().notEmpty()
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

    const userId = req.user.userId;
    const { productId, quantity, size, color, price, name, image } = req.body;

    // Get or create cart
    let cart = carts.get(userId) || { items: [], total: 0 };

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.productId === productId && 
      item.size === size && 
      item.color === color
    );

    if (existingItemIndex !== -1) {
      // Update existing item
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        name,
        price,
        quantity,
        size,
        color,
        image,
        addedAt: new Date()
      });
    }

    // Recalculate total
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Save cart
    carts.set(userId, cart);

    res.json({
      message: 'Item added to cart',
      cart,
      itemCount: cart.items.length,
      totalAmount: cart.total
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error adding item to cart'
    });
  }
});

// @route   PUT /api/cart/update/:itemId
// @desc    Update item quantity in cart
// @access  Private
router.put('/update/:itemId', [auth, [
  body('quantity').isInt({ min: 1 })
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

    const userId = req.user.userId;
    const { itemId } = req.params;
    const { quantity } = req.body;

    let cart = carts.get(userId);
    if (!cart) {
      return res.status(404).json({
        message: 'Cart not found'
      });
    }

    // Find and update item
    const itemIndex = cart.items.findIndex((item, index) => index.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({
        message: 'Item not found in cart'
      });
    }

    cart.items[itemIndex].quantity = quantity;

    // Recalculate total
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Save cart
    carts.set(userId, cart);

    res.json({
      message: 'Cart updated',
      cart,
      itemCount: cart.items.length,
      totalAmount: cart.total
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error updating cart'
    });
  }
});

// @route   DELETE /api/cart/remove/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:itemId', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { itemId } = req.params;

    let cart = carts.get(userId);
    if (!cart) {
      return res.status(404).json({
        message: 'Cart not found'
      });
    }

    // Remove item
    const itemIndex = cart.items.findIndex((item, index) => index.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({
        message: 'Item not found in cart'
      });
    }

    cart.items.splice(itemIndex, 1);

    // Recalculate total
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Save cart
    carts.set(userId, cart);

    res.json({
      message: 'Item removed from cart',
      cart,
      itemCount: cart.items.length,
      totalAmount: cart.total
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error removing item from cart'
    });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear cart
// @access  Private
router.delete('/clear', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Clear cart
    carts.set(userId, { items: [], total: 0 });

    res.json({
      message: 'Cart cleared',
      cart: { items: [], total: 0 },
      itemCount: 0,
      totalAmount: 0
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error clearing cart'
    });
  }
});

// @route   POST /api/cart/apply-coupon
// @desc    Apply coupon code
// @access  Private
router.post('/apply-coupon', [auth, [
  body('couponCode').notEmpty().trim()
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

    const userId = req.user.userId;
    const { couponCode } = req.body;

    let cart = carts.get(userId);
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: 'Cart is empty'
      });
    }

    // Mock coupon validation - replace with actual coupon system
    const validCoupons = {
      'SAVE10': { type: 'percentage', value: 10, minOrder: 50 },
      'FIRST20': { type: 'percentage', value: 20, minOrder: 100 },
      'FLAT15': { type: 'fixed', value: 15, minOrder: 75 }
    };

    const coupon = validCoupons[couponCode.toUpperCase()];
    if (!coupon) {
      return res.status(400).json({
        message: 'Invalid coupon code'
      });
    }

    if (cart.total < coupon.minOrder) {
      return res.status(400).json({
        message: `Minimum order amount of $${coupon.minOrder} required for this coupon`
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = (cart.total * coupon.value) / 100;
    } else {
      discountAmount = coupon.value;
    }

    // Apply discount
    cart.discount = {
      code: couponCode.toUpperCase(),
      amount: discountAmount,
      type: coupon.type,
      value: coupon.value
    };

    cart.discountedTotal = cart.total - discountAmount;

    // Save cart
    carts.set(userId, cart);

    res.json({
      message: 'Coupon applied successfully',
      cart,
      discount: cart.discount,
      savings: discountAmount
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error applying coupon'
    });
  }
});

// @route   DELETE /api/cart/remove-coupon
// @desc    Remove applied coupon
// @access  Private
router.delete('/remove-coupon', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    let cart = carts.get(userId);
    if (!cart) {
      return res.status(404).json({
        message: 'Cart not found'
      });
    }

    // Remove discount
    delete cart.discount;
    delete cart.discountedTotal;

    // Save cart
    carts.set(userId, cart);

    res.json({
      message: 'Coupon removed',
      cart
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error removing coupon'
    });
  }
});

module.exports = router;