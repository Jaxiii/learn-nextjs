'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/ui/cards';
import { Button } from '@/app/ui/button';
import { Metadata } from 'next';

// Define the type for a parcel
interface Parcel {
  id: number;
  revenue: number;
  investors: number;
  type: 'Agricultural' | 'Commercial' | 'Residential' | 'Industrial';
  totalValue: number;
  lastTransaction: string;
}

const LandGridVisualization: React.FC = () => {
  const [viewMode, setViewMode] = useState<'revenue' | 'investors'>('revenue');
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);

  const gridData: Parcel[] = Array(100)
    .fill(null)
    .map((_, index) => ({
      id: index,
      revenue: Math.random() * 10000,
      investors: Math.floor(Math.random() * 50) + 1,
      type: ['Agricultural', 'Commercial', 'Residential', 'Industrial'][
        Math.floor(Math.random() * 4)
      ] as Parcel['type'],
      totalValue: Math.random() * 100000,
      lastTransaction: new Date(
        Date.now() - Math.random() * 10000000000
      ).toLocaleDateString(),
    }));

  const getRevenueColor = (revenue: number): string => {
    const maxRevenue = Math.max(...gridData.map((d) => d.revenue));
    return `rgb(${67}, ${56}, ${202}, ${0.2 + (revenue / maxRevenue) * 0.8})`;
  };

  const getInvestorColor = (investors: number): string => {
    const maxInvestors = Math.max(...gridData.map((d) => d.investors));
    return `rgb(${5}, ${150}, ${105}, ${0.2 + (investors / maxInvestors) * 0.8})`;
  };

  const getLegendGradient = (type: 'revenue' | 'investors') => {
    if (type === 'revenue') {
      return {
        background: 'linear-gradient(to right, rgba(67, 56, 202, 0.2), rgba(67, 56, 202, 1))',
      };
    }
    return {
      background: 'linear-gradient(to right, rgba(5, 150, 105, 0.2), rgba(5, 150, 105, 1))',
    };
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Land Parcels Visualization</CardTitle>
            <div className="flex space-x-2">
              <Button
                onClick={() => setViewMode('revenue')}
                className="px-4"
              >
                Revenue Share
              </Button>
              <Button
                onClick={() => setViewMode('investors')}
                className="px-4"
              >
                Investor Density
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm">Low</span>
              <div
                className="h-4 w-40 rounded"
                style={getLegendGradient(viewMode)}
              />
              <span className="text-sm">High</span>
              <span className="text-sm ml-4">
                {viewMode === 'revenue' ? '(Revenue Share)' : '(Investor Count)'}
              </span>
            </div>
            <div className="grid grid-cols-10 gap-2">
              {gridData.map((parcel) => (
                <div
                  key={`parcel-${parcel.id}`} // Ensure the key is unique
                  className="relative aspect-square rounded cursor-pointer hover:ring-2 hover:ring-gray-400 transition-all"
                  style={{
                    backgroundColor:
                      viewMode === 'revenue'
                        ? getRevenueColor(parcel.revenue)
                        : getInvestorColor(parcel.investors),
                  }}
                  onClick={() => setSelectedParcel(parcel)}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                    {viewMode === 'revenue'
                      ? `$${Math.round(parcel.revenue)}`
                      : parcel.investors}
                  </div>
                </div>
              ))}
            </div>
            {selectedParcel && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Parcel #{selectedParcel.id + 1}</h3>
                  <Button
                
                    onClick={() => setSelectedParcel(null)}
                  >
                    Close
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium">{selectedParcel.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Value</p>
                    <p className="font-medium">
                      ${Math.round(selectedParcel.totalValue).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Monthly Revenue</p>
                    <p className="font-medium">
                      ${Math.round(selectedParcel.revenue).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Investors</p>
                    <p className="font-medium">{selectedParcel.investors}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Transaction</p>
                    <p className="font-medium">{selectedParcel.lastTransaction}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandGridVisualization;