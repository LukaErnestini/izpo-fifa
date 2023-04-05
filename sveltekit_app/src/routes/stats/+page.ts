import { PUBLIC_PYTHON_API } from '$env/static/public';
import type { PageLoad } from './$types';

interface Data {
	players: any[];
	teams: any[];
	shots: any[];
}

export const load = (async ({ fetch }) => {
	const response = await fetch(PUBLIC_PYTHON_API + '/overallTables');
	const data: Data = await response.json();
	return { ...data };
}) satisfies PageLoad;
