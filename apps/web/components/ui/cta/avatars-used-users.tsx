import { Avatar } from "radix-ui"
import { Text } from "../Typography/text"

export function AvatarsUsedUsers() {

  const factoryImagesAvatar = [
    "https://plus.unsplash.com/premium_photo-1705563088246-3673a401ed6a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDV8fHxlbnwwfHx8fHw%3D",
    "https://plus.unsplash.com/premium_photo-1689530775582-83b8abdb5020?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fHw%3D",
    "https://plus.unsplash.com/premium_photo-1689533448099-2dc408030f0f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDN8fHxlbnwwfHx8fHw%3D",
    "https://plus.unsplash.com/premium_photo-1689565611422-b2156cc65e47?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D",
    "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ]

  const factoryUsersCount = 450

  return (
    <div className="flex gap-2 items-center">
      <div className="flex -space-x-2">
        {factoryImagesAvatar.map((image, index) => (
          <Avatar.Root key={index} className="w-12 h-12 rounded-full overflow-hidden border-2 border-background">
            <Avatar.Image src={image} alt={`User ${index + 1}`} className="w-full h-full object-cover" />
            <Avatar.Fallback className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
              {`U${index + 1}`}
            </Avatar.Fallback>
          </Avatar.Root>
        ))}
      </div>

      <div>
        <Text variant="muted">
          +{factoryUsersCount}
        </Text>
      </div>

    </div>
  )
}