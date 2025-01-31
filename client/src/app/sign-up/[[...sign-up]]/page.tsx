"use client";

import { SignIn } from '@clerk/nextjs';
import { Card } from "@/components/ui/card";

export default function Page() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100 p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      
      {/* Floating shapes for visual interest */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-red-50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-50 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

      {/* Header/Logo */}
      <div className="absolute top-8 left-8 flex items-center space-x-2">
        <span className="text-3xl font-bold text-red-600">Changa</span>
      </div>

      {/* Main Content */}
      <Card className="max-w-md w-full p-8 shadow-xl bg-white/95 backdrop-blur-sm hidden lg:block">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter text-gray-900">
            Create Your Account
            </h1>
            <p className="text-gray-500">
            Sign up to get started with Changa
            </p>
          </div>

           <SignIn />
        </div>
      </Card>

      <div className='mt-20 lg:hidden'>
      <SignIn />
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-gray-500">
        By signing up, you agree to our{" "}
        <a href="#" className="font-medium text-red-600 hover:text-red-500">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="font-medium text-red-600 hover:text-red-500">
          Privacy Policy
        </a>
      </p>
    </section>
  );
}