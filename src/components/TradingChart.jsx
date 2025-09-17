import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

const TradingChart = () => {
  const [chartData, setChartData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(45250.00);
  const [priceChange, setPriceChange] = useState(0);

  useEffect(() => {
    // Generate initial chart data
    const generateData = () => {
      const data = [];
      let price = 45000;
      for (let i = 0; i < 50; i++) {
        price += (Math.random() - 0.5) * 500;
        data.push({
          x: i,
          y: Math.max(40000, Math.min(50000, price))
        });
      }
      return data;
    };

    setChartData(generateData());

    // Animate price changes
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 100;
      setCurrentPrice(prev => {
        const newPrice = Math.max(40000, Math.min(50000, prev + change));
        setPriceChange(change);
        return newPrice;
      });

      // Update chart data
      setChartData(prev => {
        const newData = [...prev.slice(1)];
        const lastY = prev[prev.length - 1]?.y || 45000;
        const newY = Math.max(40000, Math.min(50000, lastY + change));
        newData.push({
          x: prev.length,
          y: newY
        });
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const createPath = (data) => {
    if (data.length < 2) return '';
    
    const width = 400;
    const height = 200;
    const minY = Math.min(...data.map(d => d.y));
    const maxY = Math.max(...data.map(d => d.y));
    
    const scaleX = width / (data.length - 1);
    const scaleY = height / (maxY - minY);
    
    let path = `M 0 ${height - (data[0].y - minY) * scaleY}`;
    
    for (let i = 1; i < data.length; i++) {
      const x = i * scaleX;
      const y = height - (data[i].y - minY) * scaleY;
      path += ` L ${x} ${y}`;
    }
    
    return path;
  };

  const createGradientPath = (data) => {
    const path = createPath(data);
    return path + ` L 400 200 L 0 200 Z`;
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Price Display */}
      <div className="mb-6 text-center">
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
        <div className={`flex items-center justify-center text-sm font-medium ${
          priceChange >= 0 ? 'text-green-500' : 'text-red-500'
        }`}>
          <TrendingUp className={`w-4 h-4 mr-1 transform ${
            priceChange < 0 ? 'rotate-180' : ''
          }`} />
          {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} (24h)
        </div>
      </div>

      {/* Chart */}
      <div className="relative bg-white/5 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-200/20 dark:border-gray-700/30">
        <svg
          width="100%"
          height="200"
          viewBox="0 0 400 200"
          className="overflow-visible"
        >
          {/* Grid Lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-gray-300 dark:text-gray-600 opacity-30"
              />
            </pattern>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          <rect width="400" height="200" fill="url(#grid)" />
          
          {/* Chart Area */}
          {chartData.length > 1 && (
            <>
              <path
                d={createGradientPath(chartData)}
                fill="url(#chartGradient)"
                className="animate-pulse"
              />
              <path
                d={createPath(chartData)}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                className="drop-shadow-sm"
              />
            </>
          )}
          
          {/* Animated Dots */}
          {chartData.slice(-5).map((point, index) => {
            const width = 400;
            const height = 200;
            const minY = Math.min(...chartData.map(d => d.y));
            const maxY = Math.max(...chartData.map(d => d.y));
            const scaleX = width / (chartData.length - 1);
            const scaleY = height / (maxY - minY);
            const x = (chartData.length - 5 + index) * scaleX;
            const y = height - (point.y - minY) * scaleY;
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="#3b82f6"
                className="animate-pulse"
                style={{ animationDelay: `${index * 0.2}s` }}
              />
            );
          })}
        </svg>
        
        {/* Chart Labels */}
        <div className="flex justify-between mt-4 text-xs text-gray-500 dark:text-gray-400">
          <span>24h ago</span>
          <span>12h ago</span>
          <span>Now</span>
        </div>
      </div>
    </div>
  );
};

export default TradingChart;