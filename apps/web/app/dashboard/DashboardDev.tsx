"use client"

import { FormEvent, useMemo, useState } from "react"
import { signOut, useSession } from "next-auth/react"

export default function DashboardDev() {
  const { data: session } = useSession()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [createMessage, setCreateMessage] = useState<string | null>(null)
  const [seedMessage, setSeedMessage] = useState<string | null>(null)
  const [isSeeding, setIsSeeding] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  const trimmedTitle = useMemo(() => title.trim(), [title])
  const canSubmitCreate = trimmedTitle.length > 0

  function resetCreateForm() {
    setTitle("")
    setSubtitle("")
    setShortDescription("")
    setCreateMessage(null)
  }

  function handleCreateEbookSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canSubmitCreate) {
      setCreateMessage("Title is required.")
      return
    }

    setCreateMessage(
      "UI ready. API call intentionally not implemented yet. Form payload is valid.",
    )
  }

  async function handleSeedDatabase() {
    setSeedMessage(null)
    setIsSeeding(true)

    try {
      const response = await fetch("/api/dev/fixtures", {
        method: "POST",
      })

      const payload = (await response.json()) as {
        message?: string;
        createdCount?: number;
      }

      if (!response.ok) {
        setSeedMessage(payload.message ?? "Unable to seed database.")
        return
      }

      setSeedMessage(
        `${payload.message ?? "Fixtures created."} Created: ${payload.createdCount ?? 0}`,
      )
    } catch {
      setSeedMessage("Unable to seed database.")
    } finally {
      setIsSeeding(false)
    }
  }

  async function handleClearDatabase() {
    setSeedMessage(null)
    setIsClearing(true)

    try {
      const response = await fetch("/api/dev/fixtures", {
        method: "DELETE",
      })

      const payload = (await response.json()) as {
        message?: string;
        deletedChapters?: number;
        deletedEbooks?: number;
      }

      if (!response.ok) {
        setSeedMessage(payload.message ?? "Unable to clear fixtures.")
        return
      }

      setSeedMessage(
        `${payload.message ?? "Fixtures cleared."} Deleted ebooks: ${payload.deletedEbooks ?? 0}, chapters: ${payload.deletedChapters ?? 0}`,
      )
    } catch {
      setSeedMessage("Unable to clear fixtures.")
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10">
      <section className="mx-auto w-full max-w-2xl rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Dashboard (Dev Tools)</h1>
        <p className="mt-2 text-sm text-zinc-600">Debug actions for local development.</p>

        <div className="mt-6 rounded-lg bg-zinc-100 p-4 text-sm text-zinc-700">
          {session?.user?.email ? (
            <span>
              Connected as <strong>{session.user.email}</strong>
            </span>
          ) : (
            <span>Loading session...</span>
          )}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => {
              resetCreateForm()
              setIsCreateDialogOpen(true)
            }}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            Create ebook
          </button>

          <button
            type="button"
            onClick={handleSeedDatabase}
            disabled={isSeeding || isClearing}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSeeding ? "Seeding..." : "Seed database"}
          </button>

          <button
            type="button"
            onClick={handleClearDatabase}
            disabled={isSeeding || isClearing}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isClearing ? "Clearing..." : "Clear database"}
          </button>
        </div>

        {seedMessage ? (
          <p className="mt-4 rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-700">
            {seedMessage}
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="mt-6 w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
        >
          Sign out
        </button>
      </section>

      {isCreateDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 px-4">
          <div className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">Create ebook</h2>
                <p className="mt-1 text-sm text-zinc-600">
                  UI-only form for now. No ebook create API call is sent.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateDialogOpen(false)}
                className="rounded-md px-2 py-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
                aria-label="Close dialog"
              >
                x
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleCreateEbookSubmit}>
              <div>
                <label htmlFor="ebook-title" className="mb-1 block text-sm font-medium text-zinc-800">
                  Title
                </label>
                <input
                  id="ebook-title"
                  name="title"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
                />
              </div>

              <div>
                <label htmlFor="ebook-subtitle" className="mb-1 block text-sm font-medium text-zinc-800">
                  Subtitle (optional)
                </label>
                <input
                  id="ebook-subtitle"
                  name="subtitle"
                  type="text"
                  value={subtitle}
                  onChange={(event) => setSubtitle(event.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
                />
              </div>

              <div>
                <label htmlFor="ebook-short-description" className="mb-1 block text-sm font-medium text-zinc-800">
                  Short description (optional)
                </label>
                <textarea
                  id="ebook-short-description"
                  name="shortDescription"
                  value={shortDescription}
                  onChange={(event) => setShortDescription(event.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
                />
              </div>

              {createMessage ? (
                <p className="rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-700">
                  {createMessage}
                </p>
              ) : null}

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!canSubmitCreate}
                  className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  )
}