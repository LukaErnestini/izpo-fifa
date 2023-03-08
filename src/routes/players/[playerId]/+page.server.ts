import { prisma } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const id = +params.playerId;
	const player = await prisma.player.findFirst({ where: { id } });

	return { player };
}) satisfies PageServerLoad;

export const actions = {
	delete: async ({ request }) => {
		// console.log('deleting');
		const data = await request.formData();
		const id = data.get('id') as string;

		try {
			const deleteTeams = prisma.team.deleteMany({
				where: {
					players: {
						some: {
							id: +id
						}
					}
				}
			});
			const deletePlayer = prisma.player.delete({
				where: {
					id: +id
				}
			});

			const transaction = await prisma.$transaction([deleteTeams, deletePlayer]);
		} catch (error) {
			console.log(error);
		}

		throw redirect(303, '/players');
	}
} satisfies Actions;
