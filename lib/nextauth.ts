import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import type { GetServerSidePropsContext } from 'next';
import type { Session } from 'next-auth';

/**
 * Get server-side session for protected pages
 */
export async function getServerAuthSession(
  ctx: GetServerSidePropsContext
): Promise<Session | null> {
  return await getServerSession(ctx.req, ctx.res, authOptions);
}
