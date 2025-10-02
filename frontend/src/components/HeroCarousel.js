import React from 'react';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/Carousel';

const HeroCarousel = () => {
  // Slide data with images and content
  const slides = [
    {
      id: 1,
      image: '/images/slides/1759332424962.png',
      title: "New Collection",
      subtitle: "Discover the latest trends",
      description: "Explore our newest arrivals and find your perfect style",
      buttonText: "Shop Now",
      link: "/products?filter=new"
    },
    {
      id: 2,
      image: '/images/slides/1759332476120.png',
      title: "Summer Sale",
      subtitle: "Up to 50% off",
      description: "Don't miss our biggest sale of the season",
      buttonText: "View Sale",
      link: "/products?filter=sale"
    },
    {
      id: 3,
      image: '/images/slides/1759332552058.png',
      title: "Premium Quality",
      subtitle: "Crafted with care",
      description: "Experience the finest materials and expert craftsmanship",
      buttonText: "Learn More",
      link: "/products"
    },
    {
      id: 4,
      image: '/images/slides/1759332564065.png',
      title: "Trending Now",
      subtitle: "What's popular",
      description: "See what everyone is talking about this season",
      buttonText: "Explore",
      link: "/products?filter=trending"
    },
    {
      id: 5,
      image: '/images/slides/1759332673796.png',
      title: "Free Shipping",
      subtitle: "On orders over $50",
      description: "Fast, reliable delivery to your doorstep",
      buttonText: "Start Shopping",
      link: "/products"
    }
  ];

  return (
    <section className="relative w-full">
      <Carousel
        autoplay={true}
        autoplayDelay={5000}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback */}
                  <div className="hidden w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 items-center justify-center">
                    <div className="text-center text-gray-500">
                      <p className="text-2xl font-bold">{slide.title}</p>
                      <p className="text-lg">{slide.subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 leading-tight">
                      {slide.title}
                    </h1>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-light mb-6 opacity-90">
                      {slide.subtitle}
                    </h2>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-80">
                      {slide.description}
                    </p>
                    <Link
                      to={slide.link}
                      className="inline-block bg-white text-black px-8 py-4 text-lg font-semibold hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105"
                    >
                      {slide.buttonText}
                    </Link>
                  </div>
                </div>

                {/* Slide Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="text-white text-sm font-medium">
                      {slide.id} / {slides.length}
                    </span>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation Arrows */}
        <CarouselPrevious className="left-4 md:left-8 bg-white bg-opacity-20 backdrop-blur-sm border-white border-opacity-30 text-white hover:bg-white hover:text-black transition-all duration-300" />
        <CarouselNext className="right-4 md:right-8 bg-white bg-opacity-20 backdrop-blur-sm border-white border-opacity-30 text-white hover:bg-white hover:text-black transition-all duration-300" />
      </Carousel>

      {/* Scroll down indicator */}
      <div className="absolute bottom-8 right-8 hidden md:block">
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;