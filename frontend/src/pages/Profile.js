import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import Toast from '../components/Toast';

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { orders, cancelOrder } = useOrders();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: ''
  });

  // Security form states
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Address book state
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'home',
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main Street',
      apartment: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      isDefault: true
    }
  ]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressFormData, setAddressFormData] = useState({
    type: 'home',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    isDefault: false
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  // Initialize form data with user info
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // In a real app, you would make an API call to update user profile
    setToast({
      message: 'Profile updated successfully!',
      type: 'success'
    });
    setIsEditing(false);
  };

  const handleAddressChange = (e) => {
    setAddressFormData({
      ...addressFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (editingAddress) {
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id 
          ? { ...addressFormData, id: editingAddress.id }
          : addr
      ));
      setToast({
        message: 'Address updated successfully!',
        type: 'success'
      });
    } else {
      const newAddress = {
        ...addressFormData,
        id: Date.now()
      };
      setAddresses([...addresses, newAddress]);
      setToast({
        message: 'Address added successfully!',
        type: 'success'
      });
    }
    
    setShowAddressForm(false);
    setEditingAddress(null);
    setAddressFormData({
      type: 'home',
      firstName: '',
      lastName: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      isDefault: false
    });
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressFormData(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (addressId) => {
    setAddresses(addresses.filter(addr => addr.id !== addressId));
    setToast({
      message: 'Address deleted successfully!',
      type: 'success'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Security handlers
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({
        message: 'New passwords do not match!',
        type: 'error'
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setToast({
        message: 'Password must be at least 6 characters long!',
        type: 'error'
      });
      return;
    }

    try {
      // In a real app, make API call to change password
      // const response = await fetch('/api/auth/change-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     currentPassword: passwordData.currentPassword,
      //     newPassword: passwordData.newPassword
      //   })
      // });

      setToast({
        message: 'Password changed successfully!',
        type: 'success'
      });
      
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setToast({
        message: 'Failed to change password. Please try again.',
        type: 'error'
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // In a real app, make API call to delete account
      // const response = await fetch('/api/auth/delete-account', {
      //   method: 'DELETE',
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });

      setToast({
        message: 'Account deleted successfully. You will be logged out.',
        type: 'success'
      });

      // Logout user and redirect after a short delay
      setTimeout(() => {
        logout();
        navigate('/');
      }, 2000);
    } catch (error) {
      setToast({
        message: 'Failed to delete account. Please try again.',
        type: 'error'
      });
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-foreground mb-2">My Account</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="dark-container rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mr-3">
                  <span className="text-lg font-semibold text-muted-foreground">
                    {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'addresses' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  Address Book
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'orders' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  Order History
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'security' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  Security
                </button>
              </nav>

              <div className="border-t border-border pt-4 mt-6">
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="dark-container rounded-lg shadow-sm p-6">
              {/* Profile Information Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-medium text-foreground">Profile Information</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="btn-secondary"
                    >
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>

                  <form onSubmit={handleSaveProfile}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="input w-full disabled:bg-muted"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="(555) 123-4567"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end mt-6">
                        <button
                          type="submit"
                          className="btn-primary"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* Address Book Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-medium text-black">Address Book</h2>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="btn-primary"
                    >
                      Add New Address
                    </button>
                  </div>

                  {showAddressForm && (
                    <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
                      <h3 className="text-lg font-medium mb-4">
                        {editingAddress ? 'Edit Address' : 'Add New Address'}
                      </h3>
                      <form onSubmit={handleSaveAddress}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Address Type
                            </label>
                            <select
                              name="type"
                              value={addressFormData.type}
                              onChange={handleAddressChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            >
                              <option value="home">Home</option>
                              <option value="work">Work</option>
                              <option value="other">Other</option>
                            </select>
                          </div>

                          <div></div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              First Name
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={addressFormData.firstName}
                              onChange={handleAddressChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Last Name
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={addressFormData.lastName}
                              onChange={handleAddressChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Address
                            </label>
                            <input
                              type="text"
                              name="address"
                              value={addressFormData.address}
                              onChange={handleAddressChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Apartment/Suite (Optional)
                            </label>
                            <input
                              type="text"
                              name="apartment"
                              value={addressFormData.apartment}
                              onChange={handleAddressChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City
                            </label>
                            <input
                              type="text"
                              name="city"
                              value={addressFormData.city}
                              onChange={handleAddressChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              State
                            </label>
                            <input
                              type="text"
                              name="state"
                              value={addressFormData.state}
                              onChange={handleAddressChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              ZIP Code
                            </label>
                            <input
                              type="text"
                              name="zipCode"
                              value={addressFormData.zipCode}
                              onChange={handleAddressChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Country
                            </label>
                            <select
                              name="country"
                              value={addressFormData.country}
                              onChange={handleAddressChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            >
                              <option value="United States">United States</option>
                              <option value="Canada">Canada</option>
                              <option value="United Kingdom">United Kingdom</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="isDefault"
                              checked={addressFormData.isDefault}
                              onChange={(e) => setAddressFormData({
                                ...addressFormData,
                                isDefault: e.target.checked
                              })}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Set as default address</span>
                          </label>

                          <div className="space-x-4">
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddressForm(false);
                                setEditingAddress(null);
                              }}
                              className="btn-secondary"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="btn-primary"
                            >
                              {editingAddress ? 'Update Address' : 'Save Address'}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center mb-2">
                              <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded capitalize">
                                {address.type}
                              </span>
                              {address.isDefault && (
                                <span className="ml-2 inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="font-medium text-black">
                              {address.firstName} {address.lastName}
                            </p>
                            <p className="text-gray-600">
                              {address.address}
                              {address.apartment && `, ${address.apartment}`}
                            </p>
                            <p className="text-gray-600">
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                            <p className="text-gray-600">{address.country}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditAddress(address)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order History Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl font-medium text-foreground mb-6">Order History</h2>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-foreground mb-2">No Orders Yet</h3>
                      <p className="text-muted-foreground mb-6">
                        You haven't placed any orders yet. Start shopping to see your order history here.
                      </p>
                      <button
                        onClick={() => navigate('/products')}
                        className="btn-primary"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-medium text-foreground">Order #{order.id}</h3>
                              <p className="text-sm text-muted-foreground">
                                Placed on {new Date(order.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                              {order.trackingNumber && (
                                <p className="text-sm text-blue-600 dark:text-blue-400">
                                  Tracking: {order.trackingNumber}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
                              </span>
                              <p className="font-medium text-foreground mt-1">${order.total.toFixed(2)}</p>
                              {order.estimatedDelivery && order.status !== 'delivered' && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Est. {new Date(order.estimatedDelivery).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="border-t border-border pt-4">
                            <h4 className="font-medium text-foreground mb-2">Items ({order.items.length})</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {order.items.slice(0, 2).map((item, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                  <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                    <img 
                                      src={item.image} 
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                      }}
                                    />
                                    <div className="hidden w-full h-full items-center justify-center text-gray-500 text-xs">
                                      {item.name.charAt(0)}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-black truncate">{item.name}</p>
                                    <p className="text-xs text-gray-600">
                                      Size: {item.size} • Qty: {item.quantity}
                                    </p>
                                  </div>
                                  <p className="text-sm font-medium text-black">${item.price.toFixed(2)}</p>
                                </div>
                              ))}
                              {order.items.length > 2 && (
                                <div className="col-span-full text-sm text-gray-600 text-center py-2">
                                  +{order.items.length - 2} more items
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Order Status and Actions */}
                          <div className="flex justify-between items-center mt-4 pt-4 border-t">
                            <div className="flex space-x-3">
                              <Link 
                                to={`/orders/${order.id}`}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                View Details
                              </Link>
                              {order.status === 'delivered' && (
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                  Buy Again
                                </button>
                              )}
                            </div>
                            
                            <div className="flex space-x-2">
                              {order.canCancel && ['confirmed', 'processing'].includes(order.status) && (
                                <button 
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to cancel this order?')) {
                                      cancelOrder(order.id);
                                      setToast({
                                        message: 'Order cancelled successfully',
                                        type: 'success'
                                      });
                                    }
                                  }}
                                  className="px-3 py-1 border border-red-300 text-red-600 rounded text-sm hover:bg-red-50 transition-colors"
                                >
                                  Cancel
                                </button>
                              )}
                              {order.status === 'delivered' && !order.returnRequest && (
                                <Link 
                                  to={`/orders/${order.id}`}
                                  className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors"
                                >
                                  Return
                                </Link>
                              )}
                              {order.returnRequest && (
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                                  Return {order.returnRequest.status}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-medium text-black mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-medium text-black mb-2">Password</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Keep your account secure by using a strong password
                      </p>
                      
                      {!showChangePassword ? (
                        <button 
                          onClick={() => setShowChangePassword(true)}
                          className="btn-secondary"
                        >
                          Change Password
                        </button>
                      ) : (
                        <form onSubmit={handleChangePassword} className="mt-4">
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Password
                              </label>
                              <input
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                              </label>
                              <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                              </label>
                              <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                              />
                            </div>
                          </div>
                          
                          <div className="flex space-x-4 mt-4">
                            <button
                              type="submit"
                              className="btn-primary"
                            >
                              Update Password
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowChangePassword(false);
                                setPasswordData({
                                  currentPassword: '',
                                  newPassword: '',
                                  confirmPassword: ''
                                });
                              }}
                              className="btn-secondary"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>

                    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <h3 className="font-medium text-red-800 mb-2">Delete Account</h3>
                      <p className="text-red-600 text-sm mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      
                      {!showDeleteConfirm ? (
                        <button 
                          onClick={() => setShowDeleteConfirm(true)}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                        >
                          Delete Account
                        </button>
                      ) : (
                        <div className="mt-4">
                          <p className="text-red-700 text-sm mb-4 font-medium">
                            Are you sure you want to delete your account? This action is permanent and cannot be undone.
                          </p>
                          <div className="flex space-x-4">
                            <button
                              onClick={handleDeleteAccount}
                              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                            >
                              Yes, Delete My Account
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(false)}
                              className="btn-secondary"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Profile;