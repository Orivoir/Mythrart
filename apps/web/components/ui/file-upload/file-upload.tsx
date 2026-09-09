"use client"

import {
  useRef,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from "react"

import { cn } from "@/lib/utils"

import type { FileUploadProps } from "./types"

export function FileUpload({
  children,
  maxSize,
  allowedFileTypes,
  multiple = false,
  maxFiles,
  onChange,
  onReject,
  disabled = false,
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFiles = (files: File[]) => {
    const rejected: File[] = []
    const valid: File[] = []

    for (const file of files) {
      const invalidType =
        allowedFileTypes &&
        allowedFileTypes.length > 0 &&
        !allowedFileTypes.includes(file.type)

      const invalidSize =
        maxSize !== undefined &&
        file.size > maxSize

      if (invalidType || invalidSize) {
        rejected.push(file)
        continue
      }

      valid.push(file)
    }

    const limitedFiles = multiple
      ? maxFiles !== undefined
        ? valid.slice(0, maxFiles)
        : valid
      : valid.slice(0, 1)

    if (limitedFiles.length !== valid.length) {
      rejected.push(...valid.slice(limitedFiles.length))
    }

    return {
      valid: limitedFiles,
      rejected,
    }
  }

  const handleFiles = (files: File[]) => {
    if (!files.length || disabled) {
      return
    }

    const { valid, rejected } = validateFiles(files)

    if (rejected.length > 0) {
      onReject?.(rejected)
    }

    if (valid.length > 0) {
      onChange?.(valid)
    }
  }

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(
      event.target.files ?? [],
    )

    handleFiles(files)

    // Permet de sélectionner à nouveau le même fichier.
    event.target.value = ""
  }

  const handleDragOver = (
    event: DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault()

    if (disabled) {
      return
    }

    event.dataTransfer.dropEffect = "copy"
  }

  const handleDrop = (
    event: DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault()

    if (disabled) {
      return
    }

    const files = Array.from(
      event.dataTransfer.files,
    )

    handleFiles(files)
  }

  const openFilePicker = () => {
    if (disabled) {
      return
    }

    inputRef.current?.click()
  }

  const handleKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
  ) => {
    if (disabled) {
      return
    }

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault()
      openFilePicker()
    }
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      className={cn(
        "cursor-pointer outline-none",
        disabled &&
          "cursor-not-allowed opacity-50",
        className,
      )}
      onClick={openFilePicker}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={allowedFileTypes?.join(",")}
        multiple={multiple}
        disabled={disabled}
        onChange={handleInputChange}
      />

      {children}
    </div>
  )
}
