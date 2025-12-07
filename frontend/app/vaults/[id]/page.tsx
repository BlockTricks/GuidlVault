"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import {
  Shield,
  DollarSign,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { useVault } from "@/hooks/useVaults";
import { useSubmissions } from "@/hooks/useSubmissions";
import { EmptyState, ErrorState } from "@/components/states";
import { VaultSkeleton, SubmissionSkeleton } from "@/components/skeletons";
import { SEVERITY_LABELS, STATUS_LABELS, Severity, SubmissionStatus } from "@/lib/types";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VaultDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const vaultId = parseInt(id);
  const { vault, loading: vaultLoading, error: vaultError, refetch } = useVault(vaultId);
  const { submissions, loading: submissionsLoading } = useSubmissions(
    vault?.submissions || []
  );

  if (vaultError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
        <Navbar />
        <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <ErrorState message={vaultError} retry={refetch} />
        </div>
      </div>
    );
  }

  if (vaultLoading || !vault) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
        <Navbar />
        <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <VaultSkeleton />
          </div>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case Severity.LOW:
        return "bg-blue-500";
      case Severity.MEDIUM:
        return "bg-yellow-500";
      case Severity.HIGH:
        return "bg-orange-500";
      case Severity.CRITICAL:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: SubmissionStatus) => {
    switch (status) {
      case SubmissionStatus.PENDING:
        return <Clock className="h-4 w-4" />;
      case SubmissionStatus.APPROVED:
        return <CheckCircle2 className="h-4 w-4" />;
      case SubmissionStatus.REJECTED:
        return <XCircle className="h-4 w-4" />;
      case SubmissionStatus.PAID:
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <Navbar />
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link href="/vaults">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Vaults
              </Button>
            </Link>

            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Vault #{vaultId}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 font-mono text-sm">
                  {vault.protocol}
                </p>
              </div>
              <Badge
                variant={vault.active ? "default" : "secondary"}
                className={`text-lg px-4 py-2 ${vault.active ? "animate-pulse" : ""}`}
              >
                {vault.active ? "Active" : "Closed"}
              </Badge>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: DollarSign,
                label: "Total Deposit",
                value: `${parseFloat(ethers.formatEther(vault.totalDeposit)).toFixed(2)} CELO`,
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: TrendingUp,
                label: "Remaining Funds",
                value: `${parseFloat(ethers.formatEther(vault.remainingFunds)).toFixed(2)} CELO`,
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Users,
                label: "Required Approvals",
                value: vault.requiredApprovals.toString(),
                color: "from-indigo-500 to-purple-500",
              },
              {
                icon: Shield,
                label: "Submissions",
                value: vault.submissions?.length || 0,
                color: "from-pink-500 to-rose-500",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="border-2 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                        <stat.icon className="h-5 w-5 text-white" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {stat.label}
                      </p>
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Tabs defaultValue="submissions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-grid">
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
              <TabsTrigger value="judges">Judges</TabsTrigger>
            </TabsList>

            <TabsContent value="submissions" className="space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Vulnerability Submissions</CardTitle>
                      <CardDescription>
                        All submitted vulnerabilities for this vault
                      </CardDescription>
                    </div>
                    <Link href={`/submit?vaultId=${vaultId}`}>
                      <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Submit Vulnerability
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {submissionsLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <SubmissionSkeleton key={i} />
                      ))}
                    </div>
                  ) : submissions.length === 0 ? (
                    <EmptyState
                      icon={<Shield className="h-12 w-12 text-slate-400" />}
                      title="No Submissions Yet"
                      description="Be the first to submit a vulnerability to this vault"
                    />
                  ) : (
                    <div className="space-y-4">
                      {submissions.map((submission, index) => (
                        <motion.div
                          key={submission.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card className="border hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(submission.status)}
                                    <span className="font-bold">
                                      Submission #{submission.id}
                                    </span>
                                  </div>
                                  <Badge className={getSeverityColor(submission.severity)}>
                                    {SEVERITY_LABELS[submission.severity]}
                                  </Badge>
                                  <Badge variant="outline">
                                    {STATUS_LABELS[submission.status]}
                                  </Badge>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Payout
                                  </p>
                                  <p className="font-bold">
                                    {parseFloat(ethers.formatEther(submission.payoutAmount)).toFixed(4)} CELO
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-600 dark:text-slate-400">
                                    Researcher
                                  </span>
                                  <span className="font-mono">
                                    {submission.researcher.slice(0, 8)}...
                                    {submission.researcher.slice(-6)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-600 dark:text-slate-400">
                                    Report Hash
                                  </span>
                                  <span className="font-mono text-xs">
                                    {submission.reportHash}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-600 dark:text-slate-400">
                                    Approvals
                                  </span>
                                  <span className="font-bold">
                                    {submission.approvalCount} / {vault.requiredApprovals}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="judges">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Authorized Judges</CardTitle>
                  <CardDescription>
                    Trusted addresses that can vote on submissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {vault.judges?.map((judge, index) => (
                      <motion.div
                        key={judge}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500">
                            <Users className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-mono">{judge}</span>
                        </div>
                        <Badge variant="outline">Judge #{index + 1}</Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

