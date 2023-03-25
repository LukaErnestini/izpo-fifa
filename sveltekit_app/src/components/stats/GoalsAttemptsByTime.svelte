<script lang="ts">
	import { onMount } from 'svelte';
	import { Line } from 'svelte-chartjs';
	import { PUBLIC_PYTHON_API } from '$env/static/public';

	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale,
		type ChartData,
		type Point
	} from 'chart.js';

	ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);

	let chartData: ChartData<'line', (number | Point)[], unknown> = {
		labels: [],
		datasets: [
			{
				label: 'Attempts',
				data: [],
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 1
			},
			{
				label: 'Goals',
				data: [],
				backgroundColor: 'rgba(255, 99, 132, 0.2)',
				borderColor: 'rgba(255, 99, 132, 1)',
				borderWidth: 1
			}
		]
	};

	interface AttemptsGoalsData {
		time: string;
		avg_attempts: number;
		avg_goals: number;
	}

	async function fetchData() {
		const response = await fetch(PUBLIC_PYTHON_API + '/attemptsGoalsByTime');
		const data: AttemptsGoalsData[] = await response.json();
		console.log(data);
		chartData.labels = data.map((item) => item.time);
		chartData.datasets[0].data = data.map((item) => item.avg_attempts);
		chartData.datasets[1].data = data.map((item) => item.avg_goals);
	}

	onMount(async () => {
		await fetchData();
	});
</script>

<Line data={chartData} />
