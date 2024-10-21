// "use client";
// import React, { useState, useEffect } from "react";
// import { FaStar, FaCodeBranch, FaDonate } from "react-icons/fa";
// import axios from "axios";
// import Image from "next/image";
// import Link from "next/link";

// type GitHubEvent = {
//   id: string;
//   type: string;
//   actor: { login: string; avatar_url: string };
//   repo: { name: string };
//   payload: { commits?: { message: string }[] };
//   created_at: string;
// };

// const API_URL = "https://tree-visualizer-six-nine.vercel.app/api/github-webbhuk";
// const DONATION_LINK = "https://payment-link.vercel.app";

// const GithubLogs: React.FC = () => {
//   const [stars, setStars] = useState(0);
//   const [forks, setForks] = useState(0);
//   const [events, setEvents] = useState<GitHubEvent[]>([]);
//   const topDonors = [
//     { name: "Varun Singh", amount: "₹1200", message: "Loved to contribute" },
//     { name: "Ben Dover", amount: "₹1000", message: "God's work" },
//   ];

//   useEffect(() => {
//     fetchRepoStats();
//     fetchRecentEvents();
//   }, []);

//   const fetchRepoStats = async () => {
//     try {
//       const { data } = await axios.get(API_URL);
//       setStars(data.stargazers_count);
//       setForks(data.forks_count);
//     } catch (error) {
//       console.error("Failed to fetch GitHub stats", error);
//     }
//   };

//   const fetchRecentEvents = async () => {
//     try {
//       const { data } = await axios.get(
//         `https://api.github.com/repos/AlgoFoe/tree-visualizer/events`
//       );
//       setEvents(data.slice(0, 5)); // get last 5 events
//     } catch (error) {
//       console.error("Failed to fetch GitHub events", error);
//     }
//   };

//   return (
//     <div className="flex flex-col p-4 text-white h-full">
//       <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow-md mb-4">
//         <h2 className="text-lg font-bold text-emerald-400">
//           TreeVisualizer Repo Stats
//         </h2>
//         <div className="flex items-center justify-between w-full mt-2">
//           <div className="flex items-center gap-2">
//             <FaStar className="text-yellow-400" />
//             <span>Stars: {stars}</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <FaCodeBranch className="text-cyan-400" />
//             <span>Forks: {forks}</span>
//           </div>
//           <Link
//             href="https://github.com/AlgoFoe/tree-visualizer"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-sky-400 font-bold"
//           >
//             Contribute now
//           </Link>
//         </div>
//       </div>

//       <div className="bg-gray-900 rounded-lg shadow-md p-3">
//         <h2 className="text-lg font-bold mb-2 text-emerald-400">
//           GitHub Audit Logs
//         </h2>
//         <div className="space-y-2 overflow-auto h-40">
//           {events.length > 0 ? (
//             events.map((event) => (
//               <div
//                 key={event.id}
//                 className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg shadow-sm"
//               >
//                 <Image
//                   src={event.actor.avatar_url}
//                   width={80}
//                   height={80}
//                   alt="avatar"
//                   className="w-8 h-8 rounded-full"
//                 />
//                 <div>
//                   <p className="text-sm">
//                     <span className="font-bold">{event.actor.login}</span> -{" "}
//                     {event.type}
//                   </p>
//                   {event.payload.commits && (
//                     <p className="text-xs text-gray-400">
//                       {event.payload.commits[0]?.message}
//                     </p>
//                   )}
//                   <p className="text-xs text-gray-400">
//                     {new Date(event.created_at).toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">No recent events</p>
//           )}
//         </div>
//       </div>

//       <div className="bg-gray-800 rounded-t-lg shadow-md p-3 mt-4 h-full">
//         <h2 className="text-lg font-bold text-emerald-400">Plant a Tree</h2>
//         <p className="text-sm text-gray-400">Top donors</p>
//         <div className="space-y-1 mt-2">
//           {topDonors.map((donor, index) => (
//             <div key={index} className="flex justify-between items-center">
//               <div>
//                 <p className="font-bold">
//                   {index + 1}. {donor.name}
//                 </p>
//                 <p className="text-xs text-gray-400">
//                   message - {donor.message}
//                 </p>
//               </div>
//               <span className="text-cyan-400 font-bold">{donor.amount}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="bg-gray-800 rounded-b-lg shadow-md p-3">
//         <Link
//           href={DONATION_LINK}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="flex items-center justify-center mt-3 bg-teal-600 text-white py-1 px-3 rounded-lg w-full"
//         >
//           <FaDonate className="mr-2" /> Donate Now
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default GithubLogs;
"use client";
import React, { useState, useEffect } from "react";
import { FaStar, FaCodeBranch, FaDonate, FaGithub } from "react-icons/fa";
import { createClient, RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import Link from "next/link";

const SUPABASE_URL = "https://rsjghyvydgadiohbaofg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzamdoeXZ5ZGdhZGlvaGJhb2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk0MjQxNDksImV4cCI6MjA0NTAwMDE0OX0.MIIt_s7sQbzvOGfV7pUbAXiSVubutoFn9-sPDqKrevE";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type RecentCommit = {
  message: string;
  author: string;
  timestamp: string;
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
        .select("message, author, timestamp")
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
    console.log("SUPABASE_KEYS : ",SUPABASE_URL,SUPABASE_ANON_KEY)
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

  // type-guard for RecentCommit
  function isRecentCommit(obj: unknown): obj is RecentCommit {
    return (
      typeof obj === "object" &&
      obj !== null &&
      "message" in obj &&
      "author" in obj &&
      "timestamp" in obj &&
      typeof (obj as RecentCommit).message === "string" &&
      typeof (obj as RecentCommit).author === "string" &&
      typeof (obj as RecentCommit).timestamp === "string"
    );
  }

  return (
    <div className="flex flex-col p-4 text-white h-full">
      <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-bold text-emerald-400">TreeVisualizer Repo Stats</h2>
        <div className="flex items-center justify-between w-full mt-2">
          <div className="flex items-center gap-2">
            <FaStar className="text-yellow-400" />
            <span>Stars: {stars}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCodeBranch className="text-cyan-400" />
            <span>Forks: {forks}</span>
          </div>
          <Link
            href="https://github.com/AlgoFoe/tree-visualizer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 font-bold"
          >
            <div className="flex items-center justify-center gap-2 bg-gray-700 rounded-lg p-1 hover:bg-gray-600">
              <span>Contribute now</span>
              <span>
                <FaGithub />
              </span>
            </div>
          </Link>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg shadow-md p-3">
        <h2 className="text-lg font-bold mb-2 text-emerald-400">Recent Commits</h2>
        <div className="space-y-2 overflow-auto h-40">
          {recentCommits.length > 0 ? (
            recentCommits.map((commit, index) => (
              <div key={index} className="flex flex-col p-2 bg-gray-800 rounded-lg shadow-sm">
                <p className="text-sm">
                  <span className="font-bold">{commit.author}</span> - {commit.message}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(commit.timestamp).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No recent commits</p>
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
