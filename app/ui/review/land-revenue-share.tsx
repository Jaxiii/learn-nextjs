import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/cards';
import { Building2, Coins, TreePine, Users } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const LandRevenueShare = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  // Sample data - replace with actual data
  const revenueDistribution = [
    { name: 'Land Owners', value: 40, color: '#4338ca' },
    { name: 'Platform Fee', value: 15, color: '#0891b2' },
    { name: 'Staking Rewards', value: 25, color: '#059669' },
    { name: 'Community Treasury', value: 20, color: '#7c3aed' },
  ];

  const monthlyRevenue = [
    { month: 'Jan', revenue: 50000, tokens: 25000 },
    { month: 'Feb', revenue: 65000, tokens: 32500 },
    { month: 'Mar', revenue: 55000, tokens: 27500 },
    { month: 'Apr', revenue: 75000, tokens: 37500 },
    { month: 'May', revenue: 85000, tokens: 42500 },
    { month: 'Jun', revenue: 95000, tokens: 47500 },
  ];

  const landTypes = [
    { type: 'Agricultural', value: 45, revenue: 42500 },
    { type: 'Commercial', value: 30, revenue: 35000 },
    { type: 'Residential', value: 15, revenue: 15000 },
    { type: 'Industrial', value: 10, revenue: 12500 },
  ];

  const statsData = [
    {
      title: 'Total Land Value',
      value: '$2.5M',
      icon: Building2,
      change: '+12.5%',
      color: 'text-blue-600'
    },
    {
      title: 'Active Token Holders',
      value: '1,250',
      icon: Users,
      change: '+5.2%',
      color: 'text-purple-600'
    },
    {
      title: 'Monthly Revenue',
      value: '$95K',
      icon: Coins,
      change: '+8.1%',
      color: 'text-green-600'
    },
    {
      title: 'Land Parcels',
      value: '325',
      icon: TreePine,
      change: '+3.4%',
      color: 'text-teal-600'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    label={({ name, value }: { name: string; value: number }) => `${name}: ${value}%`}
                  >
                    {revenueDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenue}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#4338ca" name="Revenue ($)" />
                  <Line type="monotone" dataKey="tokens" stroke="#059669" name="Tokens" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Land Type Distribution & Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={landTypes}>
                <XAxis dataKey="type" />
                <YAxis yAxisId="left" orientation="left" stroke="#4338ca" />
                <YAxis yAxisId="right" orientation="right" stroke="#059669" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="value" name="Distribution (%)" fill="#4338ca" />
                <Bar yAxisId="right" dataKey="revenue" name="Revenue ($)" fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandRevenueShare;