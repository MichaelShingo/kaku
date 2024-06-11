/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./app/**/*.{js,jsx,ts,tsx}'],
	darkMode: 'selector',
	theme: {
		extend: {
			colors: {
				'off-white': '#fffffc',
				'off-black': '#2c363f',
				'off-black-trans': 'rgba(44, 54, 63, 0.75)',
				'light-blue': '#01baef',
				'light-pink': '#d972ff',
				'light-grey': '#666666',
			},
			backgroundImage: {
				imageIcon: 'url("/imageIcon.svg")',
			},
			boxShadow: {
				'inner-md': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.3)',
				'outer-sm': '0 2px 3px 0 rgb(0 0 0 / 0.5)',
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
