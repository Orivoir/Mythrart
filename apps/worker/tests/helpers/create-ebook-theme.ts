import { prisma } from "@mythrart/database";

export default async function createEbookTheme(id: string) {
  return prisma.ebookTheme.create({
    data: {
      name: `Vintage Parchment ${id}`,
      slug: `vintage-parchment-${id}`,
      description: "A warm, classical reading theme",
      backgroundColor: "#FAF6EE",
      textColor: "#2B2A27",
      textFont: "Merriweather",
      titleFont: "Cinzel",
      subtitleFont: "Cinzel Decorative",
      headingColor: "#7C2D12",
      fontSize: "17px",
      lineHeight: "1.75",
      paragraphSpacing: "1.2rem",
      headingSpacing: "2.2rem",
    },
  });
}
