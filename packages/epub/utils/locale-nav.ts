
export function getLanguageCode(language: string): string {
  return language.trim().toLowerCase().split("-")[0]
}

export function getTocLabel(language: string): string {
  const labels: Record<string, string> = {
    de: "Inhaltsverzeichnis",
    en: "Contents",
    es: "Índice",
    fr: "Table des matières",
    it: "Indice",
    pt: "Sumário",
  }

  return labels[getLanguageCode(language)] ?? "Contents"
}

export 
function getLandmarkLabels(language: string): {
  cover: string
  bodymatter: string
  title: string
} {
  const labels: Record<
    string,
    { cover: string; bodymatter: string; title: string }
  > = {
    de: {
      cover: "Cover",
      bodymatter: "Beginn des Inhalts",
      title: "Navigation",
    },
    en: {
      cover: "Cover",
      bodymatter: "Start of content",
      title: "Navigation",
    },
    es: {
      cover: "Portada",
      bodymatter: "Inicio del contenido",
      title: "Navegación",
    },
    fr: {
      cover: "Couverture",
      bodymatter: "Début du contenu",
      title: "Navigation",
    },
    it: {
      cover: "Copertina",
      bodymatter: "Inizio del contenuto",
      title: "Navigazione",
    },
    pt: {
      cover: "Capa",
      bodymatter: "Início do conteúdo",
      title: "Navegação",
    },
  }

  return labels[getLanguageCode(language)] ?? labels.en
}