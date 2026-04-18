import React from 'react';
import Card from './Card';

const StatCard = ({ icon: Icon, title, value, trend, trendType = 'positive' }) => {
  const trendColor = trendType === 'positive' ? 'text-green-600' : 'text-red-600';

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {trend !== undefined && (
            <p className={`text-sm mt-2 ${trendColor}`}>
              {trendType === 'positive' ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-4 text-white">
          <Icon size={32} />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;