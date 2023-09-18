import { threadId } from 'worker_threads';
import NxCrypto from './nx-crypto';
import NxDate from './nx-date';
import NxMath from './nx-math';
import NxUtils from './nx-utils';

export class NxService {
  crypto; date; utils; math;
  constructor() {
    this.crypto = NxCrypto;
    this.date = NxDate;
    this.math = NxMath;
    this.utils = NxUtils;
  }
}
