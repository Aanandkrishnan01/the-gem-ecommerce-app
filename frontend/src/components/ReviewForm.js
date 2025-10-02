import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../context/ReviewsContext';
import StarRating from './StarRating';
import Toast from './Toast';

const ReviewForm = ({ productId, onReviewAdded }) => {
  const { user, isAuthenticated } = useAuth();
  const { addReview } = useReviews();
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setToast({
        message: 'Please log in to write a review.',
        type: 'error'
      });
      return;
    }

    if (formData.rating === 0) {
      setToast({
        message: 'Please select a rating.',
        type: 'error'
      });
      return;
    }

    if (!formData.comment.trim()) {
      setToast({
        message: 'Please write a comment.',
        type: 'error'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const review = {
        productId: productId.toString(),
        userId: user.id || 'anonymous',
        userName: user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}` 
          : user.email?.split('@')[0] || 'Anonymous User',
        rating: formData.rating,
        title: formData.title.trim(),
        comment: formData.comment.trim(),
        verified: true // In real app, check if user actually purchased the product
      };

      addReview(review);

      setToast({
        message: 'Review submitted successfully!',
        type: 'success'
      });

      // Reset form
      setFormData({
        rating: 0,
        title: '',
        comment: ''
      });

      if (onReviewAdded) {
        onReviewAdded();
      }

    } catch (error) {
      setToast({
        message: 'Failed to submit review. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-black mb-2">Write a Review</h3>
        <p className="text-gray-600 mb-4">Please log in to write a review for this product.</p>
        <a href="/auth" className="btn-primary inline-block">
          Log In
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-medium text-black mb-4">Write a Review</h3>
      
      <form onSubmit={handleSubmit}>
        {/* Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <StarRating
            rating={formData.rating}
            onRatingChange={handleRatingChange}
            interactive={true}
            size="large"
          />
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Title (Optional)
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Summarize your experience..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            maxLength={100}
          />
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            placeholder="Tell others about your experience with this product..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            rows={4}
            maxLength={500}
            required
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {formData.comment.length}/500
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`btn-primary w-full ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>

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

export default ReviewForm;