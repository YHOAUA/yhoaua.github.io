import type { CollectionEntry } from "astro:content";

type ProjectEntry = CollectionEntry<"projects">;
type ProjectStatus = NonNullable<ProjectEntry["data"]["status"]>;

type GitHubRepoData = {
	name: string;
	description: string | null;
	homepage: string | null;
	html_url: string;
	archived: boolean;
	topics?: string[];
	language: string | null;
	pushed_at: string | null;
	created_at: string | null;
};

export type ResolvedProject = {
	entry: ProjectEntry;
	title: string;
	description: string;
	category: ProjectEntry["data"]["category"];
	tags: string[];
	date?: Date;
	status: ProjectStatus;
	techStack: string[];
	demoUrl?: string;
	repoUrl?: string;
	featured: boolean;
};

type RepoRef = {
	owner: string;
	repo: string;
};

const repoRequestCache = new Map<string, Promise<GitHubRepoData | null>>();

function parseGitHubRepoUrl(repoUrl?: string): RepoRef | null {
	if (!repoUrl) return null;

	try {
		const url = new URL(repoUrl);
		if (!["github.com", "www.github.com"].includes(url.hostname)) return null;

		const [owner, repoName] = url.pathname.split("/").filter(Boolean);
		if (!owner || !repoName) return null;

		return {
			owner,
			repo: repoName.replace(/\.git$/u, ""),
		};
	} catch {
		return null;
	}
}

async function fetchGitHubRepo(
	repoRef: RepoRef,
): Promise<GitHubRepoData | null> {
	const cacheKey = `${repoRef.owner}/${repoRef.repo}`;
	const cached = repoRequestCache.get(cacheKey);
	if (cached) return cached;

	const request = fetchGitHubRepoInternal(repoRef);
	repoRequestCache.set(cacheKey, request);
	return request;
}

async function fetchGitHubRepoInternal(
	repoRef: RepoRef,
): Promise<GitHubRepoData | null> {
	const headers = new Headers({
		Accept: "application/vnd.github+json",
		"User-Agent": "YHOAUA-Projects",
	});

	const token = import.meta.env.GITHUB_TOKEN;
	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	try {
		const response = await fetch(
			`https://api.github.com/repos/${repoRef.owner}/${repoRef.repo}`,
			{ headers },
		);

		if (!response.ok) {
			console.warn(
				`[Projects] Failed to fetch ${repoRef.owner}/${repoRef.repo}: ${response.status}`,
			);
			return null;
		}

		return (await response.json()) as GitHubRepoData;
	} catch (error) {
		console.warn(
			`[Projects] Failed to fetch ${repoRef.owner}/${repoRef.repo}:`,
			error,
		);
		return null;
	}
}

function normalizeHomepage(homepage?: string | null): string | undefined {
	if (!homepage?.trim()) return undefined;

	try {
		const url = new URL(homepage);
		return url.toString();
	} catch {
		return undefined;
	}
}

function normalizeTopic(topic: string): string {
	return topic
		.split(/[-_]/u)
		.map((segment) => {
			if (segment.length <= 3) return segment.toUpperCase();
			return segment.charAt(0).toUpperCase() + segment.slice(1);
		})
		.join(" ");
}

function uniqueStrings(values: Array<string | undefined | null>): string[] {
	return [
		...new Set(values.filter((value): value is string => !!value?.trim())),
	];
}

function resolveProjectDate(
	localDate: ProjectEntry["data"]["date"],
	repoData: GitHubRepoData | null,
): Date | undefined {
	if (localDate) return localDate;

	const fallbackValue = repoData?.pushed_at ?? repoData?.created_at;
	if (!fallbackValue) return undefined;

	const date = new Date(fallbackValue);
	return Number.isNaN(date.getTime()) ? undefined : date;
}

function resolveTechStack(
	localTechStack: string[],
	repoData: GitHubRepoData | null,
): string[] {
	if (localTechStack.length > 0) return localTechStack;

	return uniqueStrings([repoData?.language]).slice(0, 3);
}

function resolveTags(
	localTags: string[],
	repoData: GitHubRepoData | null,
): string[] {
	if (localTags.length > 0) return localTags;

	return uniqueStrings((repoData?.topics ?? []).map(normalizeTopic)).slice(
		0,
		4,
	);
}

function resolveStatus(
	localStatus: ProjectEntry["data"]["status"],
	repoData: GitHubRepoData | null,
): ProjectStatus {
	if (localStatus) return localStatus;
	return repoData?.archived ? "archived" : "active";
}

export async function resolveProjectEntries(
	entries: ProjectEntry[],
): Promise<ResolvedProject[]> {
	return Promise.all(
		entries.map(async (entry) => {
			const repoRef = parseGitHubRepoUrl(entry.data.repoUrl);
			const repoData = repoRef ? await fetchGitHubRepo(repoRef) : null;

			return {
				entry,
				title:
					entry.data.title?.trim() ||
					repoData?.name ||
					repoRef?.repo ||
					"Untitled Project",
				description:
					entry.data.description?.trim() || repoData?.description?.trim() || "",
				category: entry.data.category,
				tags: resolveTags(entry.data.tags, repoData),
				date: resolveProjectDate(entry.data.date, repoData),
				status: resolveStatus(entry.data.status, repoData),
				techStack: resolveTechStack(entry.data.techStack, repoData),
				demoUrl:
					entry.data.demoUrl ||
					normalizeHomepage(repoData?.homepage) ||
					undefined,
				repoUrl: entry.data.repoUrl || repoData?.html_url,
				featured: entry.data.featured,
			};
		}),
	);
}
