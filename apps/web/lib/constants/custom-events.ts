// Custom event names for the application prefix with app name, for no conflict with others modules 
const PREFIX_CUSTOM_EVENT = "mythrart:"

export const EVENT_NAME_CREATE_NEW_PROJECT = `${PREFIX_CUSTOM_EVENT}create-new-project`
export const EVENT_NAME_SHOW_MORE_PRESET_COVER = `${PREFIX_CUSTOM_EVENT}show-more-preset-cover`
export const EVENT_NAME_CLICK_DEMO = `${PREFIX_CUSTOM_EVENT}click-demo`
export const EVENT_NAME_SHOW_ANALYSIS_DETAILS = `${PREFIX_CUSTOM_EVENT}show-analysis-details`


export type DetailType = Record<string, any>

export type EmitEventOptions = {
  eventName: string;
  node?: HTMLElement | null;
  detail?: DetailType;
}

export function emitEvent({ eventName, node, detail = {}}: EmitEventOptions) {

  if(!eventName) {
    throw new Error("Have try emit a custom event, without specifying a event name.");
  }

  const dispatcher = node ?? window

  const event = new CustomEvent(eventName, { detail, bubbles: true, composed: true })

  dispatcher.dispatchEvent(event)
}

const fireEvent = {
  showMorePresetCover: (detail: DetailType = {}) => (
    emitEvent({ eventName: EVENT_NAME_SHOW_MORE_PRESET_COVER, detail })
  ),
  createNewProject: (detail: DetailType = {}) => (
    emitEvent({ eventName: EVENT_NAME_CREATE_NEW_PROJECT, detail })
  ),
  clickDemo: (detail: DetailType = {}) => (
    emitEvent({ eventName: EVENT_NAME_CLICK_DEMO, detail })
  ),
  showAnalysisDetails: (detail: DetailType = {}) => (
    emitEvent({ eventName: EVENT_NAME_SHOW_ANALYSIS_DETAILS, detail })
  )
}

export default fireEvent