import { ProjectCover } from "./project-cover"
import { ProjectDescribe } from "./project-describe"
import { ProjectInformations } from "./project-informations"
import { ProjectTypeSelection } from "./project-type-selection"
import { ProjectTheming } from "./project-theming"

import type { CreateProjectStepOneProps } from "./types"

export function CreateProjectStepOne({
  value,
  projectTypes,
  themes,
  coverPresets,
  onChange,
  onCoverChange,
  onCoverPresetChange
}: CreateProjectStepOneProps) {
  return (
    <div className="space-y-5">
      <ProjectInformations
        value={{
          title: value.title,
          subtitle: value.subtitle,
        }}
        onChange={onChange}
      />

      <ProjectTypeSelection
        value={value.type}
        options={projectTypes}
        onChange={(type) => onChange("type", type)}
      />

      <ProjectDescribe
        value={value.description}
        onChange={(description) =>
          onChange("description", description)
        }
      />

      <ProjectTheming
        value={value.theme}
        themes={themes}
        onChange={(theme) => onChange("theme", theme)}
      />

      <ProjectCover
        cover={value.cover}
        coverPreset={value.coverPreset}
        coverPresets={coverPresets}
        onCoverChange={onCoverChange}
        onCoverPresetChange={onCoverPresetChange}
      />
    </div>
  )
}