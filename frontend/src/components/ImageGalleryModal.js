import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react';

const ImageGalleryModal = ({ 
  isOpen, 
  onClose, 
  images = [], 
  currentIndex = 0, 
  productName = "" 
}) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  // Reset states when modal opens or image changes
  useEffect(() => {
    if (isOpen) {
      setActiveIndex(currentIndex);
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
      setIsZoomed(false);
      setRotation(0);
    }
  }, [isOpen, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case '+':
        case '=':
          zoomIn();
          break;
        case '-':
          zoomOut();
          break;
        case 'r':
        case 'R':
          rotateImage();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, activeIndex, zoomLevel]);

  const goToPrevious = () => {
    setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    resetImageState();
  };

  const goToNext = () => {
    setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    resetImageState();
  };

  const resetImageState = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    setIsZoomed(false);
    setRotation(0);
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 4));
    setIsZoomed(true);
  };

  const zoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.5, 1);
    setZoomLevel(newZoom);
    if (newZoom === 1) {
      setIsZoomed(false);
      setPosition({ x: 0, y: 0 });
    }
  };

  const rotateImage = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleImageClick = (e) => {
    if (zoomLevel === 1) {
      zoomIn();
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 200;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 200;
      setPosition({ x, y });
    }
  };

  const handleMouseDown = (e) => {
    if (isZoomed) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (isDragging && isZoomed) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, isZoomed, dragStart]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove]);

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = images[activeIndex];
    link.download = `${productName}-${activeIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen || !images.length) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative w-full h-full flex flex-col max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 text-white bg-black bg-opacity-50">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold truncate">
              {productName} - Image {activeIndex + 1} of {images.length}
            </h3>
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={zoomOut}
              disabled={zoomLevel <= 1}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom Out (-)"
            >
              <ZoomOut size={20} />
            </button>
            
            <span className="text-sm px-2 py-1 bg-white bg-opacity-20 rounded">
              {Math.round(zoomLevel * 100)}%
            </span>
            
            <button
              onClick={zoomIn}
              disabled={zoomLevel >= 4}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom In (+)"
            >
              <ZoomIn size={20} />
            </button>
            
            <button
              onClick={rotateImage}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              title="Rotate (R)"
            >
              <RotateCw size={20} />
            </button>
            
            <button
              onClick={downloadImage}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              title="Download"
            >
              <Download size={20} />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              title="Close (Esc)"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main image area */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center">
          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all"
                title="Previous (←)"
              >
                <ChevronLeft size={24} />
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all"
                title="Next (→)"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Main image */}
          <div 
            className="relative max-w-full max-h-full flex items-center justify-center cursor-pointer"
            onClick={handleImageClick}
            onMouseDown={handleMouseDown}
            style={{ cursor: isZoomed ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
          >
            <img
              src={images[activeIndex]}
              alt={`${productName} - View ${activeIndex + 1}`}
              className="max-w-full max-h-full object-contain transition-transform duration-300 select-none"
              style={{
                transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px) rotate(${rotation}deg)`,
                transformOrigin: 'center center'
              }}
              draggable={false}
            />
          </div>
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="bg-black bg-opacity-50 p-4">
            <div className="flex space-x-2 justify-center overflow-x-auto max-w-full">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveIndex(index);
                    resetImageState();
                  }}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === activeIndex 
                      ? 'border-white' 
                      : 'border-transparent hover:border-gray-400'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Loading indicator */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin opacity-0 transition-opacity duration-300" />
      </div>
    </div>
  );
};

export default ImageGalleryModal;