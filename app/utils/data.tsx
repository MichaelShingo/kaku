export type PortfolioItem = {
	title: string;
	preview: string;
	tags: string[];
	logo: string;
	showcase: boolean;
	description: string;
	github: string;
	link: string;
	images: string[];
};

export const data: PortfolioItem[] = [
	{
		title: 'Miitronome',
		preview: 'A metronome with support for polyrhythms, subdivisions, and more.',
		tags: ['Next.js', 'Typescript', 'MUI'],
		logo: '/miitronomeLogo.svg',
		showcase: true,
		description:
			'Miitronome is a progressive web application which can be used online or installed on iOS, Android, and Windows. The metronome has robust features, including support for polyrhythms, subdivisions, and sound customization.',
		github: 'https://github.com/MichaelShingo/metronome',
		link: 'https://metronome.michaelshingo.com',
		images: [
			'/miitronome/miitronome01.jpg',
			'/miitronome/miitronome02.jpg',
			'/miitronome/miitronome03.jpg',
			'/miitronome/miitronome04.jpg',
			'/miitronome/miitronomeMobile01.jpg',
			'/miitronome/miitronomeMobile02.jpg',
			'/miitronome/miitronomeMobile03.jpg',
		],
	},
	{
		title: 'AnnaLyze',
		preview: 'An audio player, waveform visualizer, and music analysis app.',
		tags: ['Next.js', 'Typescript', 'MUI'],
		logo: '/annalyzeLogo.svg',
		showcase: true,
		description:
			'AnnaLyze is an application that allows the user to upload audio, create a waveform visualization and analyze the pitch content of the music. The analysis portions are still under development, but feel free to try the visualizer and audio player features.',
		github: 'https://github.com/MichaelShingo/audioFeatures',
		link: 'https://annalyze.vercel.app',
		images: [
			'/annalyze/annalyze01.jpg',
			'/annalyze/annalyze02.jpg',
			'/annalyze/annalyze03.jpg',
			'/annalyze/annalyze04.jpg',
			'/annalyze/annalyze05.jpg',
			'/annalyze/annalyze06.jpg',
			'/annalyze/annalyze07.jpg',
		],
	},
	{
		title: 'Violintice',
		preview: 'A violin etude database and practice tracker.',
		tags: ['React', 'Javascript', 'Django', 'Python', 'PostgreSQL'],
		logo: '/violinticeLogo.svg',
		showcase: true,
		description: `This application offers violinists a database of standard etudes that allows them to track their progress. Based on user-inputted data, the app provides data-insights that may guide the musician's practice.`,
		github: 'https://github.com/MichaelShingo/practiceApp',
		link: 'https://violintice.michaelshingo.com',
		images: [
			'/violintice/violintice01.jpg',
			'/violintice/violintice03.jpg',
			'/violintice/violintice04.jpg',
			'/violintice/violintice05.jpg',
			'/violintice/violintice06.jpg',
			'/violintice/violintice07.jpg',
			'/violintice/violinticeMobile01.jpg',
			'/violintice/violinticeMobile02.jpg',
		],
	},
	{
		title: 'For the Lost Creative',
		preview: 'A database of opportunities for creatives.',
		tags: ['Django', 'Python', 'Javascript', 'OpenAI API', 'PostgreSQL', 'Wix API'],
		logo: '/cbLogo.svg',
		showcase: true,
		description:
			'"For the Lost Creative" by the Creative Baggage Podcast is a curated database of opportunities for musicians and artists. Inspired by a desire to find practical solutions to improve the lives of the creative community, it provides a listing of jobs, internships, competitions, grants, and more for creative professionals. The database found its beginnings after the team won a grant from EnCORE Accelerando in Budapest, Hungary. The database provides filtering and searching options as well as the ability for logged in users to save opportunities. Monthly data population is completely automated through a combination of web scraping and AI. Automated email reminders help users stay on top of their deadlines and track their applications.',
		github: 'https://github.com/MichaelShingo/cbAIScraper',
		link: 'https://www.forthelostcreative.com',
		images: [
			'/creativeBaggage/creativeBaggage01.jpg',
			'/creativeBaggage/creativeBaggage02.jpg',
			'/creativeBaggage/creativeBaggage03.jpg',
			'/creativeBaggage/creativeBaggage04.jpg',
			'/creativeBaggage/creativeBaggage05.jpg',
			'/creativeBaggage/creativeBaggage06.jpg',
			'/creativeBaggage/creativeBaggage07.jpg',
		],
	},
	{
		title: 'Trivial Conspiracies',
		preview: 'An interactive showcase for a short film.',
		tags: ['React', 'Javascript'],
		logo: '/trivialLogo.svg',
		showcase: false,
		description:
			'This website is a collaboration with Philadelphia-based filmmaker, Sam Dellert. The site functions as an interactive showcase of Sam\'s short film, "Trivial Conspiracies," by making heavy use of CSS animations and emphasizing responsive design in the context of an unconventional layout.',
		github: 'https://github.com/MichaelShingo/trivial-conspiracies',
		link: 'https://trivialconspiracies.com',
		images: [
			'/trivialConspiracies/trivial01.jpg',
			'/trivialConspiracies/trivial02.jpg',
			'/trivialConspiracies/trivial03.jpg',
			'/trivialConspiracies/trivial04.jpg',
			'/trivialConspiracies/trivialMobile01.jpg',
			'/trivialConspiracies/trivialMobile02.jpg',
		],
	},
	{
		title: 'VDML',
		preview: 'A task automater and data analyzer for UPenn Libraries.',
		tags: ['Flask', 'Python', 'Javascript', 'SCSS', 'SQLite'],
		logo: '/vdmlLogo.svg',
		showcase: false,
		description: `The Vitale Digital Media Lab (VDML) at the University of Pennsylvania is an equipment lending library that makes professional-grade video and audio equipment available to university students, faculty, and staff. This application automates some of the most common tasks performed by lab consultants.
			
			The main feature of the app is a late fine processing toolkit that receives plain text data from the lab's booking management software, parses it, and adds the relevant data into a table. From here, various actions can be performed, including searching and sorting through registered late fines, as well as generating emails that need to be sent to each user and library circulation. The toolkit can also generate a CSV file of all or a subset of the data. Users can populate the table in bulk by uploading a CSV file.
			
			The Booking Analysis tab receives a CSV file generated by the lab's booking software. Based on this, the app calculates information such as the number of times each piece of equipment was booked, the number of times each user was late returning equipment and the most frequent lab users.`,
		github: 'https://github.com/MichaelShingo/VDML',
		link: 'https://www.youtube.com/watch?v=T_Tt26Jq7VE',
		images: [
			'/vdml/vdml01.jpg',
			'/vdml/vdml02.jpg',
			'/vdml/vdml03.jpg',
			'/vdml/vdml04.jpg',
			'/vdml/vdml05.jpg',
			'/vdml/vdml06.jpg',
			'/vdml/vdml07.jpg',
			'/vdml/vdml08.jpg',
		],
	},
];
