import { assets, base } from '$app/paths';
import { prisma } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import path, { dirname } from 'path';
import type { Actions, PageServerLoad } from './$types';
import { S3 } from 'aws-sdk';
import { env } from '$env/dynamic/private';

export const load = (async ({ params }) => {
	const id = +params.playerId;
	const player = await prisma.player.findFirst({ where: { id } });

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
					credentials: { accessKeyId: env.AWS_AK, secretAccessKey: env.AWS_SK }
				});
				const s3url = await s3.getSignedUrlPromise('putObject', {
					Bucket: env.BUCKET_NAME,
					Key: filename,
					Expires: 600,
					ContentType: file.type
				});
				const response = await fetch(s3url, {
					method: 'PUT',
					headers: { 'Content-Type': String(file.type) },
					body: file
				});
				const imageUri = await s3.getSignedUrlPromise('getObject', {
					Bucket: env.BUCKET_NAME,
					Key: filename
				});
				await prisma.player.update({ where: { id: +id }, data: { imageUri } });
			}
		} catch (error) {
			console.log(error);
		}
		throw redirect(303, '/settings/players');
	}
} satisfies Actions;
