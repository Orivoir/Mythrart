import { prisma } from "@mythrart/database"
import { type PlanLimits, type PlanType, PlanFeatures, PlanFeaturesName, PLANS } from "../constants/plan"


// Generic helper authorzation function to check if a user can execute a action based on their plan limits and features.
// functions can be used for various actions like uploading files, creating collaborators, etc.

export async function getPlan(userId: string): Promise<PlanType> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      plan: true,
    },
  })

  if (!user) {
    throw new Error("User not found")
  }

  return user.plan.toUpperCase() as PlanType
}
export async function getPlanLimits(plan: PlanType): Promise<PlanLimits> {
  return PLANS[plan].limits
}

export async function getPlanFeaturesByName(featureName: PlanFeaturesName, plan: PlanType): Promise<PlanFeatures[PlanFeaturesName]> {
  return PLANS[plan].features[featureName]
}


export * from "./upload"
export * from "./collaborations"
export * from "./chapter"