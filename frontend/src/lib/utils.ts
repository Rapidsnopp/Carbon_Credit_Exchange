/**
 * Chuyển đổi URI của IPFS thành một URL HTTP có thể truy cập qua gateway của Pinata.
 * @param ipfsUri Đường dẫn IPFS (ví dụ: "ipfs://Qm...")
 * @returns Một URL HTTPS (ví dụ: "https://gateway.pinata.cloud/ipfs/Qm...")
 */
export const ipfsToGatewayUrl = (ipfsUri: string): string => {
  if (!ipfsUri || !ipfsUri.startsWith('ipfs://')) {
    // Trả về URL gốc nếu nó đã là http hoặc là một đường dẫn không hợp lệ
    return ipfsUri;
  }

  // Thay thế ipfs:// bằng địa chỉ gateway
  return ipfsUri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
};