"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Home,
  ChevronRight,
  Users,
  Clock,
  Share2,
  Trash2,
  X,
  Loader2,
  CreditCard,
  Wallet,
  Edit2,
} from "lucide-react";
import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CampaignResponse from "@/types/CampaignResponse";
import Image from "next/image";
import Reward from "@/types/Reward";
import Contribution from "@/types/Contribution";

const paymentMethods = [
  {
    id: "card",
    name: "Credit Card",
    icon: CreditCard,
    description: "Pay with credit or debit card",
  },
  {
    id: "crypto",
    name: "Cryptocurrency",
    icon: Wallet,
    description: "Pay with Bitcoin, Ethereum, or other cryptocurrencies",
  },
];

export default function CampaignDetails() {
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const { id } = useParams();
  const { user } = useUser();
  const router = useRouter();
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [contributionAmount, setContributionAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    paymentMethods[0].id
  );
  const [activeTab, setActiveTab] = useState<
    "story" | "rewards" | "contributions"
  >("story");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [campaign, setCampaign] = useState<CampaignResponse>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCampaign, setEditedCampaign] = useState({
    description: "",
  });

  const currentUser = {
    id: user?.id || "",
    name: user?.username || "",
  };

  const fetchCampaign = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://changa.onrender.com/campaigns/${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch campaign data.");
      const data = await response.json();
      setCampaign(data.campaign);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchCampaign();
  }, [id, fetchCampaign]);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const countTime = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date format");
    }

    const diff = endDate.getTime() - startDate.getTime();

    return Math.round(diff / (1000 * 60 * 60 * 24));
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

  if (error) {
    return (
      <div className="min-h-screen text-xl flex-col gap-5 flex items-center justify-center text-emerald-600">
        {error}
        <Button>
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Campaign not found.
      </div>
    );
  }

  const isOwner = currentUser.id === campaign?.creator?.id;

  const progress = (campaign.current_amount / campaign.goal_amount) * 100;

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault();

    // Handle contribution logic here
    const body = {
      amount: contributionAmount,
      contributor_id: currentUser.id,
      campaign_id: campaign.id,
      payment_method: selectedPaymentMethod,
      status: "completed",
    };

    console.log(body);

    fetch("https://changa.onrender.com/contributions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Contribution success:", data);
        toast.success("Thank you for contributing.");

        fetchCampaign();

        setIsContributeModalOpen(false);
        setContributionAmount("");
        setSelectedPaymentMethod(paymentMethods[0].id);
      })
      .catch((error) => {
        console.error("Error with contribution:", error);
        toast.error("An error occurred while making a contribution.");
      });
  };

  const handleEdit = async () => {
    if (!id || !editedCampaign) return;

    console.log(JSON.stringify(editedCampaign))

    try {
      const response = await fetch(
        `https://changa.onrender.com/campaigns/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedCampaign),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update campaign.");
      }

      toast.success("Campaign updated successfully.");
      setIsEditing(false);
      fetchCampaign(); // Refresh the campaign data
    } catch (error) {
      console.error("Error updating campaign:", error);
      toast.error("An error occurred while updating the campaign.");
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      const response = await fetch(
        `https://changa.onrender.com/campaigns/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Campaign deleted successfully.");
        router.push("/campaigns");
      } else {
        toast.error("Failed to delete the Campaign.");
      }
    } catch (error) {
      console.error("Error deleting Campaign:", error);
      toast.error("An error occurred while deleting the Campaign.");
    }
    setIsDeleteModalOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      toast("Link Copied to clipboard!", {
        description: "You can now paste the link anywhere you like.",
      });
    } catch (error) {
      console.error("Failed to copy the link: ", error);
      toast("Failed to copy the link. Please try again later.", {
        description:
          "Make sure you have clipboard permissions enabled, or try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-emerald-600">
                  Changa
                </span>
              </Link>
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
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                <Home className="w-4 h-4" />
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <li>
              <Link
                href="/campaigns"
                className="text-gray-500 hover:text-gray-700"
              >
                Campaigns
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <li className="text-gray-900 font-medium truncate max-w-[200px]">
              {campaign.title}
            </li>
          </ol>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Campaign Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <Image
                src={campaign.images[0]?.url || ""}
                alt={campaign.title}
                width={640}
                height={640}
                className="w-full h-[400px] object-cover"
              />

              {/* Campaign Header */}
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                      {campaign.category?.name}
                    </span>
                    <h1 className="text-3xl font-bold text-gray-900 mt-4">
                      {campaign.title}
                    </h1>
                  </div>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    onClick={handleCopyLink}
                  >
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="flex items-center mt-4 space-x-4">
                  <Image
                    src={campaign.creator.avatar_url || ""}
                    alt={campaign.title}
                    height={100}
                    width={100}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm text-gray-500">Created by</p>
                    <p className="font-medium text-emerald-600">
                      {campaign?.creator?.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-t border-gray-200">
                <div className="flex">
                  {(["story", "rewards", "contributions"] as const).map(
                    (tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-4 px-6 text-sm font-medium text-center capitalize ${
                          activeTab === tab
                            ? "text-emerald-600 border-b-2 border-emerald-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {tab}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "story" && (
                  <div className="prose max-w-none">
                    {isEditing ? (
                       <textarea
                       className="w-full text-gray-700 leading-relaxed p-2 border border-gray-300 rounded"
                       value={editedCampaign.description}
                       onChange={(e) =>
                         setEditedCampaign((prev) => ({
                           ...prev,
                           description: e.target.value,
                         }))
                       }
                     />
                    ) : (
                      <p className="whitespace-pre-line">
                        {campaign.description}
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "rewards" && (
                  <div className="space-y-6">
                    {campaign?.rewards?.map((reward: Reward) => (
                      <div
                        key={reward.id}
                        className="border-b border-gray-200 last:border-0 pb-6 last:pb-0"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {reward.title}
                          </h3>
                          <span className="text-gray-500">
                            Minimum Contibution: {reward.minimum_contribution}
                          </span>
                        </div>
                        <p className="text-gray-600">{reward.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "contributions" && (
                  <div className="space-y-6">
                    {campaign?.contributions?.map(
                      (contribution: Contribution) => (
                        <div
                          key={contribution.id}
                          className="flex items-start space-x-4 border-b border-gray-200 last:border-0 pb-6 last:pb-0"
                        >
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-emerald-600">
                                  {contribution?.contributor?.name}
                                </p>
                              </div>
                              <span className="font-medium text-emerald-600">
                                {formatMoney(contribution.amount)}
                              </span>
                            </div>
                            {/* {contribution?.message && (
                            <p className="mt-2 text-gray-600">
                              {contribution?.message}
                            </p>
                          )} */}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Campaign Progress */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {formatMoney(campaign.current_amount)}
                </h2>
                <p className="text-gray-500">
                  raised of {formatMoney(campaign.goal_amount)} goal
                </p>

                <div className="mt-4 mb-6">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                      <Users className="w-4 h-4" />
                      <span>Supporters</span>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {campaign?.supporters}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                      <Clock className="w-4 h-4" />
                      <span>Days Left</span>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {countTime(campaign.created_at, campaign.end_date)}
                    </p>
                  </div>
                </div>
              </div>

              {isOwner ? (
                <div className="space-y-3">
                  {isEditing ? (
                    <Button
                      onClick={handleEdit}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                      size="lg"
                    >
                      Save Changes
                    </Button>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Campaign
                      </button>
                      <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="w-full flex items-center justify-center gap-2 bg-red-100 text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Campaign
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsContributeModalOpen(true)}
                  className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  Contribute Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contribute Modal  */}
      <AnimatePresence>
        {isContributeModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-lg max-w-md w-full"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Make a Contribution
                </h2>
                <button
                  onClick={() => setIsContributeModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleContribute} className="p-6 space-y-6">
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Contribution Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <h2 className="h-5 w-5 text-gray-400">KES</h2>
                    </div>
                    <input
                      type="number"
                      id="amount"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="0.00"
                      min="1"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Select Payment Method
                  </label>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <label
                          key={method.id}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedPaymentMethod === method.id
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={selectedPaymentMethod === method.id}
                            onChange={(e) =>
                              setSelectedPaymentMethod(e.target.value)
                            }
                            className="sr-only"
                          />
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={`p-2 rounded-full ${
                                selectedPaymentMethod === method.id
                                  ? "bg-emerald-500 text-white"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {method.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {method.description}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedPaymentMethod === method.id
                                ? "border-emerald-500"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedPaymentMethod === method.id && (
                              <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  onClick={handleContribute}
                >
                  Complete Contribution
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Delete Campaign
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this campaign? This action
                cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
