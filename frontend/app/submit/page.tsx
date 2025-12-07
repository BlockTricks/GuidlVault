"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/navbar";
import { useVaultGuard } from "@/hooks/useVaultGuard";
import { useVaults } from "@/hooks/useVaults";
import { SEVERITY_LABELS, Severity } from "@/lib/types";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

export default function Submit() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading, submitVulnerability, isConnected } = useVaultGuard();
  const { vaults } = useVaults();
  const [formData, setFormData] = useState({
    vaultId: searchParams.get("vaultId") || "",
    reportHash: "",
    severity: Severity.MEDIUM.toString(),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.vaultId) {
      newErrors.vaultId = "Please select a vault";
    }

    if (!formData.reportHash) {
      newErrors.reportHash = "Please provide an IPFS hash";
    } else if (!formData.reportHash.startsWith("Qm")) {
      newErrors.reportHash = "Invalid IPFS hash format (should start with 'Qm')";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    try {
      await submitVulnerability(
        parseInt(formData.vaultId),
        formData.reportHash,
        parseInt(formData.severity) as Severity
      );

      // Reset form
      setFormData({
        vaultId: "",
        reportHash: "",
        severity: Severity.MEDIUM.toString(),
      });

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const getSeverityColor = (severity: string) => {
    const sev = parseInt(severity);
    switch (sev) {
      case Severity.LOW:
        return "text-blue-600 dark:text-blue-400";
      case Severity.MEDIUM:
        return "text-yellow-600 dark:text-yellow-400";
      case Severity.HIGH:
        return "text-orange-600 dark:text-orange-400";
      case Severity.CRITICAL:
        return "text-red-600 dark:text-red-400";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <Navbar />
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Submit Vulnerability
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Report a security issue and earn rewards
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-indigo-600" />
                  Vulnerability Report
                </CardTitle>
                <CardDescription>
                  Submit your vulnerability report via IPFS hash
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      <p className="font-semibold mb-1">Privacy First</p>
                      <p>
                        Upload your report to IPFS and paste the hash here. This
                        keeps your findings private until approved by judges.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="vaultId" className="flex items-center gap-2">
                    Vault
                    {errors.vaultId && (
                      <span className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.vaultId}
                      </span>
                    )}
                  </Label>
                  <Select
                    value={formData.vaultId}
                    onValueChange={(value) => {
                      setFormData({ ...formData, vaultId: value });
                      if (errors.vaultId) {
                        const newErrors = { ...errors };
                        delete newErrors.vaultId;
                        setErrors(newErrors);
                      }
                    }}
                  >
                    <SelectTrigger className={errors.vaultId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select a vault" />
                    </SelectTrigger>
                    <SelectContent>
                      {vaults
                        .filter((v) => v.active)
                        .map((vault) => (
                          <SelectItem key={vault.id} value={vault.id.toString()}>
                            Vault #{vault.id} - {vault.protocol.slice(0, 10)}...
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500 mt-1">
                    Choose the vault to submit your vulnerability to
                  </p>
                </div>

                <div>
                  <Label htmlFor="reportHash" className="flex items-center gap-2">
                    IPFS Report Hash
                    {errors.reportHash && (
                      <span className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.reportHash}
                      </span>
                    )}
                  </Label>
                  <Input
                    id="reportHash"
                    placeholder="QmYourIPFSHashHere..."
                    value={formData.reportHash}
                    onChange={(e) => {
                      setFormData({ ...formData, reportHash: e.target.value });
                      if (errors.reportHash) {
                        const newErrors = { ...errors };
                        delete newErrors.reportHash;
                        setErrors(newErrors);
                      }
                    }}
                    className={errors.reportHash ? "border-red-500" : ""}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Upload your report to IPFS and paste the hash here
                  </p>
                </div>

                <div>
                  <Label htmlFor="severity">Severity Level</Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value) =>
                      setFormData({ ...formData, severity: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Severity)
                        .filter((v) => typeof v === "number")
                        .map((severity) => (
                          <SelectItem
                            key={severity}
                            value={severity.toString()}
                            className={getSeverityColor(severity.toString())}
                          >
                            <span className="font-semibold">
                              {SEVERITY_LABELS[severity as Severity]}
                            </span>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500 mt-1">
                    Select the appropriate severity level for your finding
                  </p>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={loading || !isConnected}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-300"
                  size="lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Upload className="h-5 w-5" />
                      </motion.div>
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Submit Vulnerability
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
