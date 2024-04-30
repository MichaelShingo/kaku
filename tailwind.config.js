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
				'scroll-music': 'scroll-music 17s infinite linear',
			},
			keyframes: {
				'scroll-music': {
					'0%': { opacity: '0%', transform: 'translate(260px)' },
					'5%': { opacity: '100%' },
					'95%': { opacity: '100%' },
					'100%': { opacity: '0%', transform: 'translate(-250px)' },
				},
			},
		},
	},
	plugins: [],
};
