export type ContactFormData = {
	name: string;
	email: string;
	message: string;
};

export const sendContactForm = async (data: ContactFormData): Promise<number> => {
	const res: Response = await fetch('/api/email', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	});
	return res.status;
};
