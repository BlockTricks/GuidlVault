"use client";

import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, celo, celoAlfajores } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Get project ID from environment
const projectId =
  process.env.NEXT_PUBLIC_REOWN_ID || "1db88bda17adf26df9ab7799871788c4";

// Create Wagmi config
const wagmiAdapter = new WagmiAdapter({
  networks: [celo, celoAlfajores, mainnet],
  projectId,
  ssr: true,
});

// Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks: [celo, celoAlfajores, mainnet],
  projectId,
  metadata: {
    name: "VaultGuard",
    description: "Decentralized Bug Bounty Platform",
    url:
      typeof window !== "undefined"
        ? window.location.origin
        : "https://vaultguard.xyz",
    icons: [],
  },
  features: {
    analytics: true,
  },
  themeMode: "light",
});

export const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
