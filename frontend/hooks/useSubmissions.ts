import { useState, useEffect, useCallback } from "react";
import { usePublicClient, useAccount } from "wagmi";
import { ethers } from "ethers";
import { VAULT_GUARD_ADDRESS, VAULT_GUARD_ABI } from "@/lib/contract";
import type { Submission } from "@/lib/types";

export function useSubmission(submissionId: number | null) {
  const publicClient = usePublicClient();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSubmission = useCallback(async () => {
    if (!publicClient || submissionId === null) return;

    try {
      setLoading(true);
      setError(null);
      
      const provider = new ethers.BrowserProvider(publicClient as any);
      const contract = new ethers.Contract(
        VAULT_GUARD_ADDRESS,
        VAULT_GUARD_ABI,
        provider
      );

      const details = await contract.getSubmissionDetails(submissionId);

      setSubmission({
        id: submissionId,
        vaultId: Number(details.vaultId),
        researcher: details.researcher,
        reportHash: details.reportHash,
        severity: Number(details.severity),
        status: Number(details.status),
        approvalCount: Number(details.approvalCount),
        payoutAmount: details.payoutAmount,
      });
    } catch (err: any) {
      console.error("Error loading submission:", err);
      setError(err.message || "Failed to load submission");
    } finally {
      setLoading(false);
    }
  }, [publicClient, submissionId]);

  useEffect(() => {
    loadSubmission();
  }, [loadSubmission]);

  return {
    submission,
    loading,
    error,
    refetch: loadSubmission,
  };
}

export function useSubmissions(submissionIds: number[]) {
  const publicClient = usePublicClient();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSubmissions = useCallback(async () => {
    if (!publicClient || submissionIds.length === 0) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const provider = new ethers.BrowserProvider(publicClient as any);
      const contract = new ethers.Contract(
        VAULT_GUARD_ADDRESS,
        VAULT_GUARD_ABI,
        provider
      );

      const submissionList: Submission[] = [];

      for (const id of submissionIds) {
        const details = await contract.getSubmissionDetails(id);
        submissionList.push({
          id,
          vaultId: Number(details.vaultId),
          researcher: details.researcher,
          reportHash: details.reportHash,
          severity: Number(details.severity),
          status: Number(details.status),
          approvalCount: Number(details.approvalCount),
          payoutAmount: details.payoutAmount,
        });
      }

      setSubmissions(submissionList);
    } catch (err: any) {
      console.error("Error loading submissions:", err);
      setError(err.message || "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  }, [publicClient, JSON.stringify(submissionIds)]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  return {
    submissions,
    loading,
    error,
    refetch: loadSubmissions,
  };
}

export function useUserSubmissions() {
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserSubmissions = useCallback(async () => {
    if (!publicClient || !address) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const provider = new ethers.BrowserProvider(publicClient as any);
      const contract = new ethers.Contract(
        VAULT_GUARD_ADDRESS,
        VAULT_GUARD_ABI,
        provider
      );

      const count = await contract.submissionCount();
      const userSubmissions: Submission[] = [];

      for (let i = 0; i < count; i++) {
        const details = await contract.getSubmissionDetails(i);
        if (details.researcher.toLowerCase() === address.toLowerCase()) {
          userSubmissions.push({
            id: i,
            vaultId: Number(details.vaultId),
            researcher: details.researcher,
            reportHash: details.reportHash,
            severity: Number(details.severity),
            status: Number(details.status),
            approvalCount: Number(details.approvalCount),
            payoutAmount: details.payoutAmount,
          });
        }
      }

      setSubmissions(userSubmissions);
    } catch (err: any) {
      console.error("Error loading user submissions:", err);
      setError(err.message || "Failed to load user submissions");
    } finally {
      setLoading(false);
    }
  }, [publicClient, address]);

  useEffect(() => {
    loadUserSubmissions();
  }, [loadUserSubmissions]);

  return {
    submissions,
    loading,
    error,
    refetch: loadUserSubmissions,
  };
}

