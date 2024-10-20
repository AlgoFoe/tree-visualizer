import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const GITHUB_API_URL = 'https://api.github.com/repos/AlgoFoe/tree-visualizer';

let starsCount = 0;
let forksCount = 0;

type CommitInfo = {
  message: string;
  author: string;
  timestamp: string;
};

const recentCommits: CommitInfo[] = [];

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const event = req.headers.get('x-github-event');
    console.log({ Event: event, Payload: payload });

    switch (event) {
      case 'push':
        const commitMessage = payload.head_commit?.message;
        const commitAuthor = payload.pusher?.name;
        const commitTimestamp = payload.head_commit?.timestamp;

        console.log(`Push event: ${commitMessage} by ${commitAuthor}`);

        if (commitMessage && commitAuthor && commitTimestamp) {
          recentCommits.unshift({
            message: commitMessage,
            author: commitAuthor,
            timestamp: commitTimestamp,
          });

          if (recentCommits.length > 5) recentCommits.pop();
        }
        break;

      case 'pull_request':
        if (payload.action === 'closed' && payload.pull_request?.merged) {
          const prTitle = payload.pull_request?.title;
          const prAuthor = payload.pull_request?.user?.login;
          const prMergedAt = payload.pull_request?.merged_at;

          console.log(`PR merged: ${prTitle} by ${prAuthor}`);

          if (prTitle && prAuthor && prMergedAt) {
            recentCommits.unshift({
              message: `PR merged: ${prTitle}`,
              author: prAuthor,
              timestamp: prMergedAt,
            });

            if (recentCommits.length > 5) recentCommits.pop();
          }
        }
        break;

      case 'watch':
        console.log(`New star by: ${payload.sender?.login}`);
        starsCount += 1;
        break;

      case 'fork':
        console.log(`Repository forked by: ${payload.forkee?.owner?.login}`);
        forksCount += 1;
        break;

      default:
        console.log(`Unhandled event: ${event}`);
    }

    return NextResponse.json({ message: 'Webhook received' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ message: 'Error processing webhook' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data: repoData } = await axios.get(GITHUB_API_URL);

    const stars = repoData.stargazers_count || starsCount;
    const forks = repoData.forks_count || forksCount;

    return NextResponse.json({
      stars,
      forks,
      recentCommits,
    });
  } catch (error) {
    console.error('Error fetching GitHub data:', error);

    return NextResponse.json(
      {
        stars: starsCount,
        forks: forksCount,
        recentCommits,
      },
      { status: 200 }
    );
  }
}
