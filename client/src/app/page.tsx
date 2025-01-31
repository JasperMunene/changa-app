import Categories from '@/components/Categories'
import Featured from '@/components/Featured'
import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Categories />
      <Featured />
      <section className="py-20 bg-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl text-[#E6F5F0] md:text-5xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-[#E6F5F0] text-white/80 mb-12 max-w-2xl mx-auto">
            Join thousands of creators who have successfully funded their projects through Changa
          </p>
          <Button asChild size="lg" className="bg-[#E6F5F0] text-black hover:bg-white/90 text-lg px-8">
            <Link href='/create-campaign'>Start Your Campaign</Link>
          </Button>
        </div>
      </section>


      <footer className="bg-emerald-600 py-16 ">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pt-5">
            <div>
              <p className="text-white text-lg font-semibold tracking-wide">
                Empowering creators and innovators to bring their ideas to life through community support.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-white/60 text-xl tracking-wide uppercase font-bold">About</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-white font-semibold tracking-wide transition-colors">About Us</a></li>
                <li><a href="#" className="text-white font-semibold tracking-wide transition-colors">How It Works</a></li>
                <li><a href="#" className="text-white font-semibold tracking-wide transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white/60 text-xl tracking-wide uppercase font-bold mb-4">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-white font-semibold tracking-wide transition-colors">Help Center</a></li>
                <li><a href="#" className="text-white font-semibold tracking-wide transition-colors">Creator Guidelines</a></li>
                <li><a href="#" className="text-white font-semibold tracking-wide transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white/60 text-xl tracking-wide uppercase font-bold mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-white font-semibold tracking-wide transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-white font-semibold tracking-wide transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-white font-semibold tracking-wide transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <h1 className='text-center text-[3.8rem] md:text-[9rem] lg:text-[11rem] xl:tracking-[0.12em] font-black py-6 my-2 uppercase tracking-widest text-[#E6F5F0]'>Changa</h1>
          <div className="mt-16 pt-8 border-t border-border text-center text-white/70 font-bold">
            <p>&copy; 2024 Changa. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
    </div>
  )
}
