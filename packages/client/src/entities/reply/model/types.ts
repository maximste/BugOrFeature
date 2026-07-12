export type Reply = {
  id: string
  author: string
  date: string
  body: string
  parentReplyId: string | null
  replies: Reply[]
}
