import { prisma } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const players = await prisma.player.findMany();
	if (!players.length) {
		return new Response('No players found', { status: 404 });
	}
	return new Response(JSON.stringify(players));
};
