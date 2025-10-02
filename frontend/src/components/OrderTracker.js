import React from 'react';

const OrderTracker = ({ order }) => {
  const statusSteps = [
    { key: 'confirmed', label: 'Order Confirmed', icon: '📄' },
    { key: 'processing', label: 'Processing', icon: '⚙️' },
    { key: 'shipped', label: 'Shipped', icon: '🚚' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: '📦' },
    { key: 'delivered', label: 'Delivered', icon: '✅' }
  ];

  const getStatusIndex = (status) => {
    const index = statusSteps.findIndex(step => step.key === status);
    return index === -1 ? 0 : index;
  };

  const currentStatusIndex = getStatusIndex(order.status);
  const isCancelled = order.status === 'cancelled';

  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center justify-center text-red-600 mb-4">
          <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="text-lg font-medium">Order Cancelled</span>
        </div>
        <p className="text-center text-red-700">
          This order has been cancelled and will not be processed.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-medium text-black mb-6">Order Tracking</h3>
      
      {/* Tracking Number */}
      {order.trackingNumber && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tracking Number</p>
              <p className="font-mono font-medium text-black">{order.trackingNumber}</p>
            </div>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Track Package
            </button>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-4 top-4 h-full w-0.5 bg-gray-200"></div>
        <div 
          className="absolute left-4 top-4 w-0.5 bg-green-500 transition-all duration-500"
          style={{ 
            height: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` 
          }}
        ></div>

        {/* Steps */}
        <div className="space-y-8">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            const trackingUpdate = order.trackingUpdates.find(update => update.status === step.key);
            
            return (
              <div key={step.key} className="relative flex items-start">
                {/* Step Icon */}
                <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  isCompleted 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}>
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <div className="w-2 h-2 bg-current rounded-full"></div>
                  )}
                </div>

                {/* Step Content */}
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${isCompleted ? 'text-black' : 'text-gray-500'}`}>
                      {step.label}
                    </h4>
                    {trackingUpdate && (
                      <span className="text-sm text-gray-500">
                        {new Date(trackingUpdate.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>
                  
                  {trackingUpdate && (
                    <p className="text-sm text-gray-600 mt-1">
                      {trackingUpdate.location}
                    </p>
                  )}

                  {isCurrent && index < statusSteps.length - 1 && (
                    <p className="text-sm text-blue-600 mt-1">
                      Currently in progress...
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Estimated Delivery */}
      {order.estimatedDelivery && order.status !== 'delivered' && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center text-blue-800">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium">Estimated Delivery</p>
              <p className="text-sm">
                {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracker;