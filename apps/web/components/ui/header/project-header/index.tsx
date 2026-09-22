import {
  ProjectTopHeader,
  type ProjectTopHeaderProps,
} from "./top-header"


export type ProjectHeaderProps = ProjectTopHeaderProps

export function ProjectHeader({
  ...props
}: ProjectHeaderProps) {
  return (
    <ProjectTopHeader {...props} />
  )
}