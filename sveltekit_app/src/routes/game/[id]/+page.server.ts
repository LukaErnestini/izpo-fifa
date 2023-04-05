import { prisma } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const game = await prisma.game.findFirst({
		where: { id: +params.id },
		include: {
			attempts: { include: { shooter: true, assisted: true } },
			fouls: true,
			teamA: { include: { players: true } },
			teamB: { include: { players: true } },
			winner: true
		}
	});
	if (!game) {
		throw error(404, { message: 'Game not found' });
	}
	// Add teamId to each attempt
	const teams = [game.teamA, game.teamB];
	game.attempts = game.attempts.map((attempt) => {
		// Find the team the shooter belongs to
		const team = teams.find((team) =>
			team.players.some((player) => player.id === attempt.shooterId)
		);
		return {
			...attempt,
			teamId: team?.id
		};
	});
	return { game };
}) satisfies PageServerLoad;

export const actions = {
	remove: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id') ? +(data.get('id') as string) : undefined;
		console.log('removing game with id ' + id);
		const deleteAttempts = prisma.attempt.deleteMany({ where: { gameId: id } });
		const deleteFouls = prisma.foul.deleteMany({ where: { gameId: id } });
		const deleteGames = prisma.game.delete({ where: { id } });
		const transaction = await prisma.$transaction([deleteAttempts, deleteFouls, deleteGames]);
		throw redirect(301, '/gameday');
	}
} satisfies Actions;
