import {
  OCF_CONTAINER_NAMESPACE,
  PACKAGE_DOCUMENT_PATH,
  PACKAGE_MEDIA_TYPE
} from "./../constants"

export function createContainerXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<container
  xmlns="${OCF_CONTAINER_NAMESPACE}"
  version="1.0"
>
  <rootfiles>
    <rootfile
      full-path="${PACKAGE_DOCUMENT_PATH}"
      media-type="${PACKAGE_MEDIA_TYPE}"
    />
  </rootfiles>
</container>
`
}