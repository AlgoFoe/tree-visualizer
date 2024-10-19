import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const event = req.headers.get('x-github-event');
    console.log({"Event" : event,"Payload" : payload});
    console.log("Pusher details : ",payload.pusher);
    switch (event) {
      case 'push':
        console.log(`Push event: ${payload.head_commit?.message} by ${payload.pusher?.name}`);
        break;
      case 'pull_request':
        if (payload.action === 'closed' && payload.pull_request?.merged) {
          console.log(`PR merged: ${payload.pull_request?.title} by ${payload.pull_request?.user?.login}`);
        }
        break;
      case 'watch':
        console.log(`New star by: ${payload.sender?.login}`);
        break;
      case 'fork':
        console.log(`Repository forked by: ${payload.forkee?.owner?.login}`);
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
