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
		} catch (error) {
			console.log(error);
		}
		throw redirect(303, '/players');
	}
} satisfies Actions;
