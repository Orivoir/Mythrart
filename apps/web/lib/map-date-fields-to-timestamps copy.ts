const DEFAULT_TIMESTAMP_FIELDS = ["createdAt", "updatedAt"] as const

type DefaultTimestampField = (typeof DEFAULT_TIMESTAMP_FIELDS)[number];

/**
 * @description Maps the specified date fields of a source object to timestamps (number of milliseconds since the Unix epoch).
 * @template T - The type of the source object.
 * @template K - The keys of the source object that are date fields to be mapped to timestamps.
 * @param source 
 * @param fields 
 * @returns A new object with the specified date fields mapped to timestamps.
 */
export function mapDateFieldsToTimestamps<
    T extends Record<string, unknown>,
    K extends keyof T,
>(
    source: T & Record<K, Date>,
    fields: readonly K[],
): Omit<T, K> & Record<K, number> {
    const mapped = { ...source } as Record<string, unknown>

    for (const field of fields) {
        mapped[field as string] = source[field].getTime()
    }

    return mapped as Omit<T, K> & Record<K, number>
}

/**
 * @description Maps the default timestamp fields ("createdAt" and "updatedAt") of a source object to timestamps (number of milliseconds since the Unix epoch).
 * @template T - The type of the source object, which must include the default timestamp fields.
 * @param source
 * @returns A new object with the default timestamp fields ("createdAt" and "updatedAt") mapped to timestamps.
 */
export function mapModelTimestamps<T extends Record<DefaultTimestampField, Date>>(
    source: T,
): Omit<T, DefaultTimestampField> & Record<DefaultTimestampField, number> {
    return mapDateFieldsToTimestamps(source, DEFAULT_TIMESTAMP_FIELDS)
}