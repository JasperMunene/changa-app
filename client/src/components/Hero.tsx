'use client'

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import CampaignResponse from "@/types/CampaignResponse";


export default function CampaignShowcase() {
  const [campaigns, setCampaigns] = useState<CampaignResponse[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignResponse | null>(null);
  
  
  useEffect(() => {
      fetch("https://changa.onrender.com/campaigns")
        .then((response) => response.json())
        .then((data) => setCampaigns(data.campaigns))
        .catch((error) => console.error("Error fetching campaigns:", error));
    }, []);


    useEffect(() => {
      if (campaigns.length > 0 && !selectedCampaign) {
        setSelectedCampaign(campaigns[0]);
      }
    }, [campaigns, selectedCampaign]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image with Smooth Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCampaign?.images[0]?.url}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center transform scale-105 transition-transform duration-1000"
            style={{ 
              backgroundImage: `url(${selectedCampaign?.images[0]?.url})`,
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
          key={selectedCampaign?.title}
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
            {selectedCampaign?.category?.name}
          </motion.span>
          <motion.h2
            className="text-5xl font-bold text-white mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {selectedCampaign?.title}
          </motion.h2>
          <motion.p
            className="text-lg text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {selectedCampaign?.tagline}
          </motion.p>
          <motion.a
            href={`https://changa-app.vercel.app/campaigns/${selectedCampaign?.id}`}
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
                ${selectedCampaign?.title === campaign.title ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-black/50' : 'ring-1 ring-white/20'}
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
                  src={campaign?.images[0]?.url} 
                  alt={campaign?.title} 
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300
                  ${selectedCampaign?.title === campaign.title ? 'opacity-0' : 'opacity-100'}
                `} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}