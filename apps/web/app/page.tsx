import { Container } from "@/components/ui/layout/container"
import { HeroContent as CTAHeroContent } from "@/components/ui/cta/home/hero-content"
import { ArgumentsContent as CTAArgumentsContent } from "@/components/ui/cta/home/arguments-content"
import { FooterText as CTAFooterText } from "@/components/ui/cta/home/footer-text"
import { Waves } from "@/components/ui/paralax/waves"

export default async function Home() {

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