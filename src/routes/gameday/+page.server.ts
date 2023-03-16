import { prisma } from '$lib/server/db';
import type { Game } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	create: async ({ request }) => {
		try {
			// const data = await request.formData();
			// const players = await data.getAll('players[]');
			// console.log(players);
			const activeGameday = await prisma.gameday.findFirst({ where: { active: true } });
			if (activeGameday) {
				throw error(409, 'Active gameday already exists. Finish it first.');
			}
			const gameday = await prisma.gameday.create({ data: {} });
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
			const { gameday } = await (await fetch('/api/gameday/active')).json();
			// console.log(gameday);
			const game = await prisma.game.create({ data: { gamedayId: gameday.id } });
			return { game };
		} catch (error) {
			console.log(error);
		}
	}
} satisfies Actions;
