

import { Types } from 'mongoose';

import { IResponseType } from '../../core/IResponseType.interface';


import TalukaModel from '../../models/taluka.model';
import { MESSAGE } from '../../shared/constants/app.const';
import { NxService } from '../../shared/nx-library/nx-service';


export class TalukaService {
    constructor(private nx: NxService) { }


    /**
     * @name create
     * @param {Object} params
     */
    create = async (params: any): Promise<IResponseType> => {
        try {
            let response: IResponseType;
            console.log('params', params);
            const {
                stateCode,
                districtCode, code,
                name: {
                    en,
                    hi
                },
                status
            } = params;

            const talukaModel = new TalukaModel({
                stateCode,
                districtCode, code,
                name: {
                    en,
                    hi
                },
                status
            });
            const createdTaluka = await talukaModel.save();
            response = { data: createdTaluka, message: MESSAGE.CREATE };
            return response;
        } catch (error) {
            throw new Error(error);
        }
    };

    findAll = async (_params: any): Promise<IResponseType> => {
        // eslint-disable-next-line no-useless-catch
        try {
            let response: IResponseType;
            const data = await TalukaModel.find();
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
