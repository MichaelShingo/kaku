import type { Metadata } from 'next';
import { Oswald } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/redux/provider';
import { Analytics } from '@vercel/analytics/react';

const oswald = Oswald({
	subsets: ['latin'],
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'Kaku | Draw Music',
	description:
		'Michael Shingo Crawford, web developer and musician based in the Netherlands. Build with Next.js, React, Typescript.',
	metadataBase: new URL('https://portfolio.michaelshingo.com/'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="overflow-x-hidden bg-paper-white">
			<body className={`${oswald.className}`}>
				<ReduxProvider>{children}</ReduxProvider>
				<Analytics />
			</body>
		</html>
	);
}
