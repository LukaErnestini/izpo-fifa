import { prisma } from '$lib/server/db';
import type { LayoutServerLoad } from './$types';

export const load = (async () => {
	const gameday = await prisma.gameday.findFirst({
		where: { active: true },
		include: { games: true, players: true }
	});
	if (!gameday) {
		const players = await prisma.player.findMany();
		return { players, gameday: null, activeGame: null };
	}
	const activeGame = await prisma.game.findFirst({
		where: {
			AND: {
				finished: false,
				gamedayId: gameday.id
			}
		},
		include: {
			teams: { include: { players: true } },
			attempts: { orderBy: { id: 'desc' } }
		}
	});
	// console.log(activeGame?.attempts.length);
	return { gameday, activeGame };
}) satisfies LayoutServerLoad;
