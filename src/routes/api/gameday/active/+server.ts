import { prisma } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const gameday = await prisma.gameday.findFirst({ where: { active: true } });
	if (!gameday) {
		return new Response('Not found', { status: 404 });
	}
	return new Response(JSON.stringify(gameday));
};
