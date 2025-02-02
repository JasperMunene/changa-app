import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'

export async function POST(req: Request) {
    const SIGNING_SECRET = process.env.SIGNING_SECRET

    if (!SIGNING_SECRET) {
      throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
    }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

   // Get headers
   const headerPayload = await headers()
   const svix_id = headerPayload.get('svix-id')
   const svix_timestamp = headerPayload.get('svix-timestamp')
   const svix_signature = headerPayload.get('svix-signature')
 
   // If there are no headers, error out
   if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', { status: 400 });
  }

  // Extract relevant user data
  const { id } = evt.data
  const { username, image_url, email_addresses } = payload.data;

  const user = {
    name: username,
    email: email_addresses?.[0]?.email_address,
    avatar_url: image_url,
  };

  try {
    const response = await fetch(`https://changa.onrender.com/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error(`Failed to update profile: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    return new Response(JSON.stringify({ error: 'Error updating profile' }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: 'User profile updated successfully' }), { status: 200 });
}
