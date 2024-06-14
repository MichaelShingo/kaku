import type { Metadata } from 'next';
import { Silkscreen } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/redux/provider';
import { Analytics } from '@vercel/analytics/react';

const silkscreen = Silkscreen({
	weight: '400',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Kaku | Draw Music',
	description: 'Draw music and play it back',
	metadataBase: new URL('https://kaku.michaelshingo.com/'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="overflow-scroll">
			<body className={`${silkscreen.className}`}>
				<ReduxProvider>{children}</ReduxProvider>
				<Analytics />
			</body>
		</html>
	);
}
