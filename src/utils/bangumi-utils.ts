import type {
	MediaCollectionItem,
	SubjectType,
	UserSubjectCollection,
	UserSubjectCollectionResponse,
} from "@/types/bangumi";

type BangumiFetchOptions = {
	username: string;
	subjectType: SubjectType;
	apiUrl?: string;
	limit?: number;
	delay?: number;
	maxTotal?: number;
	isDev?: boolean;
};

const BANGUMI_SUBJECT_BASE_URL = "https://bgm.tv/subject/";

export async function fetchBangumiCollections({
	username,
	subjectType,
	apiUrl = "https://api.bgm.tv",
	limit = 50,
	delay = 50,
	maxTotal = 1000,
	isDev = false,
}: BangumiFetchOptions): Promise<MediaCollectionItem[]> {
	try {
		let offset = 0;
		let allData: MediaCollectionItem[] = [];
		let hasMore = true;
		const maxPages = isDev ? 1 : 0;

		console.log(
			`[Bangumi] ${isDev ? "🔧 开发模式" : "🌐 生产模式"} - 开始获取用户 ${username} 的 subjectType ${subjectType} 数据...`,
		);

		while (hasMore) {
			if (isDev && maxPages > 0 && allData.length >= limit * maxPages) {
				console.log(`[Bangumi] 开发模式：已获取 ${maxPages} 页数据，停止获取`);
				break;
			}

			if (maxTotal > 0 && allData.length >= maxTotal) {
				console.log(`[Bangumi] 已达到最大获取限制 ${maxTotal}，停止获取`);
				break;
			}

			const url = `${apiUrl}/v0/users/${username}/collections?subject_type=${subjectType}&limit=${limit}&offset=${offset}`;
			console.log(`[Bangumi] 正在获取数据: ${url} (已获取: ${allData.length})`);

			const response = await fetch(url, {
				headers: {
					"User-Agent": "YuuOuRou Blog",
					Accept: "application/json",
				},
			});

			if (!response.ok) {
				console.warn(
					`[Bangumi] 无法获取数据 (状态码: ${response.status}):`,
					url,
				);
				break;
			}

			const data = (await response.json()) as UserSubjectCollectionResponse;
			const currentBatch = (data.data || []).map(normalizeBangumiCollection);

			if (currentBatch.length > 0) {
				allData = allData.concat(currentBatch);
				offset += limit;

				if (currentBatch.length < limit) {
					hasMore = false;
				}
			} else {
				hasMore = false;
			}

			if (hasMore) {
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}

		console.log(`[Bangumi] 总共获取到 ${allData.length} 条数据`);
		return allData;
	} catch (error) {
		console.error("[Bangumi] 获取数据时出错:", error);
		return [];
	}
}

function normalizeBangumiCollection(
	item: UserSubjectCollection,
): MediaCollectionItem {
	return {
		id: `bangumi-${item.subject_id}`,
		source: "bangumi",
		...item,
		subject: {
			...item.subject,
			url: `${BANGUMI_SUBJECT_BASE_URL}${item.subject.id}`,
		},
	};
}
