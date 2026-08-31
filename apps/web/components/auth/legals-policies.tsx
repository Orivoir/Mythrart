import { Text } from "../ui/Typography/text"
import Link from "next/link"
import {getTranslations} from "next-intl/server"

export async function LegalsPolicies() {

  const t = await getTranslations("Auth.Login.Form")

  return (
    <div className="mt-12">
      <Text className="text-xs text-muted text-center">
        {t("PreTextLegalPolicies")}{" "}
        
        <Link href="#" className="text-primary">
          {t("UsageTerms")}
        </Link>{""}
        
        {t("SubTextLegalPolicies")}{" "}
        
        <Link href="#" className="text-primary">
          {t("PrivacyPolicy")}
        </Link>.
      </Text>
    </div>
  )
}