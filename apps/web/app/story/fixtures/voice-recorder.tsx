import { VoiceRecorder } from "@/components/ui/voice-recording"

export default function VoiceRecorderFixture() {

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">
          Voice Recorder
        </h2>

        <p className="text-sm text-muted-foreground">
          Enregistreur vocal interactif.
        </p>
      </div>

      <div className="max-w-xl flex flex-col gap-12">
        <VoiceRecorder disabled={false} />
        <VoiceRecorder disabled={true} />
      </div>
    </section>
  )
}