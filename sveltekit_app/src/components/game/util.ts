import type { Player } from '@prisma/client';

export const getTeammates = (
	team1: Player[] | undefined,
	team2: Player[] | undefined,
	pId: number | null,
	inverse = false
) => {
	if (!team1 || !team2 || !pId) {
		return [];
	}

	const player = team1.find((p) => p.id === pId);
	if (player) {
		return inverse ? team2 : team1;
	} else {
		return inverse ? team1 : team2;
	}
};
