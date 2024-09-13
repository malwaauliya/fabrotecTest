"use client";

import React, { useState, useEffect } from 'react';

interface Category {
  slug: string;
  name: string;
}

interface CategoryFilterProps {
  onCategoryChange: (categoryId: string | null) => void;
  onSortChange: (sortValue: string | null) => void;
  sortOrderValue: string | ''
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ onCategoryChange, onSortChange, sortOrderValue }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://dummyjson.com/products/categories');
        if (!res.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    onCategoryChange(categoryId);
  };

  return (
    <div>
        {/* Sorting Options */}
        <div className="mb-6">
        <label htmlFor="sort" className="text-lg font-semibold mb-2 block">Sort by Price:</label>
        <select
            id="sort"
            className="bg-white border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {onSortChange(e.target.value as 'asc' | 'desc')}}
            value={sortOrderValue}
        >
            <option value="" disabled selected>Select sorting order</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
        </select>
        </div>
        <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Filter by Category</h2>
        <ul className="space-y-2">
            <li>
            <button
                className={`block px-4 py-2 w-full text-left rounded-lg ${selectedCategory === null ? 'bg-gray-200 text-gray-900' : 'hover:bg-gray-100'}`}
                onClick={() => handleCategoryChange(null)}
            >
                All Categories
            </button>
            </li>
            {categories.map((category, index) => (
            <li key={index}>
                <button
                className={`block px-4 py-2 w-full text-left rounded-lg ${selectedCategory === category.slug ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                onClick={() => handleCategoryChange(category.slug)}
                >
                {category.name}
                </button>
            </li>
            ))}
        </ul>
        </div>
    </div>
  );
};

export default CategoryFilter;
