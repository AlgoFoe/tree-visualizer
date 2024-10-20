import { NextRequest, NextResponse } from 'next/server';

let starsCount = 0;
let forksCount = 0;

type CommitInfo = {
  message: string;
  author: string;
  timestamp: string;
};

const recentCommits: CommitInfo[] = [];
const sseClients: TransformStream[] = [];

type SSEData =
  | { type: 'stars'; count: number }
  | { type: 'forks'; count: number }
  | { type: 'recentCommits'; commits: CommitInfo[] };

// broadcast data to all clients
const broadcastToClients = (data: SSEData) => {
  const message = `data: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => {
    const writer = client.writable.getWriter();
    writer.write(new TextEncoder().encode(message));
    writer.close();
  });
};

// handle github webhook events
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

        if (commitMessage && commitAuthor && commitTimestamp) {
          recentCommits.unshift({
            message: commitMessage,
            author: commitAuthor,
            timestamp: commitTimestamp,
          });

          if (recentCommits.length > 5) recentCommits.pop();

          broadcastToClients({ type: 'recentCommits', commits: recentCommits });
        }
        break;

      case 'pull_request':
        if (payload.action === 'closed' && payload.pull_request?.merged) {
          const prTitle = payload.pull_request?.title;
          const prAuthor = payload.pull_request?.user?.login;
          const prMergedAt = payload.pull_request?.merged_at;

          if (prTitle && prAuthor && prMergedAt) {
            recentCommits.unshift({
              message: `PR merged: ${prTitle}`,
              author: prAuthor,
              timestamp: prMergedAt,
            });

            if (recentCommits.length > 5) recentCommits.pop();

            broadcastToClients({ type: 'recentCommits', commits: recentCommits });
          }
        }
        break;

      case 'watch':
        starsCount += 1;
        broadcastToClients({ type: 'stars', count: starsCount });
        break;

      case 'fork':
        forksCount += 1;
        broadcastToClients({ type: 'forks', count: forksCount });
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

// my SSE endpoint for real-time updates
export async function GET() {
  const { readable, writable } = new TransformStream();
  sseClients.push({ readable, writable });

  const encoder = new TextEncoder();
  const initData = [
    encoder.encode(`data: ${JSON.stringify({ type: 'stars', count: starsCount })}\n\n`),
    encoder.encode(`data: ${JSON.stringify({ type: 'forks', count: forksCount })}\n\n`),
    encoder.encode(`data: ${JSON.stringify({ type: 'recentCommits', commits: recentCommits })}\n\n`),
  ];

  initData.forEach((data) => writable.getWriter().write(data));

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
