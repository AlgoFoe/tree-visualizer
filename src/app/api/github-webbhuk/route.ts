import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// configuring supabase
const SUPABASE_URL = "https://rsjghyvydgadiohbaofg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzamdoeXZ5ZGdhZGlvaGJhb2ZnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTQyNDE0OSwiZXhwIjoyMDQ1MDAwMTQ5fQ.m6ahlj5ItQli2o-6X-nArttJx2ENYxUi_Ta9AMuoWLc";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
console.log("URL : ",SUPABASE_URL);
const GITHUB_API_URL = 'https://api.github.com/repos/AlgoFoe/tree-visualizer';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const event = req.headers.get('x-github-event');

    console.log("Payload : ", payload);

    switch (event) {
      case 'watch':
      case 'fork': {
        const { data } = await axios.get(GITHUB_API_URL);
        const starsCount = data.stargazers_count;
        const forksCount = data.forks_count;

        console.log({"stars" : starsCount,"forks" : forksCount});
        // update and insert
        await supabase.from('stats').upsert(
          [
            { type: 'stars', count: starsCount },
            { type: 'forks', count: forksCount }
          ],
          { onConflict: 'type' }
        );
        break;
      }

      case 'push': {
        const commitMessage = payload.head_commit?.message;
        const commitAuthor = payload.pusher?.name;
        const commitTimestamp = payload.head_commit?.timestamp;
        console.log({
          message: commitMessage,
          author: commitAuthor,
          timestamp: commitTimestamp,
          status: 'default', 
          branch: payload.ref?.replace('refs/heads/', '') || 'unknown',
          avatar_url: payload.sender?.avatar_url,
        });
        if (commitMessage && commitAuthor && commitTimestamp) {
          await supabase.from('commits').insert([
            {
              message: commitMessage,
              author: commitAuthor,
              timestamp: commitTimestamp,
              status: 'default', 
              branch: payload.ref?.replace('refs/heads/', '') || 'unknown',
              avatar_url: payload.sender?.avatar_url,
            },
          ]);
        }
        break;
      }

      case 'pull_request': {
        if (payload.action === 'closed' && payload.pull_request?.merged) {
          const prTitle = payload.pull_request?.title;
          const prAuthor = payload.pull_request?.user?.login;
          const prMergedAt = payload.pull_request?.merged_at;

          if (prTitle && prAuthor && prMergedAt) {
            await supabase.from('commits').insert([
              {
                message: `PR merged: ${prTitle}`,
                author: prAuthor,
                timestamp: prMergedAt,
                status: 'default',
                branch: payload.pull_request?.base?.ref || 'unknown',
                avatar_url: payload.pull_request?.user?.avatar_url,
              },
            ]);
          }
        }
        break;
      }
      case 'status':{
        const commitSha = payload.commit?.sha;
        const statusState = payload.state;
        const commitMessage = payload.commit?.commit?.message;
        const commitAuthor = payload.commit?.author?.login;
        const commitTimestamp = payload.commit?.commit?.author?.date;
        const branchName = payload.branches?.[0]?.name || 'unknown';
        const avatarUrl = payload.commit?.author?.avatar_url;

        let statusColor = 'default';
        if (statusState === 'pending') statusColor = 'orange';
        if (statusState === 'success') statusColor = 'green';

        if (commitSha) {
          await supabase
            .from('commits')
            .upsert(
              {
                message: commitMessage,
                author: commitAuthor,
                timestamp: commitTimestamp,
                status: statusColor,
                branch: branchName,
                avatar_url: avatarUrl,
                sha: commitSha,
              },
              { onConflict: 'sha' }
            );
        }
        
        break;
      }
      default:
        console.log(`Unhandled event: ${event}`);
    }

    return NextResponse.json({ message: 'Webhook data processed and stored' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { message: 'Error processing webhook' },
      { status: 500 }
    );
  }
}
