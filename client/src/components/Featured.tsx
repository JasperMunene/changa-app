'use client'

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";


export default function PopularCampaigns() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://changa.onrender.com/campaigns")
      .then((response) => response.json())
      .then((data) => setCampaigns(data.campaigns))
      .catch((error) => console.error("Error fetching campaigns:", error));
  }, []);


  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 400;
    const container = scrollContainerRef.current;
    const newScrollPosition = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    container.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });

    // Update scroll buttons state after animation
    setTimeout(() => {
      if (!scrollContainerRef.current) return;
      setCanScrollLeft(scrollContainerRef.current.scrollLeft > 0);
      setCanScrollRight(
        scrollContainerRef.current.scrollLeft < 
        scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth
      );
    }, 300);
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Popular Campaigns</h2>
            <p className="mt-2 text-gray-600">Support these trending initiatives making a difference</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full border ${
                canScrollLeft 
                  ? 'border-gray-300 hover:border-gray-400 bg-white text-gray-700 hover:bg-gray-50' 
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
              } transition-colors duration-200`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-full border ${
                canScrollRight 
                  ? 'border-gray-300 hover:border-gray-400 bg-white text-gray-700 hover:bg-gray-50' 
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
              } transition-colors duration-200`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
           {campaigns.map((campaign) => {
            const {
              id,
              title,
              tagline,
              images,
              goal_amount,
              current_amount,
              supporters,
              end_date,
            } = campaign;

            const daysLeft = Math.max(
              Math.ceil(
                (new Date(end_date).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              ),
              0
            );

            const progress = (current_amount / goal_amount) * 100;


            
            
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="flex-shrink-0 w-[350px] bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative h-48 rounded-t-xl overflow-hidden">
                  <img 
                     src={images[0]?.url} 
                     alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {tagline}
                  </p>
                  
                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-900">
                      {formatMoney(current_amount)} raised
                      </span>
                      <span className="text-gray-500">
                        of {formatMoney(goal_amount)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{supporters} supporters</span>
                    </div>
                    <span>{daysLeft} days left</span>
                  </div>

                  <Button asChild className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200">
                    <Link href={`/campaigns/${id}`}>Support Campaign</Link>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}