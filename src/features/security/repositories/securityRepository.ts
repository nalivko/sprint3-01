import { ObjectId } from "mongodb"
import { authSessionsCollection } from "../../../db/mongodb"

export const securityRepository = {
    async deleteDeviceById(id: string): Promise<boolean> {
        const result = await authSessionsCollection.deleteOne({_id: new ObjectId(id)})

        return result.deletedCount === 1
    },

    async deleteAllDevices(userId: string, deviceId: string) {
        const result = await authSessionsCollection.deleteMany(
            {
                userId: userId,
                deviceId: {$nin: [deviceId]}
            }
        )

        console.log(result);
        
        return result.deletedCount >= 1
    }
}