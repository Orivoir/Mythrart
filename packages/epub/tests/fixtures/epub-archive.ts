import type { EpubArchiveFile } from "../../types"

export function createArchiveFixture(): EpubArchiveFile[] {
  return [
    {
      path: "META-INF/container.xml",
      data: `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0">
  <rootfiles>
    <rootfile
      full-path="OEBPS/content.opf"
      media-type="application/oebps-package+xml"
    />
  </rootfiles>
</container>`,
    },
    {
      path: "OEBPS/content.opf",
      data: `<?xml version="1.0" encoding="UTF-8"?>
<package version="3.0">
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
</package>`,
    },
    {
      path: "OEBPS/nav.xhtml",
      data: `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
  <body><nav><ol><li><a href="chapters/chapter-1.xhtml">Chapter 1</a></li></ol></nav></body>
</html>`,
    },
    {
      path: "OEBPS/chapters/chapter-1.xhtml",
      data: `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
  <body><section><h1>Chapter 1</h1><p>Hello EPUB!</p></section></body>
</html>`,
    },
    {
      path: "OEBPS/styles.css",
      data: "body { margin: 5%; }\n",
    },
    {
      path: "OEBPS/images/cover.png",
      data: new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 1, 2, 3]),
    },
  ]
}
