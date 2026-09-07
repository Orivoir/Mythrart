"use client"

import { useState } from "react"
import {
  File,
  FileImage,
  FileText,
  Upload,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/ui/file-upload"

function FileUploadContent({
  icon: Icon = Upload,
  title,
  description,
}: {
  icon?: typeof Upload
  title: string
  description?: string
}) {
  return (
    <div
      className="
        flex min-h-32 w-full flex-col
        items-center justify-center
        rounded-lg border-2 border-dashed
        border-muted bg-surface px-6 py-8
        text-center
        transition-colors
        hover:border-accent/40
        hover:bg-accent/5
      "
    >
      <Icon className="size-7 text-accent" />

      <span className="mt-3 text-sm font-medium">
        {title}
      </span>

      {description && (
        <span className="mt-1 text-xs text-muted-foreground">
          {description}
        </span>
      )}
    </div>
  )
}

function FileList({
  files,
}: {
  files: File[]
}) {
  if (!files.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Aucun fichier sélectionné.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={`${file.name}-${file.lastModified}`}
          className="
            flex items-center gap-3 rounded-md
            border bg-surface p-3
          "
        >
          <File className="size-4 shrink-0 text-muted-foreground" />

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {file.name}
            </p>

            <p className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} Mo
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function FileUploadFixtures() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [rejectedFiles, setRejectedFiles] = useState<File[]>([])
  const [multipleFiles, setMultipleFiles] = useState<File[]>([])

  return (
    <div className="space-y-10 p-10">
      {/* Basic */}
      <section className="max-w-md space-y-3">
        <h2 className="text-lg font-medium">
          Basique
        </h2>

        <FileUpload
          onChange={setSelectedFiles}
        >
          <FileUploadContent
            title="Ajouter un fichier"
            description="Cliquez ou glissez-déposez un fichier"
          />
        </FileUpload>

        <FileList files={selectedFiles} />
      </section>

      {/* Image */}
      <section className="max-w-md space-y-3">
        <h2 className="text-lg font-medium">
          Image
        </h2>

        <FileUpload
          maxSize={5 * 1024 * 1024}
          allowedFileTypes={[
            "image/png",
            "image/jpeg",
            "image/webp",
          ]}
          onChange={setSelectedFiles}
          onReject={setRejectedFiles}
        >
          <FileUploadContent
            icon={FileImage}
            title="Ajouter une image"
            description="PNG, JPG ou WebP — 5 Mo maximum"
          />
        </FileUpload>

        <FileList files={selectedFiles} />

        {rejectedFiles.length > 0 && (
          <p className="text-sm text-danger">
            {rejectedFiles.length} fichier(s) rejeté(s).
          </p>
        )}
      </section>

      {/* Multiple */}
      <section className="max-w-md space-y-3">
        <h2 className="text-lg font-medium">
          Multiple
        </h2>

        <FileUpload
          multiple
          maxFiles={3}
          allowedFileTypes={[
            "image/png",
            "image/jpeg",
            "image/webp",
          ]}
          onChange={setMultipleFiles}
        >
          <FileUploadContent
            icon={FileImage}
            title="Ajouter des images"
            description="Jusqu'à 3 fichiers"
          />
        </FileUpload>

        <FileList files={multipleFiles} />
      </section>

      {/* PDF */}
      <section className="max-w-md space-y-3">
        <h2 className="text-lg font-medium">
          PDF
        </h2>

        <FileUpload
          maxSize={10 * 1024 * 1024}
          allowedFileTypes={[
            "application/pdf",
          ]}
          onChange={setSelectedFiles}
        >
          <FileUploadContent
            icon={FileText}
            title="Ajouter un document"
            description="PDF — 10 Mo maximum"
          />
        </FileUpload>
      </section>

      {/* Disabled */}
      <section className="max-w-md space-y-3">
        <h2 className="text-lg font-medium">
          Désactivé
        </h2>

        <FileUpload
          disabled
          allowedFileTypes={[
            "image/png",
            "image/jpeg",
          ]}
        >
          <FileUploadContent
            icon={FileImage}
            title="Upload désactivé"
            description="Le composant n'est pas disponible"
          />
        </FileUpload>
      </section>

      {/* Controlled callback */}
      <section className="max-w-md space-y-3">
        <h2 className="text-lg font-medium">
          Événements
        </h2>

        <FileUpload
          maxSize={1024 * 1024}
          allowedFileTypes={[
            "image/png",
            "image/jpeg",
          ]}
          onChange={(files) => {
            console.log("Files accepted:", files)
            setSelectedFiles(files)
          }}
          onReject={(files) => {
            console.log("Files rejected:", files)
            setRejectedFiles(files)
          }}
        >
          <FileUploadContent
            icon={FileImage}
            title="Tester la validation"
            description="Images uniquement — 1 Mo maximum"
          />
        </FileUpload>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedFiles([])
            setRejectedFiles([])
          }}
        >
          Réinitialiser
        </Button>
      </section>
    </div>
  )
}