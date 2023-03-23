import { prisma } from '$lib/server/db';
import { error, fail } from '@sveltejs/kit';
import type { Actions } from './$types';

async function card(card: string, request: Request) {
	const data = await request.formData();
	const time = data.get('time') ? +(data.get('time') as string) : null;
	const shooterId = data.get('shooter') ? +(data.get('shooter') as string) : undefined;
	const gameId = data.get('gameId') ? +(data.get('gameId') as string) : undefined;
	const x = data.get('x') ? +(data.get('x') as string) : null;
	const y = data.get('y') ? +(data.get('y') as string) : null;
	try {
		await prisma.foul.create({
			data: {
				card,
				time,
				x,
				y,
				game: { connect: { id: gameId } },
				player: { connect: { id: shooterId } }
			}
		});
	} catch (error) {
		console.log(error);
		fail(500, { error: 'Some error occured.' });
	}
}

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
	createGame: async ({ request }) => {
		// TODO refactor this code, there is some duplication.
		try {
			const data = await request.formData();
			const team1players = data.getAll('team1').map((e) => {
				return +e;
			});
			const team2players = data.getAll('team2').map((e) => {
				return +e;
			});
			const teams1 = await prisma.team.findMany({
				where: { players: { every: { id: { in: team1players } } } },
				include: { players: true }
			});
			// The bellow step is necessary because the query returns teams
			// that contain a subset of the team1players as well
			// Meaning that single player teams satisfy the condition.
			// I did not know how to correct the query, so this is the current solution
			const team1 = teams1.find((team) => {
				if (team.players.length === team1players.length) return team;
			});
			const teams2 = await prisma.team.findMany({
				where: { players: { every: { id: { in: team2players } } } },
				include: { players: true }
			});
			const team2 = teams2.find((team) => {
				if (team.players.length === team2players.length) return team;
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
		const data = await request.formData();
		const shooterId = data.get('shooter') ? +(data.get('shooter') as string) : undefined;
		if (!shooterId) {
			return fail(400, { error: 'A shooter must be selected.' });
		}
		const goal = data.get('goal') ? true : false;
		const autogoal = data.get('autogoal') ? true : false;
		const onTarget = data.get('onTarget') ? true : false;
		const penalty = data.get('penalty') ? true : false;
		const time = data.get('time') ? +(data.get('time') as string) : null;
		const x = data.get('x') ? +(data.get('x') as string) : null;
		const y = data.get('y') ? +(data.get('y') as string) : null;
		const distance = data.get('distance') ? +(data.get('distance') as string) : -1;
		const assistedId = data.get('assisted') ? +(data.get('assisted') as string) : undefined;
		const goalieId = data.get('goalie') ? +(data.get('goalie') as string) : undefined;
		const gameId = data.get('gameId') ? +(data.get('gameId') as string) : undefined;
		try {
			const attempt = await prisma.attempt.create({
				data: {
					goal,
					autogoal,
					onTarget,
					penalty,
					time,
					x,
					y,
					distance: distance > 0 ? distance : null,
					shooter: { connect: { id: shooterId } },
					assisted: assistedId ? { connect: { id: assistedId } } : undefined,
					goalie: goalieId ? { connect: { id: goalieId } } : undefined,
					Game: { connect: { id: gameId } }
				}
			});
			actions.tallyScore();
		} catch (error) {
			console.log(error);
			fail(400, { error: 'An unexpected error occured.' });
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
				},
				include: { teams: true }
			});
			if (!activeGame) {
				return fail(404, { error: 'No active game found.' });
			}
			const winnerId =
				activeGame.scoreTeamA > activeGame.scoreTeamB
					? activeGame.teams[0].id
					: activeGame.teams[0].id;
			const game = await prisma.game.update({
				where: { id: activeGame?.id },
				data: { finished: true, winnerId }
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
	},
	red: async ({ request }) => {
		await card('red', request);
	},
	yellow: async ({ request }) => {
		await card('yellow', request);
	},
	removeFoul: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('foulId') as string;
		try {
			await prisma.foul.delete({ where: { id: +id } });
		} catch (error) {
			console.log(error);
		}
	},
	tallyScore: async () => {
		let scoreTeamA = 0;
		let scoreTeamB = 0;
		try {
			const activeGameday = await prisma.gameday.findFirst({ where: { active: true } });
			const activeGame = await prisma.game.findFirst({
				where: {
					AND: {
						finished: false,
						Gameday: activeGameday
					}
				},
				include: {
					attempts: { include: { shooter: true } },
					teams: { include: { players: true } }
				}
			});

			if (!activeGame) {
				return fail(500, { error: 'There is no active game.' });
			}

			// Loop through the attempts and tally the scores
			for (const attempt of activeGame.attempts) {
				if (attempt.goal) {
					if (
						activeGame.teams[0].players.filter((playa) => playa.id === attempt.shooter.id).length
					) {
						// The shooter is on teamA
						if (attempt.autogoal) scoreTeamB++;
						else scoreTeamA++;
					} else {
						if (attempt.autogoal) scoreTeamA++;
						else scoreTeamB++;
					}
				}
			}

			const game = await prisma.game.update({
				where: { id: activeGame?.id },
				data: { scoreTeamA, scoreTeamB }
			});

			// console.log(`${scoreTeamA}:${scoreTeamB}`);
		} catch (error) {
			console.log(error);
			fail(500, { error: 'An unexpected error occured' });
		}
	}
} satisfies Actions;
