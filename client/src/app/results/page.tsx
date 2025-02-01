// app/results/page.tsx
'use client';

import { Suspense } from 'react';
import SearchResults from '@/components/Search';

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchResults />
    </Suspense>
  );
}
