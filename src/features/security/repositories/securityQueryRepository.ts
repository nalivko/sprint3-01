import { ObjectId } from "mongodb"
import { authSessionsCollection } from "../../../db/mongodb"

export const securityQueryRepository = {
    async getActiveDevices(userId: string) {
        const result = await authSessionsCollection.find({
            userId: userId,
            exp: {
                $gt: new Date().toISOString()
            }
        }).toArray()

        return result
    }
}