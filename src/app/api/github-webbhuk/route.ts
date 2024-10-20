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
        });
        if (commitMessage && commitAuthor && commitTimestamp) {
          await supabase.from('commits').insert([
            {
              message: commitMessage,
              author: commitAuthor,
              timestamp: commitTimestamp,
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
              },
            ]);
          }
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
