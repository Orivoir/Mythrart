import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Mention from "@tiptap/extension-mention"
import Underline from "@tiptap/extension-underline"
import StarterKit from "@tiptap/starter-kit"
import type { Extensions } from "@tiptap/core"

export const testExtensions: Extensions = [
  StarterKit.configure({
    link: false,
    underline: false,
  }),
  Image,
  Link,
  Underline,
  Mention,
]