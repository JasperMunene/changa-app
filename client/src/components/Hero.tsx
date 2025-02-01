'use client'

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

const campaigns = [
  {
    title: "Save the Rainforest",
    description: "Join our mission to protect and preserve the Amazon rainforest for future generations.",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80",
    thumbnail: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=200&h=150",
    link: "#",
    category: "Environment"
  },
  {
    title: "Clean Ocean Initiative",
    description: "Help us remove plastic waste from our oceans and protect marine life.",
    image: "https://images.unsplash.com/photo-1498855926480-d98e83099315?auto=format&fit=crop&q=80",
    thumbnail: "https://images.unsplash.com/photo-1498855926480-d98e83099315?auto=format&fit=crop&q=80&w=200&h=150",
    link: "#",
    category: "Ocean"
  },
  {
    title: "Wildlife Protection",
    description: "Support our efforts to protect endangered species and their habitats.",
    image: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&q=80",
    thumbnail: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&q=80&w=200&h=150",
    link: "#",
    category: "Wildlife"
  }
];

export default function CampaignShowcase() {
  const [selectedCampaign, setSelectedCampaign] = useState(campaigns[0]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image with Smooth Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCampaign.image}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center transform scale-105 transition-transform duration-1000"
            style={{ 
              backgroundImage: `url(${selectedCampaign.image})`,
              filter: 'brightness(0.8)',
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-24">
        {/* Campaign Info */}
        <motion.div
          key={selectedCampaign.title}
          className="max-w-2xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.span
            className="inline-block px-3 py-1 mb-4 text-sm font-medium text-emerald-400 bg-emerald-900/30 rounded-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {selectedCampaign.category}
          </motion.span>
          <motion.h2
            className="text-5xl font-bold text-white mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {selectedCampaign.title}
          </motion.h2>
          <motion.p
            className="text-lg text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {selectedCampaign.description}
          </motion.p>
          <motion.a
            href={selectedCampaign.link}
            className="group inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 transform hover:translate-x-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Join Campaign
            <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.a>
        </motion.div>

        {/* Campaign Thumbnails */}
        <div className="flex gap-4">
          {campaigns.map((campaign, index) => (
            <motion.div
              key={campaign.title}
              className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300
                ${selectedCampaign.title === campaign.title ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-black/50' : 'ring-1 ring-white/20'}
              `}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              onMouseEnter={() => {
                setSelectedCampaign(campaign);
              }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative w-40 h-24">
                <Image 
                  src={campaign.thumbnail} 
                  alt={campaign.title} 
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300
                  ${selectedCampaign.title === campaign.title ? 'opacity-0' : 'opacity-100'}
                `} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}