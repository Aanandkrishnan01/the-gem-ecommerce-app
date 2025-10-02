import React from 'react';

// Product Card Skeleton
export const ProductSkeleton = () => {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-square bg-gray-200 dark:bg-gray-700 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white dark:via-gray-600 to-transparent shimmer-effect"></div>
      </div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="flex justify-between items-center">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

// Product Grid Skeleton
export const ProductGridSkeleton = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
};

// Hero Section Skeleton
export const HeroSkeleton = () => {
  return (
    <div className="w-full h-96 md:h-[500px] bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white dark:via-gray-600 to-transparent shimmer-effect"></div>
      <div className="absolute bottom-8 left-8 space-y-4">
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-64"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
        <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
      </div>
    </div>
  );
};

// Category Card Skeleton
export const CategorySkeleton = () => {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white dark:via-gray-600 to-transparent shimmer-effect"></div>
      </div>
      <div className="p-4">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto"></div>
      </div>
    </div>
  );
};

// Text Block Skeleton
export const TextSkeleton = ({ lines = 3, className = "" }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        ></div>
      ))}
    </div>
  );
};

// Button Skeleton
export const ButtonSkeleton = ({ className = "" }) => {
  return (
    <div className={`h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`}></div>
  );
};

// Cart Item Skeleton
export const CartItemSkeleton = () => {
  return (
    <div className="flex items-center space-x-4 p-4 border-b border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
      </div>
    </div>
  );
};

// Profile Section Skeleton
export const ProfileSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm animate-pulse">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
  );
};

// Loading Overlay
export const LoadingOverlay = ({ isVisible, message = "Loading..." }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg text-center max-w-sm mx-4">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-700 dark:text-gray-300 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default {
  ProductSkeleton,
  ProductGridSkeleton,
  HeroSkeleton,
  CategorySkeleton,
  TextSkeleton,
  ButtonSkeleton,
  CartItemSkeleton,
  ProfileSkeleton,
  LoadingOverlay
};