import type { Attempt, Foul, Game, Player, Team } from '@prisma/client';

export type GamePopulated =
	| (Game & {
			teamA: Team & {
				players: Player[];
			};
			teamB: Team & {
				players: Player[];
			};
			attempts: (Attempt & {
				shooter: Player;
			})[];
			fouls: (Foul & {
				player: Player;
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
			teamA: Team;
			teamB: Team;
			winner: Team | null;
	  })[]
	| undefined;
