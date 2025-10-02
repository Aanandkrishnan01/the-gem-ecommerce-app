import React, { createContext, useContext, useReducer, useEffect } from 'react';

const OrdersContext = createContext();

const ordersReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_ORDERS':
      return {
        ...state,
        orders: action.payload,
        loading: false
      };

    case 'ADD_ORDER':
      const newOrders = [...state.orders, action.payload];
      localStorage.setItem('userOrders', JSON.stringify(newOrders));
      return {
        ...state,
        orders: newOrders
      };

    case 'UPDATE_ORDER_STATUS':
      const updatedOrders = state.orders.map(order =>
        order.id === action.payload.orderId
          ? { 
              ...order, 
              status: action.payload.status,
              trackingUpdates: [
                ...order.trackingUpdates,
                {
                  status: action.payload.status,
                  date: new Date().toISOString(),
                  location: action.payload.location || 'Processing Center'
                }
              ]
            }
          : order
      );
      localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
      return {
        ...state,
        orders: updatedOrders
      };

    case 'CANCEL_ORDER':
      const cancelledOrders = state.orders.map(order =>
        order.id === action.payload
          ? { 
              ...order, 
              status: 'cancelled',
              trackingUpdates: [
                ...order.trackingUpdates,
                {
                  status: 'cancelled',
                  date: new Date().toISOString(),
                  location: 'Customer Request'
                }
              ]
            }
          : order
      );
      localStorage.setItem('userOrders', JSON.stringify(cancelledOrders));
      return {
        ...state,
        orders: cancelledOrders
      };

    case 'REQUEST_RETURN':
      const returnOrders = state.orders.map(order =>
        order.id === action.payload.orderId
          ? { 
              ...order,
              returnRequest: {
                status: 'requested',
                date: new Date().toISOString(),
                reason: action.payload.reason,
                items: action.payload.items
              }
            }
          : order
      );
      localStorage.setItem('userOrders', JSON.stringify(returnOrders));
      return {
        ...state,
        orders: returnOrders
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    default:
      return state;
  }
};

const initialState = {
  orders: [],
  loading: true
};

export const OrdersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ordersReducer, initialState);

  // Load orders from localStorage on app start
  useEffect(() => {
    const savedOrders = localStorage.getItem('userOrders');
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        dispatch({ type: 'LOAD_ORDERS', payload: parsedOrders });
      } catch (error) {
        console.error('Error loading orders:', error);
        dispatch({ type: 'LOAD_ORDERS', payload: [] });
      }
    } else {
      // Initialize with sample orders for demonstration
      const sampleOrders = [
        {
          id: 'ORD-2025-001',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'shipped',
          total: 149.99,
          subtotal: 129.99,
          shipping: 15.00,
          tax: 5.00,
          shippingAddress: {
            name: 'John Doe',
            address: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States'
          },
          items: [
            {
              id: 1,
              name: 'Classic White Sneakers',
              price: 89.99,
              quantity: 1,
              size: 'M',
              color: 'White',
              image: '/images/product_1.png'
            },
            {
              id: 2,
              name: 'Cotton T-Shirt',
              price: 39.99,
              quantity: 1,
              size: 'L',
              color: 'Blue',
              image: '/images/product_2.png'
            }
          ],
          trackingNumber: 'TRK123456789',
          trackingUpdates: [
            {
              status: 'confirmed',
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              location: 'Order Processing Center'
            },
            {
              status: 'shipped',
              date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              location: 'New York Distribution Center'
            }
          ],
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          canCancel: false,
          canReturn: false
        }
      ];
      dispatch({ type: 'LOAD_ORDERS', payload: sampleOrders });
      localStorage.setItem('userOrders', JSON.stringify(sampleOrders));
    }
  }, []);

  const createOrder = (orderData) => {
    const newOrder = {
      id: `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      date: new Date().toISOString(),
      status: 'confirmed',
      trackingUpdates: [
        {
          status: 'confirmed',
          date: new Date().toISOString(),
          location: 'Order Processing Center'
        }
      ],
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      trackingNumber: `TRK${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      canCancel: true,
      canReturn: false,
      ...orderData
    };
    
    dispatch({ type: 'ADD_ORDER', payload: newOrder });
    return newOrder;
  };

  const updateOrderStatus = (orderId, status, location) => {
    dispatch({ 
      type: 'UPDATE_ORDER_STATUS', 
      payload: { orderId, status, location } 
    });
  };

  const cancelOrder = (orderId) => {
    dispatch({ type: 'CANCEL_ORDER', payload: orderId });
  };

  const requestReturn = (orderId, reason, items) => {
    dispatch({ 
      type: 'REQUEST_RETURN', 
      payload: { orderId, reason, items } 
    });
  };

  const getUserOrders = (userId) => {
    // In a real app, filter by user ID
    return state.orders.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const getOrderById = (orderId) => {
    return state.orders.find(order => order.id === orderId);
  };

  const getOrderStats = () => {
    const orders = state.orders;
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'confirmed' || o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      returned: orders.filter(o => o.returnRequest?.status === 'approved').length
    };
  };

  const value = {
    orders: state.orders,
    loading: state.loading,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    requestReturn,
    getUserOrders,
    getOrderById,
    getOrderStats
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};

export default OrdersContext;