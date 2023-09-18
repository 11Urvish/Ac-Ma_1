

import { Types } from 'mongoose';

import { IResponseType } from '../../core/IResponseType.interface';


import VillageModel from '../../models/village.model';
import { MESSAGE } from '../../shared/constants/app.const';
import { NxService } from '../../shared/nx-library/nx-service';


export class VillageService {
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
                districtCode, talukaCode,
                code,
                name: {
                    en,
                    hi
                },
                status
            } = params;

            const villageModel = new VillageModel({
                stateCode,
                districtCode, talukaCode,
                code,
                name: {
                    en,
                    hi
                },
                status
            });
            const createdVillage = await villageModel.save();
            response = { data: createdVillage, message: MESSAGE.CREATE };

            return response;
        } catch (error) {
            throw new Error(error);
        }
    };
    findAll = async (_params: any): Promise<IResponseType> => {
        // eslint-disable-next-line no-useless-catch
        try {
            let response: IResponseType;
            const data = await VillageModel.find();
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
