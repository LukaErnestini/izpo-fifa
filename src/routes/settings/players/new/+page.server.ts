import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString() as string;
		// console.log(name);
		// console.log('Hello from page.server.ts');
		// console.log(await prisma.player.count());
		try {
			const existing = await prisma.player.findFirst({ where: { name } });
			if (existing) {
				console.log('User exists');
				return fail(400, { name, exists: true });
			}

			const player = await prisma.player.create({
				data: {
					name
				}
			});
			// console.log(player);

			const players = await prisma.player.findMany();
			if (players.length < 2) {
				throw 'less than 2';
			}
			for (let i = 0; i < players.length; i++) {
				for (let j = i + 1; j < players.length; j++) {
					//   teams.push([players[i], players[j]]);
					prisma.team
						.findFirst({
							where: {
								AND: [
									{ players: { some: { id: players[i].id } } },
									{ players: { some: { id: players[j].id } } }
								]
							}
						})
						.then((team) => {
							// console.log(team);
							if (team) {
								throw 'Team already exists.';
							}
							return prisma.team.create({
								data: {
									players: {
										connect: [{ id: players[i].id }, { id: players[j].id }]
									}
								},
								include: { players: true }
							});
						})
						.then((result) => {
							// console.log(result);
						})
						.catch((err) => {
							// console.log(err);
						});
				}
			}
		} catch (error) {
			console.log(error);
		}
		throw redirect(303, '/players');
	}
} satisfies Actions;
