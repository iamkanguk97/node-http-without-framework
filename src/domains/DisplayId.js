'use strict';

import path from 'path';
import { promises as fs } from 'fs';
import { __dirname } from '../utils/path.util.js';

export class DisplayId {
  static displayIdDataPath = path.join(
    __dirname(),
    '../../data/DisplayId.json'
  );

  /**
   * userId: User의 Custom Id
   *
   * @param {*} data
   */
  constructor(data) {
    this.userId = data.userId;
  }

  static getUserSeqDisplayId = async () => {
    const rawDisplayUserIdData = await fs.readFile(
      this.displayIdDataPath,
      'utf8'
    );
    const displayUserIdData = JSON.parse(rawDisplayUserIdData);

    if (!(displayUserIdData && displayUserIdData.length)) {
      throw new Error('세팅이 잘못되었습니다.');
    }

    return displayUserIdData[0].userId;
  };
}