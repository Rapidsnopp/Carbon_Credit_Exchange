// src/lib/solanaClient.ts

export const DEFAULT_RPC = "https://api.devnet.solana.com";

/**
 * Hàm tiện ích gọi JSON-RPC tới Solana
 */
async function solanaRpc<T>(method: string, params: any[] = [], rpcUrl = DEFAULT_RPC): Promise<T> {
    const body = {
        jsonrpc: "2.0",
        id: Date.now(),
        method,
        params,
    };

    const res = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const json = await res.json();

    if (json.error) throw new Error(json.error.message || "RPC error");
    return json.result;
}

/**
 * 1. Lấy thông tin account (bao gồm data, owner, lamports, v.v.)
 */
export async function getAccountInfoRpc(address: string, rpcUrl = DEFAULT_RPC) {
    return solanaRpc("getAccountInfo", [address, { encoding: "jsonParsed", commitment: "confirmed" }], rpcUrl);
}

/**
 * 2. Lấy số dư (balance) của account
 */
export async function getBalance(address: string, rpcUrl = DEFAULT_RPC) {
    const result = await solanaRpc<{ value: number }>("getBalance", [address, { commitment: "confirmed" }], rpcUrl);
    return result.value / 1e9; // chuyển từ lamports -> SOL
}

/**
 * 3. Lấy danh sách token accounts (SPL) mà account sở hữu
 */
export async function getTokenAccounts(address: string, rpcUrl = DEFAULT_RPC) {
    return solanaRpc("getParsedTokenAccountsByOwner", [
        address,
        { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
        { encoding: "jsonParsed" },
    ], rpcUrl);
}

/**
 * 4. Lấy danh sách transaction gần nhất của account
 */
export async function getRecentTransactions(address: string, limit = 10, rpcUrl = DEFAULT_RPC) {
    const sigs = await solanaRpc<any[]>("getSignaturesForAddress", [address, { limit }], rpcUrl);
    const txs = await Promise.all(
        sigs.map(async (s) => {
            try {
                const tx = await solanaRpc("getTransaction", [s.signature, { encoding: "json", commitment: "confirmed" }], rpcUrl);
                return tx;
            } catch {
                return null;
            }
        })
    );
    return txs.filter(Boolean);
}

/**
 * 5. Lấy block height hiện tại
 */
export async function getCurrentBlockHeight(rpcUrl = DEFAULT_RPC) {
    const result = await solanaRpc<number>("getBlockHeight", [], rpcUrl);
    return result;
}

/**
 * 6. Lấy thông tin cluster
 */
export async function getClusterNodes(rpcUrl = DEFAULT_RPC) {
    return solanaRpc("getClusterNodes", [], rpcUrl);
}

/**
 * 7. Lấy phiên bản node RPC
 */
export async function getVersion(rpcUrl = DEFAULT_RPC) {
    return solanaRpc<{ "solana-core": string }>("getVersion", [], rpcUrl);
}
