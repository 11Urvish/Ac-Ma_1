

import { Types } from 'mongoose';

import { IResponseType } from '../../core/IResponseType.interface';


import DistrictModel from '../../models/district.model';
import { MESSAGE } from '../../shared/constants/app.const';
import { NxService } from '../../shared/nx-library/nx-service';


export class DistrictService {
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
                code,
                name: { en,
                    hi },
                status
            } = params;

            const districtModel = new DistrictModel({
                stateCode,
                code,
                name: {
                    en,
                    hi
                },
                status
            });
            const createdDistrict = await districtModel.save();
            response = { data: createdDistrict, message: MESSAGE.CREATE };
            return response;
        } catch (error) {
            throw new Error(error);
        }
    };

    findAll = async (_params: any): Promise<IResponseType> => {
        // eslint-disable-next-line no-useless-catch
        try {
            let response: IResponseType;
            const data = await DistrictModel.find();
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

    /**
 * @name findByStateId
 * @param {Object} params
 */
    // findByStateId = async (params: any): Promise<IResponseType> => {
    //     try {
    //         let response: IResponseType;
    //         const data: any = await StateModel.findOne({ _id: params.stateId });
    //         response = { data, message: MESSAGE.GET };
    //         return response;
    //     } catch (error) {
    //         throw error;
    //     }
    // };

    findByStateId = async (params: any): Promise<IResponseType> => {
        try {
            let response: IResponseType;
            const { stateCode } = params;

            console.log(stateCode);


            const data: any = await DistrictModel.findOne({ code: +stateCode });
            response = { data, message: MESSAGE.GET };
            return response;
        } catch (error) {
            throw error;
        }
    }
};


