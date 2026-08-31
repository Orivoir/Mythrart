const DEFAULT_LOCALE = "en"

function normalizeLocaleTag(value: string): string {
	const normalized = value.trim().toLowerCase().replace("_", "-")
	const base = normalized.split("-")[0]

	return base || DEFAULT_LOCALE
}

function pickLocaleFromAcceptLanguage(value: string | null): string {
	if (!value) {
		return DEFAULT_LOCALE
	}

	const parsed = value
		.split(",")
		.map((part) => {
			const [rawTag, ...params] = part.trim().split(";")
			const qParam = params.find((param) => param.trim().startsWith("q="))
			const q = qParam ? Number(qParam.split("=")[1]) : 1

			return {
				tag: normalizeLocaleTag(rawTag),
				q: Number.isFinite(q) ? q : 0,
			}
		})
		.sort((a, b) => b.q - a.q)

	return parsed[0]?.tag || DEFAULT_LOCALE
}

export function getRequestLocale(options: {
	headers: Headers
	requestLocale?: unknown
}): string {
	if (typeof options.requestLocale === "string" && options.requestLocale.trim().length > 0) {
		return normalizeLocaleTag(options.requestLocale)
	}

	const localeHeader = options.headers.get("x-user-locale") || options.headers.get("x-locale")

	if (localeHeader) {
		return normalizeLocaleTag(localeHeader)
	}

	return pickLocaleFromAcceptLanguage(options.headers.get("accept-language"))
}
