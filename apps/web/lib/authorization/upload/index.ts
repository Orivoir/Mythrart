import type {S3PresignedUrlOptions} from "@mythrart/s3"
import { PLANS } from "@/lib/constants/plan"
import {prisma, type PlanType} from "@mythrart/database"
import {getPlanLimits, getPlan} from "@/lib/authorization"

export interface CanUploadFileOptions extends Omit<S3PresignedUrlOptions, "expiresIn"> {
  userId: string;
  plan?: PlanType
}

export async function canUploadFile({
  size,
  userId,
  plan
}: CanUploadFileOptions): Promise<boolean> {
  /**
   * Implement logic to determine if the user can upload a file based on their permissions, the context, and other factors (like size file).
   * 1 - Get PlanType of userId
   * 2 - Get  limits storageBytes and maxUploadSizeBytes of the plan
   * 3 - Get the current storage used by the userId (based on reference in the database)
   * 4 - Check if the file size is less than maxUploadSizeBytes
   * 5 - Check if the current storage used + file size is less than storageBytes
   * 6 - Return true if both checks pass, otherwise return false
   */

  const planUser = await getPlan(userId)
  const {maxUploadSizeBytes, storageBytes} = 
  typeof plan === "string" ?
    // DONT REQUEST DATABASE IF PLAN IS PROVIDED BY ENDPOINT
    PLANS[plan.toUpperCase() as keyof typeof PLANS].limits:
    (await getPlanLimits(planUser))

  const currentUsageBytes = await getUsageStorageBytes(userId)
  return canUploadFileBasedOnPlan({
    storageBytes,
    maxUploadSizeBytes,
    fileSizeBytes: size,
    currentUsageBytes
  })
}

export async function getUsageStorageBytes(userId: string): Promise<number> {
  const result = await prisma.asset.aggregate({
    _sum: {
      sizeBytes: true,
    },
    where: {
      ownerId: userId,
    },
  })

  return result._sum.sizeBytes ?? 0
}


export type CanUploadFileBaseOnPlanOptions = {
  storageBytes: number,
  maxUploadSizeBytes: number,
  fileSizeBytes: number,
  currentUsageBytes: number
}

export function canUploadFileBasedOnPlan({
  storageBytes,
  maxUploadSizeBytes,
  fileSizeBytes,
  currentUsageBytes}: CanUploadFileBaseOnPlanOptions): boolean {
  
  if(fileSizeBytes > maxUploadSizeBytes) {
    return false
  }

  if(currentUsageBytes + fileSizeBytes > storageBytes) {
    return false
  }

  return true
}
