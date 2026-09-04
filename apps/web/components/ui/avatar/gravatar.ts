import md5 from "md5"

export function getGravatarUrl(email: string) {
  const hash = md5(email.trim().toLowerCase())

  return `https://www.gravatar.com/avatar/${hash}?d=404`
}

export function getGeneratedAvatarUrl(initial: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initial)}&background=random&color=fff&bold=true`
}