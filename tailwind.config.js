/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./app/**/*.{js,jsx,ts,tsx}'],
	darkMode: 'selector',
	theme: {
		extend: {
			colors: {
				'off-white': '#fffffc',
				'off-black': '#2c363f',
				'light-blue': '#01baef',
				'light-pink': '#d972ff',
			},
			backgroundImage: {
				imageIcon: 'url("/imageIcon.svg")',
			},
			animation: {
				'color-shift': 'color-shift 1s infinite linear alternate',
			},
			keyframes: {
				'color-shift': {
					'0%': { backgroundColor: '#d972ff' },
					'100%': { backgroundColor: '#01baef' },
				},
			},
		},
	},
	plugins: [],
};
