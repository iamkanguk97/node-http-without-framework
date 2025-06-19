'use strict';

import path from 'path';
import { __dirname } from '../utils/path.util.js';
import { readFileWithFs } from '../utils/file.util.js';

export class DisplayIdEntity {
    static displayIdDataPath = path.join(__dirname(), '../../data/DisplayId.json');

    static getParsedDisplayIdData = async () => {
        const rawDisplayIdData = await readFileWithFs(this.displayIdDataPath);
        return JSON.parse(rawDisplayIdData);
    };

    static getUserSeqDisplayId = async () => {
        const displayUserIdData = await this.getParsedDisplayIdData();

        if (!(displayUserIdData && displayUserIdData.length)) {
            throw new Error('세팅이 잘못되었습니다.');
        }

        return displayUserIdData[0].userId;
    };

    static setNextUserSeqDisplayId = async () => {
        const displayUserIdData = await this.getParsedDisplayIdData();
    };
}
