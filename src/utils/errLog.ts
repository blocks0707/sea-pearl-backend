

export const customCode = {
    USER_NOT_FOUND: { code: "cm-0001", message: "User not found" },
    USER_ALREADY_EXISTS: { code: "cm-0002", message: "User already exists" },
    INVALID_REQUEST_BODY: { code: "cm-0003", message: "Invalid request body" },
    INVALID_REQUEST_QUERY: { code: "cm-0004", message: "Invalid request query" },
    INTERNAL_SERVER: { code: "cm-0005", message: "Internal server error" },
    INVALID_PASSWORD: { code: "cm-0006", message: "Invalid password" },
    USER_ALREADY_LOGGED_IN: { code: "cm-0007", message: "User already logged in" },
    USER_NOT_LOGGED_IN: { code: "cm-0008", message: "User not logged in" },
    "fbx-0001": { code: "fbx-0001", message: "Invalid request body" },
    "gme-0001": { code: "gme-0001", message: "Game not found" },
    "mng-0001": { code: "mng-0001", message: "Mining not found" },
    "rff-0001": { code: "rff-0001", message: "Raffle not found" },
    "pfl-0001": { code: "pfl-0001", message: "Profile not found" },
    "rfr-0001": { code: "rfr-0001", message: "Referral not found" },
    "rlt-0001": { code: "rlt-0001", message: "Roulette not found" },
    "wlh-0001": { code: "wlh-0001", message: "WalletHistory not found" },
    "wlt-0001": { code: "wlt-0001", message: "Wallet not found" },
} as const;
