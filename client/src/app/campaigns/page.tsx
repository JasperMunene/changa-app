'use client'

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, User, Home, ChevronRight, Filter, Users } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";

// Sample data - replace with actual data from your backend




export default function Campaigns() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("newest");

  const [categories, setCategories] = useState<any[]>([]);

  const [campaigns, setCampaigns] = useState<any[]>([]);
  

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || campaign.category.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "mostFunded":
        return b.current_amount - a.current_amount;
      case "endingSoon":
        return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
      case "trending":
        return (b.supporters || 0) - (a.supporters || 0);
      default:
        return 0;
    }
  });
  


  
  const countTime = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
  
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date format");
    }
  
    const diff = endDate.getTime() - startDate.getTime();
  
    return Math.round(diff / (1000 * 60 * 60 * 24));
  };



  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  useEffect(() => {
    fetch("http://127.0.0.1:5000/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data.categories))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/campaigns")
      .then((response) => response.json())
      .then((data) => setCampaigns(data.campaigns))
      .catch((error) => console.error("Error fetching campaigns:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <span className="text-2xl font-bold text-emerald-600">Changa</span>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/create-campaign" 
                className="bg-emerald-600 text-white px-2 md:px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Create Campaign
              </a>
              <SignedIn>
              <UserButton />
            </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <a href="/" className="text-gray-500 hover:text-gray-700">
                <Home className="w-4 h-4" />
              </a>
            </li>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <li className="text-gray-900 font-medium">Campaigns</li>
          </ol>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Discover Campaigns</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.name
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="mostFunded">Most Funded</option>
              <option value="endingSoon">Ending Soon</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCampaigns.map((campaign, index) => {
            const {
              id,
              title,
              tagline,
              images,
              goal_amount,
              current_amount,
              supporters,
              end_date,
              category,
              created_at
            } = campaign;
            
            const progress = (current_amount / goal_amount) * 100;
            
            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative h-48 rounded-t-xl overflow-hidden">
                  <img 
                    src={images[0]?.url} 
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                 <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-white/90 rounded-full text-sm font-medium text-gray-700">
                      {category.name}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
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

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{supporters.toLocaleString()} supporters</span>
                    </div>
                    <span>{countTime(created_at, end_date)} days left</span>
                  </div>

                  <a
                    href={`/campaigns/${campaign.id}`}
                    className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
                    View Campaign
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500"
            >
              <Filter className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No campaigns found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}