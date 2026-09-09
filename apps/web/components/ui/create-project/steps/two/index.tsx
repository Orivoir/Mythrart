"use client"

import {
  SynopsisActions,
  SynopsisHeader,
  SynopsisPremiumCTA,
} from "./free"

import {
  SynopsisAnalysis,
  SynopsisAnalysisComplete,
  SynopsisFile,
  SynopsisUpload,
} from "./subscribed"

import type { CreateProjectStepTwoProps } from "./types"

export function CreateProjectStepTwo({
  hasAnalysisAccess,
  value,
  analysis,
  onFileChange,
  onCancelAnalysis,
  onClickDemo,
  onShowDetails,
}: CreateProjectStepTwoProps) {
  const hasSynopsis = value.synopsisFile !== null

  if (!hasAnalysisAccess) {
    return (
      <div className="space-y-6">
        <SynopsisHeader isLocked={true} />

        <SynopsisPremiumCTA />

        <SynopsisActions
          onClickDemo={onClickDemo}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SynopsisHeader isLocked={false} />
      {!hasSynopsis ? (
        <SynopsisUpload
          onFileChange={onFileChange}
        />
      ) : (
        <>
          <SynopsisFile
            file={value.synopsisFile!}
          />

          {analysis.percent < 100 && (
            <SynopsisAnalysis
              percent={analysis.percent}
              onCancel={onCancelAnalysis}
            />
          )}

          {analysis.percent === 100 && analysis.data && (
            <SynopsisAnalysisComplete
              data={analysis.data}
              onShowDetails={onShowDetails}
            />
          )}
        </>
      )}
    </div>
  )
}