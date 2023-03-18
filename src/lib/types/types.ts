import type { Game, Player, Team } from '@prisma/client';

export type GamePopulated =
	| (Game & {
			teams: (Team & {
				players: Player[];
			})[];
	  })
	| null;
