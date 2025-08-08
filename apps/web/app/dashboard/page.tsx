"use client"

import React from 'react'
import {
  AlertTriangle,
  Beaker,
  Book,
  Bot,
  CheckCircle2,
  GitBranch,
  GitCommit,
  Github,
  GitPullRequest,
  
  LifeBuoy,
  MessageSquare,
  Plus,
  Scale,
  Search,
  Star,
  Users,
} from "lucide-react"
import { motion, Variants } from "framer-motion"
import Link from "next/link"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AnimatedStatCard } from '@/components/ui/animated-stat-card'
import { ModelCard } from "@/components/ui/model-card"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

interface Trial {
  name: string;
  title: string;
  status: string;
  owner: string;
  pipeline: string;
  lastUpdate: string;
  patientEnrollment: number;
  totalPatients: number;
  alerts: number;
}

interface Activity {
    type: string;
    user: string;
    repo: string;
    details: string;
    time: string;
    Icon: React.ElementType;
}

interface Model {
    name: string;
    version: string;
    description: string;
    provider: string;
    Icon: React.ElementType;
    stars: number;
    forks: number;
}

interface Discussion {
    title: string;
    repo: string;
    user: string;
    time: string;
}

interface Stat {
    label: string;
    value: string;
    change: string;
    changeType: string;
    icon: React.ElementType;
}

const trials: Trial[] = [
  {
    name: "CTP-ABC123",
    title: "NSCLC Phase I Safety and Efficacy Trial",
    status: "Active",
    owner: "MSKCC",
    pipeline: "mitochondrial-ros-sensor",
    lastUpdate: "3 hours ago",
    patientEnrollment: 8,
    totalPatients: 20,
    alerts: 1,
  },
  {
    name: "CTP-XYZ789",
    title: "CAR-T Optimization Study",
    status: "Enrolling",
    owner: "UCSF",
    pipeline: "faers-safety-digest",
    lastUpdate: "1 day ago",
    patientEnrollment: 2,
    totalPatients: 15,
    alerts: 0,
  },
];

const activity: Activity[] = [
    {
      type: "COMMIT",
      user: "Dr. Anya Sharma",
      repo: "CTP-ABC123",
      details: "pushed a discovery commit with updates to the patient stratification logic.",
      time: "2h ago",
      Icon: GitCommit,
    },
    {
      type: "PULL_REQUEST",
      user: "Dr. Ben Carter",
      repo: "CTP-XYZ789",
      details: "opened a hypothesis merge to add a new cohort for dose escalation.",
      time: "1d ago",
      Icon: GitPullRequest,
    },
];

const models: Model[] = [
    {
      name: "ToxicityPredict",
      version: "v1.2",
      description: "Predicts adverse event probability from patient data.",
      provider: "OpenAI",
      Icon: Bot,
      stars: 128,
      forks: 12,
    },
    {
      name: "SurvivalRate",
      version: "v2.0",
      description: "Estimates patient survival rates based on genomic markers.",
      provider: "Anthropic",
      Icon: Bot,
      stars: 72,
      forks: 3,
    },
];

const discussions: Discussion[] = [
    {
      title: "New RECIST 1.1 guidance",
      repo: "Oncology-Working-Group",
      user: "Dr. Li Wei",
      time: "5h ago",
    },
    {
      title: "Potential for synthetic control arm in CTP-ABC123",
      repo: "CTP-ABC123",
      user: "Dr. Sarah Johnson",
      time: "2d ago",
    },
];

const stats: Stat[] = [
    {
      label: "Active Repositories",
      value: "3",
      change: "+1 this week",
      changeType: "increase",
      icon: Beaker,
    },
    {
        label: "Pending Reviews",
        value: "2",
        change: "Urgent",
        changeType: "alert",
        icon: GitPullRequest,
    },
    {
        label: "Safety Alerts",
        value: "1",
        change: "Grade 3",
        changeType: "decrease",
        icon: AlertTriangle,
    },
];

export default function DashboardPage() {
  return (
    <motion.div
      className="min-h-screen bg-background text-foreground"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 py-10">
        {/* Hero Pastel Tile */}
        <motion.div
          className="mb-10 rounded-2xl bg-primary-100 shadow-elevation-2 border border-primary-100/60 overflow-hidden"
          variants={itemVariants}
          whileHover={{ y: -1 }}
          transition={{ duration: 0.2 }}
        >
          <div aria-hidden className="pointer-events-none absolute inset-x-0 h-20 bg-gradient-to-b from-primary-100/50 via-accent-100/20 to-transparent" />
          <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 p-6 sm:p-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-200/70 bg-white/50 text-xs font-semibold text-primary-700/90">
                <span className="text-lg">🗂️</span>
                <span>Dashboard</span>
              </div>
              <h1 className="mt-3 text-4xl lg:text-5xl font-display font-light tracking-tight text-foreground">
                Welcome back, Will
              </h1>
              <p className="text-base lg:text-lg text-muted-foreground mt-2">
                Every claim runnable. Every result verifiable.
              </p>
            </div>
            <div className="flex items-center md:justify-end gap-2">
              <Button variant="outline" className="rounded-xl">
                <Search className="w-4 h-4 mr-2" />
                Search Repositories
              </Button>
              <Button className="rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Run & Verify
              </Button>
            </div>
          </div>
        </motion.div>
    
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <motion.div className="lg:col-span-2 space-y-8" variants={itemVariants}>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => {
                const pastelBg = stat.changeType === "alert"
                  ? "bg-error-100 border-error-100/60"
                  : stat.changeType === "increase"
                  ? "bg-accent-100 border-accent-100/60"
                  : "bg-primary-100 border-primary-100/60"
                return (
                  <div
                    key={index}
                    className={`rounded-2xl p-4 shadow-elevation-1 border ${pastelBg}`}
                  >
                    <AnimatedStatCard
                      label={stat.label}
                      value={stat.value}
                      growth={stat.change}
                      index={index}
                    />
                  </div>
                )
              })}
            </div>
            
            {/* Active Repositories */}
            <DashboardCard
              title="Active Repositories"
              icon={Beaker}
              action={{ label: "View All Repositories", href: "/repositories" }}
            >
              <div className="space-y-4">
                {trials.map((repository) => (
                  <RepositoryCard key={repository.name} repository={repository} />
                ))}
              </div>
            </DashboardCard>

            {/* Recent Activity */}
            <DashboardCard
              title="Recent Activity"
              icon={GitBranch}
              action={{ label: "View Full History", href: "/history" }}
            >
              <ul className="space-y-4 relative pl-4 border-l border-border/70">
                {activity.map((item, index) => (
                  <ActivityItem key={index} item={item} />
                ))}
              </ul>
            </DashboardCard>
          </motion.div>

          {/* Right Column */}
          <motion.div className="space-y-8" variants={itemVariants}>
            {/* Favorite Models */}
            <DashboardCard
              title="Favorite Models"
              icon={Star}
              action={{ label: "Explore Models", href: "/models" }}
            >
              <div className="space-y-4">
                {models.map((model) => (
                  <ModelCard key={model.name} model={model} variants={itemVariants} />
                ))}
              </div>
            </DashboardCard>

            {/* Discussions */}
            <DashboardCard
              title="Discussions"
              icon={MessageSquare}
              action={{ label: "View All", href: "/discussions" }}
            >
              <ul className="space-y-3">
                {discussions.map((discussion, index) => (
                  <DiscussionItem key={index} discussion={discussion} />
                ))}
              </ul>
            </DashboardCard>

            {/* Learn & Contribute */}
            <DashboardCard title="Learn & Contribute" icon={LifeBuoy} action={null}>
              <div className="space-y-3">
                <ResourceLink
                  icon={Book}
                  title="Protocol-as-Code Docs"
                  href="#"
                />
                <ResourceLink
                  icon={Scale}
                  title="Regulatory Guidelines"
                  href="#"
                />
                <ResourceLink
                  icon={Github}
                  title="Contribute on GitHub"
                  href="#"
                />
              </div>
            </DashboardCard>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// Sub-components
const DashboardCard = ({ title, icon: Icon, action, children }: { title: string, icon: React.ElementType, action: {label: string, href: string} | null, children: React.ReactNode }) => (
  <motion.div
    className="bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/80 border border-border rounded-3xl shadow-elevation-1"
    variants={itemVariants}
    whileHover={{ y: -2 }}
    transition={{ duration: 0.2 }}
  >
    <div className="p-5 border-b border-border/70 flex items-center justify-between rounded-t-3xl">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/50">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
      </div>
      {action && (
        <Button variant="outline" size="sm" asChild className="rounded-xl">
          <Link href={action.href} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-xl">{action.label}</Link>
        </Button>
      )}
    </div>
    <div className="p-5">{children}</div>
  </motion.div>
);

const RepositoryCard = ({ repository }: { repository: Trial }) => {
  const progress = Math.min(100, Math.round((repository.patientEnrollment / repository.totalPatients) * 100))
  const statusVariant = repository.status === "Active" ? "success" : repository.status === "Enrolling" ? "outline" : "secondary"
  return (
    <div className="p-4 rounded-2xl border border-border bg-background/60 shadow-elevation-1 transition-shadow hover:shadow-elevation-2">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href={`/repositories/${repository.name}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
              <span className="font-medium text-foreground hover:text-primary transition-colors">{repository.name}</span>
            </Link>
            <Badge variant={statusVariant as any} className="capitalize px-2 py-0.5 rounded-full text-xs">
              {repository.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{repository.title}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">{repository.patientEnrollment} / {repository.totalPatients}</p>
          <p className="text-xs text-muted-foreground">Patients</p>
        </div>
      </div>
      <div className="mt-3 h-2.5 w-full rounded-full bg-muted">
        <div className="h-2.5 rounded-full bg-primary-500" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Users className="w-3 h-3" />
          <span>{repository.owner}</span>
        </div>
        <p>Last update: {repository.lastUpdate}</p>
      </div>
    </div>
  )
};

const ActivityItem = ({ item }: { item: Activity }) => (
  <li className="relative flex items-start gap-4">
    <span className="absolute -left-[9px] mt-1 inline-block h-2 w-2 rounded-full bg-primary-500" />
    <item.Icon className="w-4 h-4 mt-0.5 text-muted-foreground" />
    <div className="flex-1 text-sm">
      <p className="text-foreground">
        <span className="font-medium">{item.user}</span> {item.details}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
    </div>
  </li>
);

const DiscussionItem = ({ discussion }: { discussion: Discussion }) => (
  <li className="text-sm">
    <Link href="#" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
      <p className="text-foreground hover:text-primary transition-colors truncate">{discussion.title}</p>
    </Link>
    <p className="text-xs text-muted-foreground">
      in {discussion.repo} by {discussion.user}
    </p>
  </li>
);

const ResourceLink = ({ icon: Icon, title, href }: { icon: React.ElementType, title: string, href: string }) => (
  <Link href={href} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
    <Icon className="w-4 h-4 text-muted-foreground" />
    <span className="text-sm text-foreground">{title}</span>
  </Link>
);