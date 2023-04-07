import { prisma } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const gameday = await prisma.gameday.findFirst({
		where: { id: +params.id },
		include: {
			games: {
				include: {
					teamA: true,
					teamB: true,
					winner: true
				},
				orderBy: { id: 'asc' }
			},
			players: true
		}
	});
	return { gameday };
}) satisfies PageServerLoad;
