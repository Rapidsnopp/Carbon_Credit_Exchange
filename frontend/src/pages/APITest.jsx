import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import ApiService from "../services/api";

const APITest = () => {
  const { publicKey } = useWallet();
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});

  const runTest = async (testName, testFn) => {
    setLoading((prev) => ({ ...prev, [testName]: true }));
    setErrors((prev) => ({ ...prev, [testName]: null }));

    try {
      const result = await testFn();
      setResults((prev) => ({ ...prev, [testName]: result }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [testName]: error.message }));
    } finally {
      setLoading((prev) => ({ ...prev, [testName]: false }));
    }
  };

  const tests = [
    {
      name: "health",
      label: "Health Check",
      fn: () => ApiService.checkHealth(),
      requiresWallet: false,
    },
    {
      name: "programInfo",
      label: "Program Info",
      fn: () => ApiService.getProgramInfo(),
      requiresWallet: false,
    },
    {
      name: "events",
      label: "Get Events",
      fn: () => ApiService.getEvents(5),
      requiresWallet: false,
    },
    {
      name: "carbonCredits",
      label: "All Carbon Credits",
      fn: () => ApiService.getAllCarbonCredits(),
      requiresWallet: false,
    },
    {
      name: "carbonStats",
      label: "Carbon Credit Stats",
      fn: () => ApiService.getCarbonCreditStats(),
      requiresWallet: false,
    },
    {
      name: "walletCredits",
      label: "My Carbon Credits",
      fn: () => ApiService.getCarbonCreditsByWallet(publicKey.toBase58()),
      requiresWallet: true,
    },
    {
      name: "listings",
      label: "Marketplace Listings",
      fn: () => ApiService.getAllListings(),
      requiresWallet: false,
    },
    {
      name: "marketStats",
      label: "Marketplace Stats",
      fn: () => ApiService.getMarketplaceStats(),
      requiresWallet: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            API Connection Test
          </h1>
          <p className="text-gray-600 mb-6">
            Test all backend API endpoints to verify connectivity
          </p>

          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg mb-6">
            <div className="flex-1">
              <p className="text-sm text-gray-600">Backend URL:</p>
              <p className="font-mono text-sm font-semibold text-blue-600">
                {import.meta.env.VITE_API_URL || "http://localhost:3001"}
              </p>
            </div>
            <WalletMultiButton />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tests.map((test) => (
            <div
              key={test.name}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {test.label}
                </h3>
                <button
                  onClick={() => runTest(test.name, test.fn)}
                  disabled={
                    loading[test.name] || (test.requiresWallet && !publicKey)
                  }
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    loading[test.name]
                      ? "bg-gray-300 cursor-not-allowed"
                      : test.requiresWallet && !publicKey
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {loading[test.name] ? "Testing..." : "Test"}
                </button>
              </div>

              {test.requiresWallet && !publicKey && (
                <p className="text-sm text-orange-600 mb-2">
                  ⚠️ Requires wallet connection
                </p>
              )}

              {errors[test.name] && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                  <p className="text-sm font-semibold text-red-700 mb-1">
                    Error:
                  </p>
                  <p className="text-sm text-red-600 font-mono">
                    {errors[test.name]}
                  </p>
                </div>
              )}

              {results[test.name] && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-green-700 mb-2">
                    ✓ Success
                  </p>
                  <pre className="text-xs text-gray-700 overflow-auto max-h-60 bg-white p-2 rounded">
                    {JSON.stringify(results[test.name], null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            📝 Notes
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
            <li>Make sure backend is running on port 3001</li>
            <li>MongoDB should be connected</li>
            <li>Some tests require wallet connection</li>
            <li>Check browser console for detailed errors</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default APITest;
