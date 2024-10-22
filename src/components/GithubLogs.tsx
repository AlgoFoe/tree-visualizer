"use client";
import React, { useState, useEffect } from "react";
import { FaStar, FaCodeBranch, FaDonate, FaGithub } from "react-icons/fa";
import { createClient, RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";

// Supabase configuration
const SUPABASE_URL = "https://rsjghyvydgadiohbaofg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzamdoeXZ5ZGdhZGlvaGJhb2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk0MjQxNDksImV4cCI6MjA0NTAwMDE0OX0.MIIt_s7sQbzvOGfV7pUbAXiSVubutoFn9-sPDqKrevE";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type RecentCommit = {
  message: string;
  author: string;
  timestamp: string;
  status: string;
  branch: string;
  avatar_url: string;
};

type StatsPayload = {
  type: string;
  count: number;
};

const DONATION_LINK = "https://payment-link.vercel.app";

const GithubLogs: React.FC = () => {
  const [stars, setStars] = useState<number>(0);
  const [forks, setForks] = useState<number>(0);
  const [recentCommits, setRecentCommits] = useState<RecentCommit[]>([]);

  const topDonors = [
    { name: "Varun Singh", amount: "₹1200", message: "Loved to contribute" },
    { name: "Ben Dover", amount: "₹1000", message: "God's work" },
  ];

  // Fetch initial data from Supabase
  const fetchInitialData = async () => {
    try {
      const { data: statsData } = await supabase.from("stats").select("type, count");
      const { data: commitsData } = await supabase
        .from("commits")
        .select("message, author, timestamp, status, branch, avatar_url")
        .order("timestamp", { ascending: false })
        .limit(5);

      const starsData = statsData?.find((item): item is StatsPayload => item.type === "stars");
      const forksData = statsData?.find((item): item is StatsPayload => item.type === "forks");

      setStars(starsData?.count || 0);
      setForks(forksData?.count || 0);
      setRecentCommits(commitsData || []);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();

    // Subscription for real-time updates on 'stats' table
    const statsSubscription = supabase
      .channel("realtime:public:stats")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "stats" },
        (payload: RealtimePostgresChangesPayload<StatsPayload>) => {
          if (payload.eventType === "UPDATE" && isStatsPayload(payload.new)) {
            if (payload.new.type === "stars") {
              setStars(payload.new.count);
            } else if (payload.new.type === "forks") {
              setForks(payload.new.count);
            }
          }
        }
      )
      .subscribe();

    // Subscription for real-time updates on 'commits' table
    const commitsSubscription = supabase
      .channel("realtime:public:commits")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "commits" },
        (payload: RealtimePostgresChangesPayload<RecentCommit>) => {
          if (payload.eventType === "INSERT" && isRecentCommit(payload.new)) {
            setRecentCommits((prevCommits) => [
              payload.new,
              ...prevCommits.slice(0, 4),
            ]);
          }
        }
      )
      .subscribe();

    // Clean up subscriptions on component unmount
    return () => {
      supabase.removeChannel(statsSubscription);
      supabase.removeChannel(commitsSubscription);
    };
  }, []);

  // Type-guard for StatsPayload
  function isStatsPayload(obj: unknown): obj is StatsPayload {
    return (
      typeof obj === "object" &&
      obj !== null &&
      "type" in obj &&
      "count" in obj &&
      typeof (obj as StatsPayload).type === "string" &&
      typeof (obj as StatsPayload).count === "number"
    );
  }

  // Type-guard for RecentCommit
  function isRecentCommit(obj: unknown): obj is RecentCommit {
    return (
      typeof obj === "object" &&
      obj !== null &&
      "message" in obj &&
      "author" in obj &&
      "timestamp" in obj &&
      "status" in obj &&
      "branch" in obj &&
      "avatar_url" in obj &&
      typeof (obj as RecentCommit).message === "string" &&
      typeof (obj as RecentCommit).author === "string" &&
      typeof (obj as RecentCommit).timestamp === "string"
    );
  }

  return (
    <div className="flex flex-col p-4 text-white h-full font-mono">
      {/* Repo Stats Section */}
      <div className="p-4 bg-gray-800 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-bold text-emerald-400">TreeVisualizer Repo Stats</h2>
        <div className="flex items-center gap-1 justify-between mt-2">
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            <span>Stars: {stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaCodeBranch className="text-cyan-400" />
            <span>Forks: {forks}</span>
          </div>
          <Link href="https://github.com/AlgoFoe/tree-visualizer" target="_blank">
            <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-1 hover:bg-gray-600">
              <span>Contribute now</span>
              <FaGithub />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Commits Section */}
      <div className="bg-gray-900 rounded-lg shadow-md p-3">
        <h2 className="text-lg font-bold mb-2 text-emerald-400">Recent Commits</h2>
        <div className="space-y-3 overflow-auto min-h-fit">
          {recentCommits.length > 0 ? (
            recentCommits.map((commit, index) => (
              <div
                key={index}
                className={`flex flex-col p-2 bg-gray-800 rounded-lg shadow-sm ${
                  commit.status === "pending" ? "text-orange-500" : commit.status === "success" ? "text-green-500" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <Image src={"data:image/png;base64,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"} width={80} height={80} alt="Avatar" className="w-8 h-8 rounded-full" />
                  <p className="text-sm font-bold">{commit.author}</p>
                  <span className="text-xs ml-2 text-gray-400">{commit.branch}</span>
                </div>
                <p className="text-sm">{commit.message}</p>
                <p className="text-xs text-gray-400">{new Date(commit.timestamp).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p className="text-slate-400">No recent commits</p>
          )}
        </div>
      </div>

      {/* Donation Section */}
      <div className="bg-gray-800 rounded-t-lg shadow-md p-3 mt-4 h-full">
        <h2 className="text-lg font-bold text-emerald-400">Plant a Tree</h2>
        <p className="text-sm text-gray-400">Top donors</p>
        <div className="space-y-1 mt-2">
          {topDonors.map((donor, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="font-bold">
                  {index + 1}. {donor.name}
                </p>
                <p className="text-xs text-gray-400">message - {donor.message}</p>
              </div>
              <span className="text-cyan-400 font-bold">{donor.amount}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-b-lg shadow-md p-3">
        <Link href={DONATION_LINK} target="_blank">
          <div className="flex items-center justify-center mt-3 bg-teal-600 text-white py-1 px-3 rounded-lg w-full">
            <FaDonate className="mr-2" /> Donate Now
          </div>
        </Link>
      </div>
    </div>
  );
};

export default GithubLogs;
