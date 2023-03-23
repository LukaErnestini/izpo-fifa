import { prisma } from '$lib/server/db';
import { error, fail, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const game = await prisma.game.findFirst({
		where: { id: +params.id },
		include: {
			attempts: true,
			fouls: true,
			teams: {
				include: {
					players: true
				}
			},
			winner: true
		}
	});
	if (!game) {
		throw error(404, { message: 'Game not found' });
	}
	return json(game);
};
