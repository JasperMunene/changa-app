'use client'
import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";

interface CategoryType {
  name: string;
  image_url: string;
}



export default function Categories() {
  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    fetch("https://changa.onrender.com/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data.categories))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Explore Categories</h2>
          <p className="text-muted-foreground text-lg">
            Discover projects that match your interests
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Card
              key={category.name}
              className="group cursor-pointer overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 className="text-2xl font-semibold text-white">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
