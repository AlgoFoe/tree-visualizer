import React from "react";

interface Commit {
  author: string;
  message: string;
  timestamp: string;
}

const RecentCommit: React.FC<{commit: Commit; index: number }> = ({
  commit,
  index,
}) => {
  return (
    <div
      key={index}
      className="flex flex-col p-3 bg-gray-800 rounded-lg shadow-md"
    >
      <p className="text-sm">
        <span className="font-bold">{commit.author}</span> - {commit.message}
      </p>
      <p className="text-xs text-gray-400">
        {new Date(commit.timestamp).toLocaleString()}
      </p>
    </div>
  );
};

export default RecentCommit;