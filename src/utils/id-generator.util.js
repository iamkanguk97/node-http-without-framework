import { v7 as uuidv7 } from 'uuid';
import { InternalServerErrorException } from '../exceptions/AppException.js';
import DisplayIdEntity from '../entities/DisplayId.js';

class IdGeneratorUtil {
    static DISPLAY_ID_TARGET = Object.freeze({
        USER: 'U',
        MOVIE: 'M'
    });

    static generateUniqueId() {
        return uuidv7();
    }

    /**
     * DisplayId는 유저ID만 현재는 설정함
     * 하지만 추후 확장성을 고려해서 설계할 예정
     * @returns
     */
    static async generateDisplayId(target) {
        switch (target) {
            case this.DISPLAY_ID_TARGET.USER:
                return new DisplayIdEntity().generateUserDisplayId();
            case this.DISPLAY_ID_TARGET.MOVIE:
                return new DisplayIdEntity().generateMovieDisplayId();
            default:
                throw new InternalServerErrorException('지원하지 않는 DisplayId 타입입니다.');
        }
    }
}

export default IdGeneratorUtil;
