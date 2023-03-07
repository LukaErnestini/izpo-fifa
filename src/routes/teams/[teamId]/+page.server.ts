import { prisma } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const id = +params.teamId;
	const team = await prisma.team.findFirst({ where: { id } });
	return { team, id };
}) satisfies PageServerLoad;

export const actions = {
	save: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const color = data.get('color') as string;
		const id = data.get('id') as string;
		console.log(name, color, id);

		const team = await prisma.team.update({
			where: { id: +id },
			data: { color, name }
		});

		return { team };
	}
} satisfies Actions;
