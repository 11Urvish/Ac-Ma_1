import * as bcryptjs from 'bcryptjs';
import * as JWT from 'jsonwebtoken';
import CONFIG from '../../config/config';

class NxCrypto {

  /**
   * @name hashPassword
   */
  hashPassword = (password: string): string => {
    return bcryptjs.hashSync(password, bcryptjs.genSaltSync(10));
  }

  verifyPassword = async (hashPassword: string, password: string) => {
    try {
      console.log('hashPassword', hashPassword);
      const isValid = await bcryptjs.compare(password, hashPassword);
      console.log('isValid', isValid);
      return await bcryptjs.compare(password, hashPassword);
    } catch (error) {
      throw new Error(error);
    }
  }

  getToken = async (user: any) => {
    return await JWT.sign(
      {
        iss: 'dbe.user',
        sub: user._id,
        iat: Math.floor(Date.now() / 1000) - 30, // current time
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // current time + 1 day ahead
      },
      CONFIG.JWT_SECRET
    );
  }

}
export default new NxCrypto();
