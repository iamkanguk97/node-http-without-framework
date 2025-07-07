'use strict';

import path from 'path';
import { __dirname } from '../utils/path.util.js';
import { promises as fs } from 'fs';
import IdGeneratorUtil from '../utils/id-generator.util.js';

class DisplayIdEntity {
    constructor() {
        this.databaseFilePath = path.join(__dirname(), '../../data/DisplayId.json');
    }

    async generateUserDisplayId() {
        // 기존 데이터가 없는 경우 'U0000001'로 고정
        // 데이터가 있는 경우 -> 이전 데이터 조회해서 Next 값 생성해서 Return`

        const result = await this.find();

        if (!(result && result.length && result[0].userId)) {
            const data = JSON.stringify([
                {
                    userId: 'U0000001',
                    ...(result[0].movieId && {
                        movieId: result[0].movieId
                    })
                }
            ]);

            await fs.writeFile(this.databaseFilePath, data);

            return 'U0000001';
        }

        return;
    }

    async generateMovieDisplayId() {
        // 영화 DisplayId 생성 로직은 추후 구현
        return;
    }

    async getNextDisplayId(target) {
        switch (target) {
            case IdGeneratorUtil.DISPLAY_ID_TARGET.USER:
                return await this.getNextUserDisplayId();
            case IdGeneratorUtil.DISPLAY_ID_TARGET.MOVIE:
                return await this.getNextMovieDisplayId();
            default:
                break;
        }
    }

    async getNextUserDisplayId() {
        return;
    }

    async getNextMovieDisplayId() {
        return;
    }

    async find() {
        const result = await fs.readFile(this.databaseFilePath, 'utf8');
        return JSON.parse(result);
    }
}

export default DisplayIdEntity;
