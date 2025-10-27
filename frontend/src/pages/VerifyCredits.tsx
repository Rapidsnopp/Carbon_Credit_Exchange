import React, { useState } from 'react';
import { VerificationResult } from "../types"
import VerifyInfor from '../components/verify-page/VerifyInfor';
import VerifyResult from '../components/verify-page/VerifyResult';
import api from '../lib/axios'; // <-- BƯỚC 1: Import API

const VerifyCredits: React.FC = () => {
  const [creditId, setCreditId] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // BƯỚC 2: Viết lại hàm handleVerification
  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditId.trim()) return;

    setIsLoading(true);
    setVerificationResult(null); // Xóa kết quả cũ

    try {
      // Gọi API backend thật (baseURL đã có /api)
      const response = await api.post('/carbon-credits/verify', { mint: creditId });

      if (response.data.success) {
        const data = response.data.data;
        // Chuyển đổi data API sang format của UI (VerificationResult)
        const mockResult = {
          id: data.mint,
          isValid: data.isValid,
          project: data.metadata?.name || 'N/A',
          location: data.metadata?.attributes?.find((a:any) => a.trait_type === 'Location')?.value || 'N/A',
          credits: data.metadata?.attributes?.find((a:any) => a.trait_type === 'Credits')?.value || 'N/A',
          vintage: data.metadata?.attributes?.find((a:any) => a.trait_type === 'Năm')?.value || 'N/A',
          standard: data.metadata?.attributes?.find((a:any) => a.trait_type === 'Standard')?.value || 'N/A',
          issuedDate: data.metadata?.createdAt || new Date().toISOString(),
          status: data.isRetired ? 'Retired' : (data.isListed ? 'Listed' : 'Active'),
          blockchain: 'Solana',
          transactionHash: data.mint, // Dùng mint làm ID
        };
        setVerificationResult(mockResult);
      } else {
        throw new Error(response.data.error || 'Verification failed');
      }

    } catch (error: any) {
      console.error("Verification failed:", error);
      // Hiển thị kết quả thất bại
      setVerificationResult({
        id: creditId,
        isValid: false,
        status: 'Not Found',
        project: error.message,
        // ... (điền các trường khác là 'N/A')
        location: 'N/A', credits: 0, vintage: 'N/A', standard: 'N/A',
        issuedDate: 'N/A', blockchain: 'Solana', transactionHash: 'N/A'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ... (Phần UI return giữ nguyên) ...
  return (
    <div className="min-h-screen bg-gray-900">
      {/* ... (Toàn bộ UI giữ nguyên) ... */}
    </div>
  );
};

export default VerifyCredits;