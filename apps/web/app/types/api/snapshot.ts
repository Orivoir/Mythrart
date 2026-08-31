export interface SnapshotResponseAPI {
  snapshot: {
    version: number,
    id: string,
    ebookId: string,
    createdAt: number,
    isCurrentSnapshot: boolean,
  },
  downloadUrl: string
}