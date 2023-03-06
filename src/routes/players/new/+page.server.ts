import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

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

		const player = await prisma.player.create({
			data: {
				name
			}
		});

		// console.log(player);

		throw redirect(303, '/players');

		return { success: true };
	}
} satisfies Actions;
