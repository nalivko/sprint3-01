import { ObjectId } from "mongodb"

export type ExpiredTokenDbType = {
  _id?: ObjectId,
  token: string
}