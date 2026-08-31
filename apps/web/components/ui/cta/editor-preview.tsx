import Image from "next/image"

export function EditorPreview({
  small = false
}: {
  small?: boolean
}) {

  return (
    <div
      className="
        relative
        w-full
        md:aspect-4/3
        aspect-3/4
      "
    >
      {/* Main editor preview */}
      <div
        className="
          absolute
          inset-0
          overflow-hidden
          rounded-xl
          border
          border-border
          shadow-sm
        "
      >
        {!small ? (
        <Image
          src="https://placehold.co/1280x960/234f7d/ffffff.png"
          alt="Rich text editor preview"
          fill
          className="object-cover"
          priority
        />
        ): (
          <Image
            src="https://placehold.co/960x1280/234f7d/ffffff.png"
            alt="Rich text editor preview"
            fill
            className="object-cover"
            priority
          />
        )}
      </div>


      {/* Collaboration preview */}
      <div
        className="
          hidden
          md:flex
          absolute
          bottom-[-15]
          left-[-120]
          h-64
          w-80
          overflow-hidden
          rounded-lg
          border
          border-border
          bg-background
          shadow-lg
        "
      >
        <Image
          src="https://placehold.co/640x480/e8eef5/000000.png"
          alt="Collaboration system preview"
          fill
          className="object-cover"
        />
      </div>


      {/* Versioning preview */}
      <div
        className="
          hidden
          md:flex
          absolute
          bottom-4
          left-1/2
          -translate-x-1/2
          h-55
          w-45
          overflow-hidden
          rounded-lg
          border
          border-border
          bg-background
          shadow-lg
        "
      >
        <Image
          src="https://placehold.co/640x480/dce8f5/000000.png"
          alt="Versioning system preview"
          fill
          className="object-cover"
        />
      </div>


      {/* Translation preview */}
      <div
        className="
          absolute
          hidden
          md:flex
          bottom-[-60]
          right-[-30]
          h-75
          w-65
          overflow-hidden
          rounded-lg
          border
          border-border
          bg-background
          shadow-lg
        "
      >
        <Image
          src="https://placehold.co/640x480/f0f5fa/000000.png"
          alt="Translation assistant preview"
          fill
          className="object-cover"
        />
      </div>

    </div>
  )
}