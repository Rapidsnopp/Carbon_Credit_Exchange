// Định nghĩa cấu trúc dữ liệu trả về từ API
export type CollectionItem = {
  mint: string;
  owner: string;
  price: string; // API trả về string
  metadata: {
    name: string;
    description: string;
    image: string;
    category?: string;
    attributes: Array<{ trait_type: string; value: string }>;
    location?: string;
    credits?: number;
  };
};