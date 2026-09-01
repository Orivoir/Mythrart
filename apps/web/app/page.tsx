import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Container } from "@/components/ui/layout/container"
import { HeroContent as CTAHeroContent } from "@/components/ui/cta/home/hero-content"
import { ArgumentsContent as CTAArgumentsContent } from "@/components/ui/cta/home/arguments-content"
import { FooterText as CTAFooterText } from "@/components/ui/cta/home/footer-text"
import { Waves } from "@/components/ui/paralax/waves"
import { authOptions } from "@/lib/auth"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="relative overflow-hidden">
      <Container>

        <CTAHeroContent />

        <CTAArgumentsContent />

        <CTAFooterText />

      </Container>

      <Waves />
    </div>
  )
}