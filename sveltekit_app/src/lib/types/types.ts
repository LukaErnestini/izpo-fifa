import type { Attempt, Game, Player, Team } from '@prisma/client';

export type GamePopulated =
	| (Game & {
			teams: (Team & {
				players: Player[];
			})[];
	  })
	| null;

export type AttemptsPlayers =
	| (Attempt & {
			shooter: Player;
	  })[]
	| undefined;

export type GamesTeams =
	| (Game & {
			teams: Team[];
			winner: Team | null;
	  })[]
	| undefined;
