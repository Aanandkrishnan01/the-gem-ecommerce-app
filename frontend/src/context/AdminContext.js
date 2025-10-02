import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AdminContext = createContext();

const adminReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    case 'SET_STATS':
      return {
        ...state,
        stats: action.payload
      };

    case 'SET_RECENT_ORDERS':
      return {
        ...state,
        recentOrders: action.payload
      };

    case 'SET_USERS':
      return {
        ...state,
        users: action.payload
      };

    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.id ? action.payload : user
        )
      };

    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload)
      };

    default:
      return state;
  }
};

const initialState = {
  loading: true,
  stats: {
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    monthlyGrowth: 0
  },
  recentOrders: [],
  users: []
};

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Load admin data on mount
  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulate loading admin data
      setTimeout(() => {
        const mockStats = {
          totalOrders: 1247,
          totalRevenue: 89250.75,
          totalUsers: 3892,
          totalProducts: 156,
          pendingOrders: 23,
          monthlyGrowth: 12.5
        };

        const mockRecentOrders = [
          {
            id: 'ORD-001',
            customer: 'John Doe',
            email: 'john@example.com',
            total: 129.99,
            status: 'pending',
            date: new Date().toISOString(),
            items: 2
          },
          {
            id: 'ORD-002',
            customer: 'Sarah Wilson',
            email: 'sarah@example.com',
            total: 89.50,
            status: 'processing',
            date: new Date(Date.now() - 3600000).toISOString(),
            items: 1
          },
          {
            id: 'ORD-003',
            customer: 'Mike Johnson',
            email: 'mike@example.com',
            total: 299.99,
            status: 'shipped',
            date: new Date(Date.now() - 7200000).toISOString(),
            items: 3
          }
        ];

        const mockUsers = [
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            role: 'customer',
            status: 'active',
            joinDate: '2024-01-15',
            lastLogin: '2024-03-20',
            orders: 5,
            totalSpent: 450.00
          },
          {
            id: '2',
            firstName: 'Sarah',
            lastName: 'Wilson',
            email: 'sarah@example.com',
            role: 'customer',
            status: 'active',
            joinDate: '2024-02-10',
            lastLogin: '2024-03-21',
            orders: 3,
            totalSpent: 299.50
          },
          {
            id: '3',
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            role: 'admin',
            status: 'active',
            joinDate: '2023-12-01',
            lastLogin: '2024-03-22',
            orders: 0,
            totalSpent: 0
          }
        ];

        dispatch({ type: 'SET_STATS', payload: mockStats });
        dispatch({ type: 'SET_RECENT_ORDERS', payload: mockRecentOrders });
        dispatch({ type: 'SET_USERS', payload: mockUsers });
        dispatch({ type: 'SET_LOADING', payload: false });
      }, 1000);
    } catch (error) {
      console.error('Error loading admin data:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateOrderStatus = (orderId, status) => {
    // In a real app, make API call to update order status
    const updatedOrders = state.recentOrders.map(order =>
      order.id === orderId ? { ...order, status } : order
    );
    dispatch({ type: 'SET_RECENT_ORDERS', payload: updatedOrders });
  };

  const updateUserRole = (userId, role) => {
    const user = state.users.find(u => u.id === userId);
    if (user) {
      dispatch({ type: 'UPDATE_USER', payload: { ...user, role } });
    }
  };

  const updateUserStatus = (userId, status) => {
    const user = state.users.find(u => u.id === userId);
    if (user) {
      dispatch({ type: 'UPDATE_USER', payload: { ...user, status } });
    }
  };

  const deleteUser = (userId) => {
    dispatch({ type: 'DELETE_USER', payload: userId });
  };

  const isAdmin = (user) => {
    return user && user.email === 'admin@example.com';
  };

  const value = {
    ...state,
    updateOrderStatus,
    updateUserRole,
    updateUserStatus,
    deleteUser,
    isAdmin,
    refreshData: loadAdminData
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export default AdminContext;