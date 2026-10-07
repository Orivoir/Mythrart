import { BookOpen, PlayCircle } from "lucide-react"
import PromoBanner from "@/components/ui/promo-banner"
import { Title } from "@/components/ui/Typography"

export default function PromoBannerFixture() {
  return (
    <div className="mt-12 mb-6">

      <Title>Bannière de promotions de contenu</Title>
    
      <div className="flex w-full flex-row gap-6 p-6">
        <PromoBanner
          canDismiss
          label="Guide de démarrage"
          title="Bien démarrer avec Mythrart"
          describe="Découvrez comment organiser votre histoire, créer vos chapitres et exploiter tous les outils de Mythrart."
          variant="guide"
          widthFull
          actions={{
            main: {
              label: "Lire le guide",
              icon: {
                component: BookOpen,
                position: "start",
              },
            },
            second: {
              label: "Voir la vidéo",
              icon: {
                component: PlayCircle,
                position: "start",
              },
            },
          }}
        />

        <PromoBanner
          canDismiss
          label="Fonctionnalité à découvrir"
          title="Construisez votre univers"
          describe="Reliez vos personnages, lieux et événements pour garder une vision claire de votre histoire."
          variant="relations-entities"
          widthFull
          actions={{
            main: {
              label: "Découvrir les relations",
              icon: {
                component: BookOpen,
                position: "start",
              },
            },
            second: {
              label: "En savoir plus",
              icon: {
                component: PlayCircle,
                position: "start",
              },
            },
          }}
        />
      </div>
    </div>
  )
}