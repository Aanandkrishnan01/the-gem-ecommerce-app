import React, { useEffect, useRef, useState } from 'react';

// Fade In Animation Component
export const FadeIn = ({ 
  children, 
  delay = 0, 
  duration = 600, 
  className = "",
  once = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={elementRef}
      className={`transition-all ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

// Slide In From Direction
export const SlideIn = ({ 
  children, 
  direction = 'left', 
  delay = 0, 
  duration = 600,
  distance = 50,
  className = "",
  once = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef();

  const getTransform = (visible) => {
    if (visible) return 'translate3d(0, 0, 0)';
    
    switch (direction) {
      case 'left': return `translate3d(-${distance}px, 0, 0)`;
      case 'right': return `translate3d(${distance}px, 0, 0)`;
      case 'up': return `translate3d(0, -${distance}px, 0)`;
      case 'down': return `translate3d(0, ${distance}px, 0)`;
      default: return `translate3d(-${distance}px, 0, 0)`;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={elementRef}
      className={`transition-all ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(isVisible),
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

// Scale In Animation
export const ScaleIn = ({ 
  children, 
  delay = 0, 
  duration = 400,
  scale = 0.9,
  className = "",
  once = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={elementRef}
      className={`transition-all ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : `scale(${scale})`,
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

// Stagger Children Animation
export const StaggerContainer = ({ 
  children, 
  staggerDelay = 100, 
  className = "" 
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          delay: index * staggerDelay
        })
      )}
    </div>
  );
};

// Hover Scale Effect
export const HoverScale = ({ 
  children, 
  scale = 1.05, 
  duration = 200,
  className = "" 
}) => {
  return (
    <div
      className={`transition-transform ease-out cursor-pointer ${className}`}
      style={{
        transitionDuration: `${duration}ms`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `scale(${scale})`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {children}
    </div>
  );
};

// Bounce In Animation
export const BounceIn = ({ 
  children, 
  delay = 0, 
  className = "",
  once = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={elementRef}
      className={`${className} ${
        isVisible ? 'animate-bounce-in' : 'opacity-0 scale-75'
      }`}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'both'
      }}
    >
      {children}
    </div>
  );
};

// Floating Animation
export const Float = ({ 
  children, 
  amplitude = 10, 
  duration = 3000,
  className = "" 
}) => {
  return (
    <div
      className={`${className}`}
      style={{
        animation: `float ${duration}ms ease-in-out infinite`,
        '--amplitude': `${amplitude}px`
      }}
    >
      {children}
    </div>
  );
};

// Typewriter Effect
export const Typewriter = ({ 
  text, 
  speed = 100, 
  delay = 0,
  className = "",
  onComplete = () => {} 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      } else {
        onComplete();
      }
    }, currentIndex === 0 ? delay : speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, delay, onComplete]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// Parallax Scroll Effect
export const ParallaxScroll = ({ 
  children, 
  speed = 0.5, 
  className = "" 
}) => {
  const [offset, setOffset] = useState(0);
  const elementRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const rate = scrolled * speed;
        setOffset(rate);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        transform: `translateY(${offset}px)`
      }}
    >
      {children}
    </div>
  );
};

// Progress Bar Animation
export const ProgressBar = ({ 
  progress, 
  height = 4, 
  color = 'bg-blue-500',
  backgroundColor = 'bg-gray-200',
  animated = true,
  className = "" 
}) => {
  return (
    <div 
      className={`w-full ${backgroundColor} rounded-full overflow-hidden ${className}`}
      style={{ height: `${height}px` }}
    >
      <div
        className={`h-full ${color} transition-all duration-500 ease-out ${
          animated ? 'bg-gradient-to-r from-current via-current to-current bg-[length:200%_100%] animate-shimmerEffect' : ''
        }`}
        style={{ 
          width: `${Math.min(Math.max(progress, 0), 100)}%`,
        }}
      />
    </div>
  );
};

// Ripple Effect Button
export const RippleButton = ({ 
  children, 
  onClick, 
  className = "",
  rippleColor = 'rgba(255, 255, 255, 0.5)',
  ...props 
}) => {
  const [ripples, setRipples] = useState([]);

  const addRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const newRipple = {
      x,
      y,
      size,
      id: Date.now()
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    if (onClick) onClick(event);
  };

  return (
    <button
      className={`relative overflow-hidden ${className}`}
      onClick={addRipple}
      {...props}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full animate-ping pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: rippleColor,
            animationDuration: '600ms'
          }}
        />
      ))}
    </button>
  );
};

export default {
  FadeIn,
  SlideIn,
  ScaleIn,
  StaggerContainer,
  HoverScale,
  BounceIn,
  Float,
  Typewriter,
  ParallaxScroll,
  ProgressBar,
  RippleButton
};