import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// supabase config
const SUPABASE_URL = "https://rsjghyvydgadiohbaofg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzamdoeXZ5ZGdhZGlvaGJhb2ZnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTQyNDE0OSwiZXhwIjoyMDQ1MDAwMTQ5fQ.m6ahlj5ItQli2o-6X-nArttJx2ENYxUi_Ta9AMuoWLc";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
// github config
const GITHUB_API_URL = 'https://api.github.com/repos/AlgoFoe/tree-visualizer';

export async function POST(req: NextRequest){
  try {
    const payload = await req.json();
    const event = req.headers.get('x-github-event'); 

    console.log("Received event:", event);
    console.log("Payload:", payload);

    switch (event) {
      case 'watch':
      case 'fork': {
        const { data } = await axios.get(GITHUB_API_URL);
        const starsCount = data.stargazers_count;
        const forksCount = data.forks_count;

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
        const branchName = payload.ref.split('/').pop();
        const avatarUrl = payload.sender.avatar_url;
        const commitSha = payload.head_commit?.id || payload.head_commit?.sha;

        const branchColor = branchName === "main" ? 'text-green-500': 'text-yellow-700';
        
        console.log({
          message: commitMessage,
          author: commitAuthor,
          timestamp: commitTimestamp,
          sha: commitSha,
          color: 'text-slate-300',
          branch:"Branch : " + branchName,
          avatarurl: "Avatar url: " +avatarUrl,
          branchcolor:"Branch color: " +branchColor,
        });

        if (commitMessage && commitAuthor && commitTimestamp && commitSha) {
          await supabase.from('commits').insert([
            {
              message: commitMessage,
              author: commitAuthor,
              timestamp: commitTimestamp,
              sha: commitSha,
              color: 'text-slate-300',
              branch:branchName,
              avatarurl: avatarUrl, 
              branchcolor:branchColor
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
          const prSha = payload.pull_request?.merge_commit_sha;

          if (prTitle && prAuthor && prMergedAt && prSha) {
            console.log(`Changing branchcolor to green for PR: ${prTitle}, PR SHA: ${prSha}`);
            
            const { error } = await supabase
              .from('commits')
              .update({ branchcolor: 'text-green-500' })
              .eq('sha', prSha);
      
            if (error) {
              console.error('Error updating branchcolor:', error);
            } else {
              console.log('Branchcolor updated to green successfully.');
            }
          }
        }
        break;
      }

      case 'status': {
        // fetch the latest deployment details from Vercel with authorization
        const commitSha = payload.sha;
        const deploymentState = payload.state;
        const color =
        deploymentState === 'pending' ? 'text-yellow-700' :
        deploymentState === 'success' ? 'text-green-500' :
        deploymentState === 'failure' ? 'text-red-600' :
        'text-slate-300';

        if (commitSha) {
          console.log(`Updating color for commit ${commitSha} to ${color}`);

          // update the color of the matching commit
          await supabase
            .from('commits')
            .update({ color })
            .eq('sha', commitSha);
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
