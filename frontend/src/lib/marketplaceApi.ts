import api from './axios'; // Import axios instance đã cấu hình
import { CollectionItem } from '../types/collection.types';

// Định nghĩa kiểu trả về của API (từ backend)
type ApiResponse = {
  success: boolean;
  data: CollectionItem[];
  count: number;
};

/**
 * Lấy danh sách tất cả listing đang hoạt động từ marketplace
 */
export const fetchMarketplaceListings = async (): Promise<CollectionItem[]> => {
  // Dùng `api.get` thay vì `fetch`
  const response = await api.get<ApiResponse>('/marketplace/listings');
  
  const result = response.data;

  // Logic giữ nguyên: Chỉ trả về data nếu thành công VÀ có data
  if (result.success && result.data.length > 0) {
    return result.data;
  }
  
  // Ném lỗi trong mọi trường hợp khác (API lỗi, không có data)
  // Component `Collection.tsx` sẽ bắt lỗi này và giữ lại mock data
  throw new Error('No real data found or API error');
};