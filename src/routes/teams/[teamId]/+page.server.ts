import { prisma } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const team = prisma.team.findFirst({ where: { id: +params.teamId } });
	return { team };
}) satisfies PageServerLoad;
