import { getUserById } from '../models/userModel';
import { getAssetByUserId } from '../models/assetModel';
import { CustomError } from '../config/errHandler';

export const getProfile = async (userId: string): Promise<any> => {
    try {
        const user = await getUserById(userId);
        if (!user) {
            throw new CustomError(404,'User not found');
        }

        const asset = await getAssetByUserId({userId});
        if(!asset){
            throw new CustomError(404,'Asset not found');
        }

        const profile = {
            userId: user.id,
            firstName: user.firstName ? user.firstName : '',
            lastName: user.lastName ? user.lastName : '',
            telegramUid: user.telegramUid,
            score: {
                shell: asset.shell,
                pearl: asset.pearl,
                usdt: asset.usdt
            }
        };
        
        return profile;
    } catch (error) {
        console.error(error);
        throw error;
    }
};