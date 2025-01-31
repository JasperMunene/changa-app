'use client'

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Calendar, DollarSign, AlertCircle,  ChevronRight, Home, Loader2 } from "lucide-react";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { toast } from 'sonner';
import { useRouter } from "next/navigation";


export default function CreateCampaign() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tagline: '',
    category: '',
    goal: '',
    endDate: '',
    image: null as File | null,
    imagePreview: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [categories, setCategories] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
      fetch("http://127.0.0.1:5000/categories")
        .then((response) => response.json())
        .then((data) => setCategories(data.categories))
        .catch((error) => console.error("Error fetching categories:", error));
    }, []);

    

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
      setErrors({ ...errors, image: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.tagline.trim()) {
      newErrors.tagline = 'Tagline is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.goal || isNaN(Number(formData.goal)) || Number(formData.goal) <= 0) {
      newErrors.goal = 'Please enter a valid goal amount';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else {
      const selectedDate = new Date(formData.endDate);
      const today = new Date();
      if (selectedDate <= today) {
        newErrors.endDate = 'End date must be in the future';
      }
    }
    if (!formData.image) {
      newErrors.image = 'Campaign image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadStagedFile = async (stagedFile: File | Blob): Promise<string> => {
    const form = new FormData();
    form.append("file", stagedFile);
  
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
  
      if (!res.ok) {
        throw new Error("Failed to upload file.");
      }
  
      const data = await res.json();
      return data.imgUrl; // URL of the uploaded image from the server response
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  
  try {
    let imageUrl = '';
    if (formData.image) {
      imageUrl = await uploadStagedFile(formData.image);
    }

    // Step 2: Prepare the payload
    const payload = {
      title: formData.title,
      tagline: formData.tagline,
      description: formData.description,
      creator_id: user?.id,
      category_id: Number(formData.category),
      goal_amount: Number(formData.goal),
      end_date: formData.endDate,
      images: [imageUrl], 
    };

    console.log('dattt:', payload)

   
    const response = await fetch('http://127.0.0.1:5000/campaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to create campaign. Please try again.');
    }
    
    const result = await response.json();
    console.log('Campaign created successfully:', result);

    toast.success('Campaign created successfully!');
    router.push('/campaigns'); 
  } catch (error) {
    console.error('Error creating campaign:', error);
    toast.error('An error occurred while creating the campaign. Please try again.');
  }
};

if (loading) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mb-4 mx-auto" />
      </div>
    </div>
  );
}

  

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
            <li>
              <a href="/campaigns" className="text-gray-500 hover:text-gray-700">
                Campaigns
              </a>
            </li>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <li className="text-gray-900 font-medium">Create Campaign</li>
          </ol>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-8"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create a Campaign</h1>
            <p className="mt-2 text-gray-600">
              Share your cause with the world and start making a difference today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Campaign Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Image
              </label>
              <div 
                className={`relative border-2 border-dashed rounded-lg p-6 
                  ${formData.imagePreview ? 'border-emerald-300 bg-emerald-50' : 'border-gray-300 bg-gray-50'}
                  ${errors.image ? 'border-red-300 bg-red-50' : ''}
                  transition-colors duration-200`}
              >
                {formData.imagePreview ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <img
                      src={formData.imagePreview}
                      alt="Campaign preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: null, imagePreview: '' })}
                      className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full hover:bg-white transition-colors"
                    >
                      <span className="sr-only">Remove image</span>
                      <AlertCircle className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="image-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-emerald-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-2 hover:text-emerald-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="image-upload"
                          name="image-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
                {errors.image && (
                  <p className="mt-2 text-sm text-red-600">{errors.image}</p>
                )}
              </div>
            </div>

            {/* Campaign Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  setErrors({ ...errors, title: '' });
                }}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                } focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors`}
                placeholder="Give your campaign a clear, attention-grabbing title"
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

             {/* Campaign Tagline */}
             <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Tagline
              </label>
              <input
                type="text"
                id="tagline"
                value={formData.tagline}
                onChange={(e) => {
                  setFormData({ ...formData, tagline: e.target.value });
                  setErrors({ ...errors, tagline: '' });
                }}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.tagline ? 'border-red-300' : 'border-gray-300'
                } focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors`}
                placeholder="Give your campaign a catchy tagline"
              />
              {errors.tagline && (
                <p className="mt-2 text-sm text-red-600">{errors.tagline}</p>
              )}
            </div>

            {/* Campaign Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  setErrors({ ...errors, description: '' });
                }}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                } focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors`}
                placeholder="Describe your campaign and why it matters..."
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Category and Goal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Selection */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={(e) => {
                    setFormData({ ...formData, category: e.target.value });
                    setErrors({ ...errors, category: '' });
                  }}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  } focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category: { id: number; name: string }) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-2 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              {/* Funding Goal */}
              <div>
                <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
                  Funding Goal
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="goal"
                    value={formData.goal}
                    onChange={(e) => {
                      setFormData({ ...formData, goal: e.target.value });
                      setErrors({ ...errors, goal: '' });
                    }}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      errors.goal ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.goal && (
                  <p className="mt-2 text-sm text-red-600">{errors.goal}</p>
                )}
              </div>
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                Campaign End Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="endDate"
                  value={formData.endDate}
                  onChange={(e) => {
                    setFormData({ ...formData, endDate: e.target.value });
                    setErrors({ ...errors, endDate: '' });
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    errors.endDate ? 'border-red-300' : 'border-gray-300'
                  } focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors`}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              {errors.endDate && (
                <p className="mt-2 text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <motion.button
                type="submit"
                className="w-full bg-emerald-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Create Campaign
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}