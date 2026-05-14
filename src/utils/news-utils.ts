export type NewsSourceId = "china" | "hn";

export type NewsSourceDefinition = {
	id: NewsSourceId;
	label: string;
	icon: string;
	feedUrl: string;
	homepageUrl: string;
};

export const NEWS_SOURCES: NewsSourceDefinition[] = [
	{
		id: "china",
		label: "中国热榜",
		icon: "material-symbols:public",
		feedUrl: "https://china.buzzing.cc/feed.json",
		homepageUrl: "https://china.buzzing.cc/",
	},
	{
		id: "hn",
		label: "Hacker News",
		icon: "material-symbols:terminal",
		feedUrl: "https://hn.buzzing.cc/feed.json",
		homepageUrl: "https://hn.buzzing.cc/",
	},
];
