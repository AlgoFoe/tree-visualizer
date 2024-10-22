import React from "react";
import { FiGitBranch, FiGitCommit } from "react-icons/fi";

interface Commit {
  author: string;
  message: string;
  timestamp: string;
}
// committer's name: commit.author 
// commit message: commit.message
// commit date and time: commit.timestamp
const RecentCommit: React.FC<{commit: Commit; index: number }> = ({
  commit,
  index,
}) => {
  return (
    <div key={index} className="flex p-1.5 bg-gray-800 rounded-lg shadow-md min-w-fit">
      <div className="flex flex-col text-slate-300">
        <div className="flex gap-1">
            <FiGitCommit className="w-6 h-6 text-green-500 text-yellow-600" />
            <p className="overflow-hidden w-64 text-ellipsis">{commit.message}</p>
        </div>
        <div className="flex gap-2">
            <FiGitBranch className="w-5 h-5" />
            <p>branch name</p>
        </div>
      </div>
      <div className="flex flex-col gap-1 items-end justify-around max-xl:hidden">
            <div className="flex justify-center items-center gap-2">
                <p className="text-sm font-bold text-gray-400">{commit.author}</p>
                <div className="rounded-full bg-red-200 w-7 h-7"></div>
            </div>
            <div className="text-sm">
                <p className="text-nowrap text-gray-400">{commit.timestamp}</p>
            </div>
      </div>
    </div>
  );
};

export default RecentCommit;