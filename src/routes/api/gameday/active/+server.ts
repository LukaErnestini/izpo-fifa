import { prisma } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const gameday = await prisma.gameday.findFirst({ where: { active: true } });
	if (!gameday) {
		throw error(404, 'No active GameDay');
	}
	const games = await prisma.game.findMany({ where: { Gameday: gameday } });
	const activeGame = await prisma.game.findFirst({
		where: {
			AND: {
				finished: false,
				Gameday: gameday
			}
		}
	});
	// console.log('Games: ', games);
	const response = { gameday, games, activeGame };
	return new Response(JSON.stringify(response));
};
