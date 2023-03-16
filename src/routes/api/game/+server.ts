import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return new Response();
};

export const POST: RequestHandler = async ({ fetch }) => {
	const gameday = await (await fetch('/api/gameday/active')).json();
	console.log(gameday);
	return new Response();
};
