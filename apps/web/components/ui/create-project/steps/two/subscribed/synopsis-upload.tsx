import { FileText, CloudUpload, Info } from "lucide-react"
import { FileUpload } from "@/components/ui/file-upload"
import { Title, Text } from "@/components/ui/Typography"

import { useTranslations } from "next-intl"

interface SynopsisUploadProps {
  onFileChange: (file: File) => void
}

export function SynopsisUpload({
  onFileChange,
}: SynopsisUploadProps) {

  const t = useTranslations("CreateProject.StepTwo.UploadArea")

  const handleChange = (files: File[]) => {
    const file = files[0]
    if (!file) {
      return
    }

    onFileChange(file)
  }

  return (
    <div className="space-y-3">
      <FileUpload
        maxSize={10 * 1024 * 1024}
        allowedFileTypes={[
          "application/pdf",
          "text/plain",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ]}
        multiple={false}
        maxFiles={1}
        onChange={handleChange}
      >
        <div
          className="
            flex min-h-48 cursor-pointer flex-col items-center
            justify-center gap-3 rounded-lg border border-dashed
            border-border bg-soft-blue px-6 py-8 text-center
            transition-colors hover:border-border-hover
            hover:bg-soft-blue-hover
          "
        >
          <div
            className="
              flex size-11 p-0.5 items-center justify-center
              rounded-full bg-soft-blue-hover text-accent
            "
          >
            <CloudUpload
              className="size-10"
              aria-hidden="true"
            />
          </div>

          <div className="space-y-1">
            <Title className="text-base">
              {t("DropzoneText")}
            </Title>

            <Text variant="muted">
              {t("AllowedFormatText")}
            </Text>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText
              className="size-4"
              aria-hidden="true"
            />

            <span>
              {t("SelectText")}
            </span>
          </div>
        </div>
      </FileUpload>

      <Text className="flex items-center gap-2 text-sm text-muted text-xs bg-soft-blue px-4 py-4 rounded-md">
        <Info className="text-accent" size={16} />
        {t("HelperText")}
      </Text>
    </div>
  )
}