"use client";

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import Link from 'next/link';
import 'swiper/swiper-bundle.css';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

interface Product {
  id: number;
  title: string;
  description: string;
  availabilityStatus: string;
  price: number;
  images: string[];
}

interface ProductDetailProps {
  params: {
    id: string; // Dynamic product ID from the URL
  };
}

const fetchProduct = async (id: string): Promise<Product> => {
  const res = await fetch(`https://dummyjson.com/products/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch product');
  }
  return res.json();
};

const ProductDetail: React.FC<ProductDetailProps> = ({ params }) => {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProduct(params.id);
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [params.id]);

  if (!product) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 md:p-12">
      <div className="w-full">
        <Link href={`/products`} className="inline-block mb-6 text-blue-600 hover:text-blue-800 font-semibold text-lg">
         &larr; Back to list page
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative w-full">
          {product.images.length > 1 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={10}
              slidesPerView={1}
              className="w-full"
            >
              {product.images.map((image:string, index:number) => (
                <SwiperSlide key={index}>
                  <Image
                    src={image} // External URL for the image
                    alt={product.title}
                    width={800} // Specify the width
                    height={600} // Specify the height
                    className="object-cover w-full h-full rounded-lg"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Image
              src={product.images[0]} // External URL for the image
              alt={product.title}
              width={800} // Specify the width
              height={600} // Specify the height
              className="object-cover max-w-[600px] border-2 rounded-lg"
            />
          )}
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{product.description}</p>
            <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-yellow-500 text-white mb-4" >{product.availabilityStatus}</span>
            <p className="text-2xl font-semibold text-gray-900">${product.price}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
