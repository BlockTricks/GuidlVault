import { useState, useCallback } from "react";
import { usePublicClient, useWalletClient, useAccount } from "wagmi";
import { ethers } from "ethers";
import { toast } from "sonner";
import { VAULT_GUARD_ADDRESS, VAULT_GUARD_ABI } from "@/lib/contract";
import type { Severity } from "@/lib/types";

export function useVaultGuard() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [loading, setLoading] = useState(false);

  const getContract = useCallback(
    async (needsSigner = false) => {
      if (!publicClient) {
        throw new Error("Public client not available");
      }

      if (needsSigner) {
        if (!isConnected || !walletClient) {
          throw new Error("Wallet not connected");
        }
        const provider = new ethers.BrowserProvider(walletClient as any);
        const signer = await provider.getSigner();
        return new ethers.Contract(
          VAULT_GUARD_ADDRESS,
          VAULT_GUARD_ABI,
          signer
        );
      }

      const provider = new ethers.BrowserProvider(publicClient as any);
      return new ethers.Contract(VAULT_GUARD_ADDRESS, VAULT_GUARD_ABI, provider);
    },
    [publicClient, walletClient, isConnected]
  );

  const createVault = useCallback(
    async (
      judges: string[],
      requiredApprovals: number,
      payouts: [number, number, number, number],
      depositAmount: string
    ) => {
      try {
        setLoading(true);
        const contract = await getContract(true);

        const tx = await contract.createVault(judges, requiredApprovals, payouts, {
          value: ethers.parseEther(depositAmount),
        });

        toast.success("Transaction submitted! Waiting for confirmation...");
        const receipt = await tx.wait();
        toast.success("Vault created successfully!");
        
        return receipt;
      } catch (error: any) {
        console.error("Error creating vault:", error);
        toast.error(error.message || "Failed to create vault");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getContract]
  );

  const submitVulnerability = useCallback(
    async (vaultId: number, reportHash: string, severity: Severity) => {
      try {
        setLoading(true);
        const contract = await getContract(true);

        const tx = await contract.submitVulnerability(vaultId, reportHash, severity);

        toast.success("Submission sent! Waiting for confirmation...");
        const receipt = await tx.wait();
        toast.success("Vulnerability submitted successfully!");
        
        return receipt;
      } catch (error: any) {
        console.error("Error submitting vulnerability:", error);
        toast.error(error.message || "Failed to submit vulnerability");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getContract]
  );

  const voteOnSubmission = useCallback(
    async (submissionId: number, approved: boolean) => {
      try {
        setLoading(true);
        const contract = await getContract(true);

        const tx = await contract.voteOnSubmission(submissionId, approved);

        toast.success("Vote submitted! Waiting for confirmation...");
        const receipt = await tx.wait();
        toast.success(`Submission ${approved ? "approved" : "rejected"}!`);
        
        return receipt;
      } catch (error: any) {
        console.error("Error voting on submission:", error);
        toast.error(error.message || "Failed to vote on submission");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getContract]
  );

  const claimPayout = useCallback(
    async (submissionId: number) => {
      try {
        setLoading(true);
        const contract = await getContract(true);

        const tx = await contract.claimPayout(submissionId);

        toast.success("Claiming payout! Waiting for confirmation...");
        const receipt = await tx.wait();
        toast.success("Payout claimed successfully!");
        
        return receipt;
      } catch (error: any) {
        console.error("Error claiming payout:", error);
        toast.error(error.message || "Failed to claim payout");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getContract]
  );

  const depositFunds = useCallback(
    async (vaultId: number, amount: string) => {
      try {
        setLoading(true);
        const contract = await getContract(true);

        const tx = await contract.depositFunds(vaultId, {
          value: ethers.parseEther(amount),
        });

        toast.success("Deposit sent! Waiting for confirmation...");
        const receipt = await tx.wait();
        toast.success("Funds deposited successfully!");
        
        return receipt;
      } catch (error: any) {
        console.error("Error depositing funds:", error);
        toast.error(error.message || "Failed to deposit funds");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getContract]
  );

  const closeVault = useCallback(
    async (vaultId: number) => {
      try {
        setLoading(true);
        const contract = await getContract(true);

        const tx = await contract.closeVault(vaultId);

        toast.success("Closing vault! Waiting for confirmation...");
        const receipt = await tx.wait();
        toast.success("Vault closed successfully!");
        
        return receipt;
      } catch (error: any) {
        console.error("Error closing vault:", error);
        toast.error(error.message || "Failed to close vault");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getContract]
  );

  return {
    loading,
    createVault,
    submitVulnerability,
    voteOnSubmission,
    claimPayout,
    depositFunds,
    closeVault,
    isConnected,
    address,
  };
}

