import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const res = await fetch('/api/gameday/active');
	if (res.status === 404) {
		console.log('No active gameday');
		const response = await fetch('/api/players');
		const players = await response.json();
		return { players };
	}
	const gameday = await res.json();
	// console.log(res);

	return { gameday };
}) satisfies PageLoad;
