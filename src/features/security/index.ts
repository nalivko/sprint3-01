import {Router} from 'express'
import { authJWTMiddleware } from '../../global-middlewares/authJWTMiddleware'
import { getDevicesController } from './controllers/getDevicesController'
import { deleteAllDevicesController } from './controllers/deleteAllDevicesController'
import { deleteDeviceController } from './controllers/deleteDeviceController'

export const securityRouter = Router({})

securityRouter.get('/devices', authJWTMiddleware, getDevicesController)
securityRouter.delete('/devices', authJWTMiddleware, deleteAllDevicesController)
securityRouter.delete('/devices/:id', authJWTMiddleware, deleteDeviceController)