import { prisma } from '$lib/server/db';
import type { Game } from '@prisma/client';
import type { Actions } from './$types';

export const actions = {
	create: async ({ request }) => {
		try {
			// const data = await request.formData();
			// const players = await data.getAll('players[]');
			// console.log(players);
			const gameday = await prisma.gameday.create({ data: {} });
			const games: Game[] = [];
			return { gameday, games };
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
	}
} satisfies Actions;
