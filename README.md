# Carbon Credit Exchange (Sàn giao dịch tín chỉ carbon bằng NFT trên Solana)

Đây là dự án sàn giao dịch tín chỉ carbon (carbon credits) dưới dạng NFT, xây dựng trên hệ sinh thái Solana. Mục tiêu là tạo thị trường minh bạch, có thể giao dịch và truy xuất nguồn gốc cho các tín chỉ carbon bằng cách mã hóa từng tín chỉ thành NFT, kèm metadata chứng minh thông tin về dự án giảm phát thải.

## Tính năng chính

- Mã hóa tín chỉ carbon thành NFT (token không thể thay thế) để dễ lưu trữ, chuyển nhượng và truy xuất.
- Thị trường (marketplace) cho phép: niêm yết, mua/bán, đấu giá, và chuyển nhượng NFT đại diện cho tín chỉ carbon.
- Hệ thống metadata lưu trữ thông tin về nguồn gốc tín chỉ: dự án, định lượng (tấn CO2), ngày cấp, nhà kiểm chứng, v.v.
- Hợp đồng thông minh (Smart Contracts) trên Solana xử lý mint NFT, giao dịch và quyền sở hữu.
- Tích hợp ví (Phantom, Solflare, v.v.) để xác thực người dùng và ký giao dịch.
- Lịch sử giao dịch, bằng chứng sở hữu và truy xuất nguồn gốc công khai trên blockchain.

## Kiến trúc & Công nghệ

- Blockchain: Solana (SPL Token, Metaplex NFT standard)
- Smart Contracts: Rust (Solana Program Library / Anchor framework)
- Frontend: React / Next.js (kết nối ví qua solana/wallet-adapter)
- Backend (tùy chọn): Node.js / TypeScript hoặc Rust cho dịch vụ off-chain (indexer, metadata hosting)
- Lưu trữ metadata & assets: Arweave hoặc IPFS (đảm bảo tính bất biến của metadata)
- Cơ sở dữ liệu (tùy chọn): PostgreSQL / Redis để cache và index dữ liệu cho UI

## Hướng dẫn nhanh — Cài đặt và chạy local

Yêu cầu: Cài sẵn các công cụ: Node.js, npm/yarn, Rust, Solana CLI, Anchor CLI và một ví Solana (ví dụ: Phantom).

1. Clone repository:

   git clone <repo-url>

2. Cài đặt dependencies frontend :

   cd <frontend>
   npm install

3. Thiết lập Solana devnet/localnet:

   # Tạo keypair
   solana-keygen new --outfile ~/.config/solana/id.json
   # Chọn network
   solana config set --url https://api.devnet.solana.com
   # Nạp SOL thử nghiệm
   solana airdrop 2

4. Deploy program:

   anchor build
   anchor deploy --provider.cluster devnet

5. Chạy frontend:
   npm run dev

6. Kết nối ví (Phantom) và thử mint/list/mua NFT trên giao diện.

## Triển khai (Deployment)

- Smart contracts: build và deploy lên `dev-net` hoặc một cluster đã chọn bằng Solana CLI / Anchor.
- Metadata & assets: upload lên Arweave/IPFS và lưu URI vào metadata NFT.
- Frontend: deploy lên Vercel / Netlify / static hosting và cấu hình môi trường (RPC endpoint, program IDs, env vars cho keys nếu cần).

## Contributing

Chào mừng các đóng góp! Vui lòng mở issue hoặc gửi pull request. Bao gồm:

- Mô tả chi tiết về tính năng/sửa lỗi.
- Hướng dẫn để tái tạo lỗi (nếu là bug).
- Test case hoặc script để verify thay đổi.

---
