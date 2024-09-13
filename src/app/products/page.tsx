"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CategoryFilter from '../../components/CategoryFilter';

// Define the structure of a Product
interface Product {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
}

// Define the structure of a ProductList
interface ProductList {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Fetching product data from the API using a server-side function
const fetchProducts = async (categoryId?: string | null, sortBy?: string | '', currentPage?: number, pageSize?: number, skipSize?: number): Promise<ProductList> => {
  let urlFetch = 'https://dummyjson.com/products';
  if (categoryId) {
    urlFetch = `https://dummyjson.com/products/category/${categoryId}` 
  }
  urlFetch += `?limit=${pageSize}&skip=${skipSize}`
  if (sortBy) {
    urlFetch += `&sortBy=price&order=${sortBy}`
  }
  const res = await fetch(urlFetch);

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  const listProducts: ProductList = await res.json();
  return listProducts;
};

const Products: React.FC = () => {
  const [listProducts, setListProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string | ''>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = 10; // Number of products per page
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const skipSize = (currentPage * pageSize) - pageSize; // Number of products per page
        const data = await fetchProducts(selectedCategory, sortOrder, currentPage, pageSize, skipSize);
        setListProducts(data.products || []);
        setTotalPages((Math.ceil(data.total / pageSize)) || 0);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [selectedCategory, sortOrder, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Product List</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Category Filter */}
        <CategoryFilter onCategoryChange={(categoryId) => setSelectedCategory(categoryId)} onSortChange={(sortValue) => setSortOrder(sortValue || '')} sortOrderValue={sortOrder} />

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listProducts ? listProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} passHref className="bg-white shadow-lg rounded-lg hover:shadow-xl transition hover:cursor-pointer">
              <div>
                <div className="border-b-2 border-gray-100">
                  <Image
                    src={product.thumbnail} // External URL for the image
                    alt={product.title}
                    width={400} // Set a desired width
                    height={300} // Set a desired height
                    className="rounded-t-lg object-cover bg-slate-100"
                  />
                </div>
                <div className="p-8">
                  <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
                  <p className="text-gray-700 mb-4 overflow-hidden text-ellipsis break-all line-clamp-4">{product.description}</p>
                  <p className="text-lg font-bold text-gray-900">${product.price}</p>
                </div>
              </div>
            </Link>
          )) : <p>There is no product</p>}
        </div>
        {/* Pagination Controls */}
        {listProducts.length && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
            >
              Previous
            </button>
            <span className="text-lg font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Products;
