import { lusitana } from '@/app/ui/fonts';
import LandRevenueShare from '@/app/ui/review/land-revenue-share';
import { CardsSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next';
import { Suspense } from 'react';

 
export const metadata: Metadata = {
  title: 'Review',
};

export default async function Page() {
  


  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Review
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Suspense fallback={<CardsSkeleton />}>
        <LandRevenueShare />
      </Suspense>
      </div>
      
    </main>
  );
}

