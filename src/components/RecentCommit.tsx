import Image from "next/image";
import React from "react";
import { FiGitBranch, FiGitCommit } from "react-icons/fi";

interface Commit {
  author: string;
  message: string;
  timestamp: string;
  color: string;
  branch: string; 
  branchcolor:string;
  avatarurl: string;  
}

const RecentCommit: React.FC<{commit: Commit; index: number }> = ({
  commit,
  index,
}) => {
  console.log("Commit color: "+ commit.color+" commit message: "+ commit.message);
  return (
    <div key={index} className="flex p-1.5 bg-gray-800 rounded-lg shadow-md min-w-fit">
      <div className="flex flex-col text-slate-300">
        <div className="flex gap-1">
            <FiGitCommit className={`w-6 h-6 ${commit.color}`} />
            <p className="overflow-hidden w-64 text-ellipsis">{commit.message}</p>
        </div>
        <div className="flex gap-2">
            <FiGitBranch className={`w-5 h-5 ${commit.branchcolor}`} />
            <p>{commit.branch}</p>
        </div>
      </div>
      <div className="flex flex-col gap-1 items-end justify-around max-xl:hidden">
          <div className="flex justify-center items-center gap-2">
              <p className="text-sm font-bold text-gray-400">{commit.author}</p>
              <Image src={commit.avatarurl ? commit.avatarurl:'/profile.jpeg'} alt="avatar" width={80} height={80} className="rounded-full w-9 h-9" />
          </div>
          <div className="text-sm">
              <p className="text-nowrap text-gray-400">{commit.timestamp}</p>
          </div>
      </div>
    </div>
  );
};

export default RecentCommit;