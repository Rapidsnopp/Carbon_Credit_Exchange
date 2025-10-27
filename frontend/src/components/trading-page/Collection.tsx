import React, { useState, useEffect } from 'react';

import { MOCK_COLLECTION_DATA } from '../../data/mocks';
import { CollectionItem } from '../../types/collection.types';
import { fetchMarketplaceListings } from '../../lib/marketplaceApi';

// Import component con 
import { CollectionCard } from './CollectionCard'; 

export const Collection = () => {
  // BƯỚC 1: Khởi tạo state BẰNG DỮ LIỆU MOCK 
  const [items, setItems] = useState<CollectionItem[]>(MOCK_COLLECTION_DATA);
  const [isLoading, setIsLoading] = useState(true);

  // BƯỚC 2: Fetch dữ liệu thật
  useEffect(() => {
    const loadData = async () => {
      try {
        // Gọi hàm API đã tách riêng
        const realData = await fetchMarketplaceListings();
        
        // BƯỚC 3: Cập nhật state nếu thành công
        setItems(realData);

      } catch (error: any) {
        // Nếu API lỗi (hoặc không có data), KHÔNG LÀM GÌ CẢ.
        console.warn('Failed to fetch real data, using mock data:', error.message);
      } finally {
        setIsLoading(false); // Luôn set loading = false
      }
    };

    loadData();
  }, []); // `[]` = chỉ chạy 1 lần khi component mount

  // BƯỚC 4: Logic Render 
  if (isLoading) {
    return (
      <div className="collection-grid">
        {MOCK_COLLECTION_DATA.map(item => (
          <div key={item.mint} className="skeleton-card bg-gray-800/40 rounded-2xl h-96 animate-pulse">
          </div>
        ))}
      </div>
    );
  }

  // `items` sẽ là data thật (nếu có) hoặc data mock (nếu thất bại)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(item => (
        <CollectionCard key={item.mint} item={item} />
      ))}
    </div>
  );
};