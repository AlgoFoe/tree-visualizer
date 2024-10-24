"use client";
import React, { useState, useEffect } from "react";
import { FaStar, FaCodeBranch, FaDonate, FaGithub } from "react-icons/fa";
import { createClient, RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import Link from "next/link";
import RecentCommit from './RecentCommit'

const SUPABASE_URL = "https://rsjghyvydgadiohbaofg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzamdoeXZ5ZGdhZGlvaGJhb2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk0MjQxNDksImV4cCI6MjA0NTAwMDE0OX0.MIIt_s7sQbzvOGfV7pUbAXiSVubutoFn9-sPDqKrevE";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type RecentCommit = {
  message: string;
  author: string;
  timestamp: string;
  sha: string;
  color: string; 
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

  const fetchInitialData = async () => {
    try {
      const { data: statsData } = await supabase.from("stats").select("type, count");
      const { data: commitsData } = await supabase
        .from("commits")
        .select("message, author, timestamp, sha, color")
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
    // console.log("SUPABASE_KEYS : ",SUPABASE_URL,SUPABASE_ANON_KEY)
    fetchInitialData();

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

      const commitsSubscription = supabase
      .channel("realtime:public:commits")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "commits" },
        (payload: RealtimePostgresChangesPayload<RecentCommit>) => {
          if (payload.eventType === "INSERT" && payload.new) {
            
            // insert new commit with default color
            setRecentCommits((prevCommits) => [
              { ...payload.new, color: payload.new.color || 'text-slate-300' },
              ...prevCommits.slice(0, 4),
            ]);
          } else if (payload.eventType === "UPDATE" && payload.new) {
            
            // update commit color based on new state
            setRecentCommits((prevCommits) =>
              prevCommits.map((commit) =>
                commit.sha === payload.new.sha ? { ...commit, color: payload.new.color } : commit
              )
            );
          }
        }
      )
      .subscribe();
    
    // clean up subscriptions
    return () => {
      supabase.removeChannel(statsSubscription);
      supabase.removeChannel(commitsSubscription);
    };
  }, []);

  // type-guard for StatsPayload
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

  return (
    <div className="flex flex-col p-4 text-white h-full font-mono selection:bg-green-700">
      <div className="p-4 bg-gray-800 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-bold text-emerald-400">TreeVisualizer Repo Stats</h2>
        <div className="flex items-center gap-1 justify-between mt-2 overflow-hidden">
          <div className="flex items-center gap-1 justify-center"> 
            <FaStar className="text-yellow-400" />
            <span>Stars: </span>
            <span>{stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaCodeBranch className="text-cyan-400" />
            <span>Forks: </span>
            <span>{forks}</span>
          </div>
          <Link
            href="https://github.com/AlgoFoe/tree-visualizer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 font-bold"
          >
            <div className="flex items-center justify-center gap-2 bg-gray-700 rounded-lg p-1.5 hover:bg-gray-600">
              <span className="block max-xl:hidden">Contribute now</span>
              <span className="hidden max-xl:block max-lg:hidden">Visit</span>
              <span>
                <FaGithub />
              </span>
            </div>
          </Link>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg shadow-md p-3">
        <h2 className="text-lg font-bold mb-2 text-emerald-400">Recent Commits</h2>
        <div className="space-y-3 overflow-auto min-h-fit">
          {recentCommits.length > 0 ? (
            recentCommits.map((commit, index) => (
              <RecentCommit key={index} commit={commit} index={index} />
            ))
          ) : (
            <p className="text-slate-400">No recent commits</p>
          )}
        </div>
      </div>

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
        <Link
          href={DONATION_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center mt-3 bg-teal-600 text-white py-1 px-3 rounded-lg w-full"
        >
          <FaDonate className="mr-2" /> Donate Now
        </Link>
      </div>
    </div>
  );
};

export default GithubLogs;