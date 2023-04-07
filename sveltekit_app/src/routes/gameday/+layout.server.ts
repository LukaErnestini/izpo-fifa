import { prisma } from '$lib/server/db';
import type { LayoutServerLoad } from './$types';

export const load = (async () => {
	const gameday = await prisma.gameday.findFirst({
		where: { active: true },
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
	const finishedGamedays = await prisma.gameday.findMany({
		where: { active: false },
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
	if (!gameday) {
		const players = await prisma.player.findMany();
		return { players, gameday: null, activeGame: null, finishedGamedays };
	}
	const activeGame = await prisma.game.findFirst({
		where: {
			AND: {
				finished: false,
				gamedayId: gameday.id
			}
		},
		include: {
			teamA: { include: { players: true } },
			teamB: { include: { players: true } },
			attempts: {
				orderBy: { id: 'desc' },
				include: { shooter: true }
			},
			fouls: {
				orderBy: { id: 'desc' },
				include: { player: true }
			}
		}
	});
	// console.log(activeGame?.attempts.length);
	return { gameday, activeGame, finishedGamedays };
}) satisfies LayoutServerLoad;
