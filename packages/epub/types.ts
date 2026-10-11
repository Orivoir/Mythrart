import type {JSONContent} from "@tiptap/core"

export interface EpubAsset {
  id: string
  fileName: string
  mimeType: string
  data: Uint8Array
}

export interface EpubChapter {
  id: string
  title: string
  position: number
  content: JSONContent
}

export type EpubContributorRole =
  | "adp" // Adaptateur
  | "art" // Artiste
  | "aut" // Auteur
  | "clb" // Collaborateur
  | "cmm" // Commentateur
  | "com" // Compilateur
  | "ctb" // Contributeur
  | "edt" // Éditeur éditorial
  | "ill" // Illustrateur
  | "nrt" // Narrateur
  | "pbl" // Éditeur / maison d'édition
  | "pht" // Photographe
  | "rev" // Réviseur
  | "trl" // Traducteur
  | "wat" // Rédacteur de texte ajouté
  | "oth" // Autre rôle

export interface EpubContributor {
  name: string
  role: EpubContributorRole
}

export interface EpubBook {
  id: string
  isbn?: string
  title: string
  subtitle: string | null
  description: string | null
  language: string
  createdAt: Date
  creator: string

  coverImage: EpubAsset | null
  assets: EpubAsset[]
  contributors: EpubContributor[]

  chapters: EpubChapter[]
}

export type CreateEpubOptions = EpubBook & {}

export interface EpubGenerationResult {
  data: Uint8Array
  fileName: string
  mimeType: "application/epub+zip"
}

export interface EpubResource {
  path: string
  data: Uint8Array
  mimeType: string
}

export interface EpubArchiveFile {
  path: string
  data: string | Uint8Array
}