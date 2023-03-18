import { prisma } from '$lib/server/db';
import { Prisma, type Game } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	create: async ({ request }) => {
		try {
			const data = await request.formData();
			const players = await data.getAll('players[]').map((id) => {
				return { id: +id };
			});
			// console.log(players);
			const activeGameday = await prisma.gameday.findFirst({ where: { active: true } });
			if (activeGameday) {
				throw error(409, 'Active gameday already exists. Finish it first.');
			}
			const gameday = await prisma.gameday.create({
				data: { players: { connect: players } }
			});
			return { gameday };
		} catch (error) {
			console.log(error);
		}
	},
	end: async ({ request }) => {
		const data = await request.formData();
		const id = (await data.get('id')) as string;

		try {
			const gameday = await prisma.gameday.update({
				where: { id: +id },
				data: {
					active: false
				}
			});
			return {};
		} catch (error) {
			console.log(error);
		}
	},
	createGame: async ({ request, fetch }) => {
		try {
			const data = await request.formData();
			const team1players = data.getAll('team1').map((e) => {
				return +e;
			});
			const team2players = data.getAll('team2').map((e) => {
				return +e;
			});
			const team1 = await prisma.team.findFirst({
				where: { players: { every: { id: { in: team1players } } } }
			});
			const team2 = await prisma.team.findFirst({
				where: { players: { every: { id: { in: team2players } } } }
			});
			const gameday = await prisma.gameday.findFirst({ where: { active: true } });
			const game = await prisma.game.create({
				data: {
					gamedayId: gameday?.id,
					teams: { connect: [{ id: team1?.id }, { id: team2?.id }] }
				},
				include: { teams: true }
			});
			return { game };
		} catch (error) {
			console.log(error);
		}
	},
	attempt: async ({ request }) => {
		try {
			const data = await request.formData();
			const goal = data.get('goal') ? true : false;
			const onTarget = data.get('onTarget') ? true : false;
			const penalty = data.get('penalty') ? true : false;
			const time = data.get('time') ? +(data.get('time') as string) : null;
			const distance = data.get('distance') ? +(data.get('distance') as string) : null;
			const shooterId = data.get('shooter') ? +(data.get('shooter') as string) : undefined;
			const assistedId = data.get('assisted') ? +(data.get('assisted') as string) : undefined;
			const goalieId = data.get('goalie') ? +(data.get('goalie') as string) : undefined;
			const gameId = data.get('gameId') ? +(data.get('gameId') as string) : undefined;
			const attempt = await prisma.attempt.create({
				data: {
					goal,
					onTarget,
					penalty,
					time,
					distance,
					shooter: { connect: { id: shooterId } },
					assisted: assistedId ? { connect: { id: assistedId } } : undefined,
					goalie: goalieId ? { connect: { id: goalieId } } : undefined,
					Game: { connect: { id: gameId } }
				}
			});
			return { attempt };
		} catch (error) {
			console.log(error);
		}
	},
	endGame: async ({ request }) => {
		try {
			const activeGameday = await prisma.gameday.findFirst({ where: { active: true } });
			const activeGame = await prisma.game.findFirst({
				where: {
					AND: {
						finished: false,
						Gameday: activeGameday
					}
				}
			});
			const game = await prisma.game.update({
				where: { id: activeGame?.id },
				data: { finished: true }
			});
			return { game };
		} catch (error) {
			console.log(error);
		}
	},
	removeLog: async ({ request }) => {
		try {
			const data = await request.formData();
			const id = +(data.get('id') as string);
			await prisma.attempt.delete({ where: { id } });
		} catch (error) {
			console.log(error);
		}
	}
} satisfies Actions;
