import {useTranslations} from 'next-intl'

export function AboutRolesHeader() {

  const t = useTranslations('CreateProject.StepFour.AboutRoles.Header')

  return (
    <div className="space-y-1">
      <h3 className="text-lg font-semibold text-foreground">
        {t('Title')}
      </h3>

      <p className="text-sm text-muted-foreground">
        {t('Subtitle')}
      </p>
    </div>
  )
}