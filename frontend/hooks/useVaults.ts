import { useState, useEffect, useCallback } from "react";
import { usePublicClient } from "wagmi";
import { ethers } from "ethers";
import { VAULT_GUARD_ADDRESS, VAULT_GUARD_ABI } from "@/lib/contract";
import type { Vault } from "@/lib/types";

export function useVaults() {
  const publicClient = usePublicClient();
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVaults = useCallback(async () => {
    if (!publicClient) return;

    try {
      setLoading(true);
      setError(null);
      
      const provider = new ethers.BrowserProvider(publicClient as any);
      const contract = new ethers.Contract(
        VAULT_GUARD_ADDRESS,
        VAULT_GUARD_ABI,
        provider
      );

      const count = await contract.vaultCount();
      const vaultList: Vault[] = [];

      for (let i = 0; i < count; i++) {
        const vault = await contract.vaults(i);
        vaultList.push({
          id: i,
          protocol: vault.protocol,
          totalDeposit: vault.totalDeposit,
          remainingFunds: vault.remainingFunds,
          active: vault.active,
          requiredApprovals: Number(vault.requiredApprovals),
        });
      }

      setVaults(vaultList);
    } catch (err: any) {
      console.error("Error loading vaults:", err);
      setError(err.message || "Failed to load vaults");
    } finally {
      setLoading(false);
    }
  }, [publicClient]);

  useEffect(() => {
    loadVaults();
  }, [loadVaults]);

  return {
    vaults,
    loading,
    error,
    refetch: loadVaults,
  };
}

export function useVault(vaultId: number | null) {
  const publicClient = usePublicClient();
  const [vault, setVault] = useState<Vault | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVault = useCallback(async () => {
    if (!publicClient || vaultId === null) return;

    try {
      setLoading(true);
      setError(null);
      
      const provider = new ethers.BrowserProvider(publicClient as any);
      const contract = new ethers.Contract(
        VAULT_GUARD_ADDRESS,
        VAULT_GUARD_ABI,
        provider
      );

      const vaultData = await contract.vaults(vaultId);
      const judges = await contract.getVaultJudges(vaultId);
      const submissions = await contract.getVaultSubmissions(vaultId);

      setVault({
        id: vaultId,
        protocol: vaultData.protocol,
        totalDeposit: vaultData.totalDeposit,
        remainingFunds: vaultData.remainingFunds,
        active: vaultData.active,
        requiredApprovals: Number(vaultData.requiredApprovals),
        judges: judges,
        submissions: submissions.map((s: any) => Number(s)),
      });
    } catch (err: any) {
      console.error("Error loading vault:", err);
      setError(err.message || "Failed to load vault");
    } finally {
      setLoading(false);
    }
  }, [publicClient, vaultId]);

  useEffect(() => {
    loadVault();
  }, [loadVault]);

  return {
    vault,
    loading,
    error,
    refetch: loadVault,
  };
}

