import { prisma } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const attempts = await prisma.attempt.findMany();
	return json(attempts);
};
