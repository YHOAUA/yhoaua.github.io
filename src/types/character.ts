export type CharacterLink = {
	label: string;
	url: string;
};

export type CharacterProfile = {
	id: string;
	title: string;
	description: string;
	image: string;
	roles: string[];
	tags: string[];
	links: CharacterLink[];
	pinned: boolean;
};
