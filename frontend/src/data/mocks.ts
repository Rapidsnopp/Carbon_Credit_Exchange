import { CollectionItem } from '../types/collection.types';

// Sử dụng Type đã định nghĩa để đảm bảo mock data luôn đúng cấu trúc
export const MOCK_COLLECTION_DATA: CollectionItem[] = [
  {
    mint: 'mock_mint_1',
    owner: 'MockS3LLER...ABC',
    price: '1500000000',
    metadata: {
      name: 'Dự án Năng lượng Gió',
      description: 'Mô tả chi tiết về dự án năng lượng gió...',
      image: 'https://th.bing.com/th/id/OIP.X6-Rq1fBKafiRR9ho0HgZAHaEA?w=302&h=180&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3',
      attributes: [
        { trait_type: 'Loại', value: 'Năng lượng tái tạo' },
        { trait_type: 'Năm', value: '2024' },
      ],
    },
  },
  {
    mint: 'mock_mint_2',
    owner: 'MockS3LLER...XYZ',
    price: '2000000000',
    metadata: {
      name: 'Dự án Rừng ngập mặn',
      description: 'Mô tả chi tiết về dự án rừng ngập mặn...',
      image: 'https://th.bing.com/th/id/OIP.dmXOfwQtBexfxdJKWCHRwQHaE3?w=255&h=180&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3',
      attributes: [
        { trait_type: 'Loại', value: 'Lâm nghiệp' },
        { trait_type: 'Năm', value: '2023' },
      ],
    },
  },
];