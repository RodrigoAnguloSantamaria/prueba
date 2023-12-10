export interface IConfirmDialogData {
  type?: 'success' | 'error' | 'info' | 'confirm' | 'data' | 'alert' | 'logo',
  title: string
  subtitle?: string
  body?: IConfirmDialogDataContent[]
  footer?: string
  confirmCaption?: string
  cancelCaption?: string
}

export interface IConfirmDialogDataContent {
  title: string
  content: string
}
