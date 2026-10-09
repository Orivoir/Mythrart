import type { Extensions } from "@tiptap/core"

import CharacterCount from "@tiptap/extension-character-count"
import FileHandler from "@tiptap/extension-file-handler"
import FindAndReplace from "@tiptap/extension-find-and-replace"
import {
  FontFamily,
  FontSize,
  TextStyle,
} from "@tiptap/extension-text-style"
import StarterKit from "@tiptap/starter-kit"

import { AssetImage } from "./custom/asset-image"

export const extensions: Extensions = [
  StarterKit,
  CharacterCount,
  TextStyle,
  FontFamily,
  FontSize,
  FileHandler,
  FindAndReplace,
  AssetImage
]

export function addExtensions(
  base: Extensions,
  ...additional: Extensions
): Extensions {
  return [
    ...base,
    ...additional,
  ]
}

export type { JSONContent } from "@tiptap/core"
export {EntityMention} from "./custom/entity-mention"
export {Placeholder} from "@tiptap/extension-placeholder"
export {SaveShortcut} from "./custom/save-shortcut"
