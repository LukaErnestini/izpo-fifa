import { prisma } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const players = await prisma.player.findMany();
	// console.log(players);
	return { players };
}) satisfies PageServerLoad;
