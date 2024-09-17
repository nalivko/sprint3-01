import { ObjectId } from "mongodb"
import { authSessionsCollection } from "../../../db/mongodb"

export const securityRepository = {
    async getDeviceById(id: string) {
        return await authSessionsCollection.findOne({deviceId: id})
    },

    async deleteDeviceById(id: string): Promise<boolean> {
        console.log('id', id);
        
        const result = await authSessionsCollection.deleteOne({deviceId: id})

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