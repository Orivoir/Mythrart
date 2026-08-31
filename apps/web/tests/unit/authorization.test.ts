import { describe, expect, test } from "vitest"
import { canUploadFileBasedOnPlan } from "./../../lib/authorization"
import { PLANS } from "./../../lib/constants/plan"

const PLAN_CASES = [
  ["FREE", PLANS.FREE.limits],
  ["PREMIUM", PLANS.PREMIUM.limits],
  ["PRO", PLANS.PRO.limits],
] as const

describe("canUploadFileBasedOnPlan", () => {
  test.each(PLAN_CASES)("returns true for %s when values are within plan limits", (_planName, limits) => {
    const fileSizeBytes = limits.maxUploadSizeBytes
    const currentUsageBytes = limits.storageBytes - fileSizeBytes

    expect(
      canUploadFileBasedOnPlan({
        storageBytes: limits.storageBytes,
        maxUploadSizeBytes: limits.maxUploadSizeBytes,
        fileSizeBytes,
        currentUsageBytes,
      }),
    ).toBe(true)
  })

  test.each(PLAN_CASES)("returns false for %s when file size exceeds max upload size", (_planName, limits) => {
    expect(
      canUploadFileBasedOnPlan({
        storageBytes: limits.storageBytes,
        maxUploadSizeBytes: limits.maxUploadSizeBytes,
        fileSizeBytes: limits.maxUploadSizeBytes + 1,
        currentUsageBytes: 0,
      }),
    ).toBe(false)
  })

  test.each(PLAN_CASES)("returns false for %s when total usage exceeds storage", (_planName, limits) => {
    const fileSizeBytes = 1
    const currentUsageBytes = limits.storageBytes

    expect(
      canUploadFileBasedOnPlan({
        storageBytes: limits.storageBytes,
        maxUploadSizeBytes: limits.maxUploadSizeBytes,
        fileSizeBytes,
        currentUsageBytes,
      }),
    ).toBe(false)
  })
})