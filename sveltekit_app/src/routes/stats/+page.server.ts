import { prisma } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	// top 3 red cards
	const redFouls = await prisma.foul.findMany({ where: { card: 'red' } });
	console.log(redFouls);

	return {};
}) satisfies PageServerLoad;
