export default function VerifyRequestPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <section className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Check your mailbox</h1>
        <p className="mt-2 text-sm text-zinc-600">
          We sent you a secure sign-in link. Open your email and click the button to continue.
        </p>
        <p className="mt-4 text-xs text-zinc-500">
          If you did not receive the email, wait a minute and try again from the login page.
        </p>
      </section>
    </main>
  )
}
