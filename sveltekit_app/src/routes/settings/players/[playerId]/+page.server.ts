import { prisma } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import type { Actions, PageServerLoad } from './$types';
import aws from 'aws-sdk';
const { S3 } = aws;
import { AWS_AK, AWS_SK, BUCKET_NAME } from '$env/static/private';

export const load = (async ({ params }) => {
	const id = +params.playerId;
	const player = await prisma.player.findFirst({ where: { id } });
	if (!player) {
		return fail(404, { error: 'Player not found' });
	}

	// const games = await prisma.game.findMany({
	// 	where: { teams: { some: { players: { some: { id: player.id } } } } }
	// });
	// const attempts = await prisma.attempt.findMany({ where: { shooterId: player.id } });
	// const attemptsOnTarget = await prisma.attempt.findMany({
	// 	where: { shooterId: player.id, OR: [{ onTarget: true }, { goal: true }] }
	// });
	// const attemptsGoal = await prisma.attempt.findMany({
	// 	where: { shooterId: player.id, goal: true }
	// });
	// const attemptsPerGame = attempts.length / games.length;
	// console.log(`Player Stats for ${player.name}:`);
	// console.log(`- Games played: ${games.length}`);
	// console.log(`- Total attempts: ${attempts.length}`);
	// console.log(`- Attempts on target: ${attemptsOnTarget.length}`);
	// console.log(`- Goals scored: ${attemptsGoal.length}`);
	// console.log(`- Average attempts per game: ${attemptsPerGame.toFixed(2)}`);

	return { player };
}) satisfies PageServerLoad;

export const actions = {
	delete: async ({ request }) => {
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
		throw redirect(303, '/settings/players');
	},
	save: async ({ request, fetch }) => {
		const data = await request.formData();
		const id = data.get('id') as string;
		const file = data.get('image') as File | null;
		try {
			if (file?.size) {
				const ext = file?.name.split('.').pop();
				const filename = nanoid() + '.' + ext;
				const s3 = new S3({
					region: 'eu-central-1',
					credentials: { accessKeyId: AWS_AK, secretAccessKey: AWS_SK }
				});
				await s3
					.putObject({
						Bucket: BUCKET_NAME,
						Key: filename,
						ACL: 'public-read',
						ContentType: file.type,
						Body: Buffer.from(await file.arrayBuffer())
					})
					.promise();

				const imageUri = 'https://izpo-fifa.s3.eu-central-1.amazonaws.com/' + filename;
				await prisma.player.update({ where: { id: +id }, data: { imageUri } });
			}
		} catch (error) {
			console.log(error);
		}
		throw redirect(303, '/settings/players');
	}
} satisfies Actions;
