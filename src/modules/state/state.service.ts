

import { Types } from 'mongoose';

import { IResponseType } from '../../core/IResponseType.interface';


import StateModel from '../../models/state.model';
import { MESSAGE } from '../../shared/constants/app.const';
import { NxService } from '../../shared/nx-library/nx-service';


export class StateService {
    constructor(private nx: NxService) { }


    /**
     * @name create
     * @param {Object} params
     */
    create = async (params: any): Promise<IResponseType> => {
        try {
            let response: IResponseType;
            console.log('params', params);
            const { code,
                name: {
                    en,
                    hi
                }, status } = params;
            console.log(params);

            const stateModel = new StateModel({
                code,
                name: {
                    en,
                    hi
                }, status
            });
            const createdState = await stateModel.save();
            response = { data: createdState, message: MESSAGE.CREATE };

            return response;
            console.log(response)
        } catch (error) {
            throw new Error(error);
        }

    };

    findAll = async (_params: any): Promise<IResponseType> => {
        // eslint-disable-next-line no-useless-catch
        try {
            let response: IResponseType;
            const data = await StateModel.find();
            console.log(data);
            response = {
                message: MESSAGE.GET,
                data: data
            };
            return response;
        } catch (error: any) {
            throw error;
        }
    }


}
