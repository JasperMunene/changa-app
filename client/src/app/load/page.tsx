'use client';

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function Loading() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make the fetch request to save user data
        const response = await fetch('/api/webhook', { method: 'POST' });

        if (response.ok) {
          // Redirect to '/' when the request succeeds
          router.push('/');
        } else {
          console.error("Failed to save user:", await response.text());
          // Handle failure (optional)
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Set loading to false once the process is done
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="text-center">
        {isLoading ? (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mb-4 mx-auto" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">Loading</h2>
            <p className="text-muted-foreground">Please wait while we prepare your content...</p>
          </>
        ) : (
          <p>Redirecting...</p> 
        )}
      </div>
    </div>
  );
}
