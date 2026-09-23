import type { Extensions } from "@tiptap/core"

import CharacterCount from "@tiptap/extension-character-count"
import FileHandler from "@tiptap/extension-file-handler"
import FindAndReplace from "@tiptap/extension-find-and-replace"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import Underline from "@tiptap/extension-underline"
import {
  FontFamily,
  FontSize,
  TextStyle,
} from "@tiptap/extension-text-style"
import StarterKit from "@tiptap/starter-kit"

export const extensions: Extensions = [
  StarterKit,
  Link,
  Underline,
  Placeholder,
  CharacterCount,
  TextStyle,
  FontFamily,
  FontSize,
  FileHandler,
  FindAndReplace,
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