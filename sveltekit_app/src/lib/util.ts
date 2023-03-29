export const hexToRGBA = (hex: string, alpha = 1) => {
	if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
		throw new Error('Invalid hex color code.');
	}

	const hexLength = hex.length;
	const rgba = [];

	for (let i = 1; i < hexLength; i += (hexLength - 1) / 3) {
		const color = parseInt(hex.slice(i, i + (hexLength - 1) / 3), 16);
		rgba.push(color);
	}

	rgba.push(alpha);

	return `rgba(${rgba.join(', ')})`;
};
