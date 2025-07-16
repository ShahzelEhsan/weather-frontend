// lib/nextauth.ts
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';  // Import from clean path without brackets
import type { GetServerSidePropsContext } from 'next';
import type { Session } from 'next-auth';

/**
 * Helper to get the session on server side in getServerSideProps or API routes
 */
export async function getServerAuthSession(
  ctx: GetServerSidePropsContext
): Promise<Session | null> {
  return await getServerSession(ctx.req, ctx.res, authOptions);
}
