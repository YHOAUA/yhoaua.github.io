import type { WebsiteLink, WebsitesPageConfig } from "../types/config";

// 可以在src/content/spec/websites.md中编写网站导航页面下方的自定义内容

// 网站导航页面配置
export const websitesPageConfig: WebsitesPageConfig = {
	// 页面标题，如果留空则使用 i18n 中的翻译
	title: "",

	// 页面描述文本，如果留空则使用 i18n 中的翻译
	description: "",

	// 是否显示底部自定义内容（websites.md 中的内容）
	showCustomContent: false,

	// 是否显示评论区，需要先在commentConfig.ts启用评论系统
	showComment: false,

	// 是否开启随机排序配置，如果开启，就会忽略权重，构建时进行一次随机排序
	randomizeSort: false,
};

// 网站导航配置
export const websitesConfig: WebsiteLink[] = [
	{
		title: "布布影视",
		imgurl: "https://bbys.app/favicon.ico",
		desc: "多接口",
		siteurl: "https://bbys.app",
		tags: ["在线影视"],
		weight: 10, // 权重，数字越大排序越靠前
		enabled: true, // 是否启用
	},
	{
		title: "Libvio",
		imgurl: "https://www.libvio.lat/template/libvio/statics/img/favicon.ico",
		desc: "国外",
		siteurl: "https://www.libvio.lat",
		tags: ["在线影视"],
		weight: 9,
		enabled: true,
	},
	{
		title: "4K 影视",
		imgurl: "https://4kvm.staticimgjs.org/uploads/2026/03/e8bbe2c53e4567.png",
		desc: "",
		siteurl: "https://www.4kvm.top",
		tags: ["在线影视"],
		weight: 8,
		enabled: true,
  },
  {
		title: "咕咕番",
		imgurl: "https://www.gugu3.com/upload/site/20260506-1/a0799f74e4bced939fbbc0b79cb27671.png",
		desc: "",
		siteurl: "https://www.gugu3.com",
		tags: ["在线动漫"],
		weight: 8,
		enabled: true,
  },
  {
		title: "咕咕番",
		imgurl: "https://www.agedm.io/favicon.ico",
		desc: "",
		siteurl: "https://www.agedm.io",
		tags: ["在线动漫"],
		weight: 8,
		enabled: true,
  },
];

// 获取启用的网站并进行排序
export const getEnabledWebsites = (): WebsiteLink[] => {
	const websites = websitesConfig.filter((website) => website.enabled);

	if (websitesPageConfig.randomizeSort) {
		return websites.sort(() => Math.random() - 0.5);
	}

	return websites.sort((a, b) => b.weight - a.weight);
};
