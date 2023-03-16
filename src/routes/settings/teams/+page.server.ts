import { prisma } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const teams = prisma.team.findMany();
	return { teams };
}) satisfies PageServerLoad;
