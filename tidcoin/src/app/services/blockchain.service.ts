import { Injectable, Type } from '@angular/core';
const { Blockchain } = require('savjeecoin/src/blockchain');
const EC = require('elliptic');

@Injectable({
  providedIn: 'root',
})
export class BlockchainService {
  public blockchainInstance = new Blockchain();
  public walletKeys: Array<IWalletKey> = [];

  constructor() {
    this.blockchainInstance.difficulty = 1;
    this.blockchainInstance.minePendingTransactions('my-wallet-address');

    this.generateWalletKeys();
  }

  getBlocks() {
    return this.blockchainInstance.chain;
  }

  private generateWalletKeys() {
    const ec = new EC.ec('secp256k1');
    const key = ec.genKeyPair();

    this.walletKeys.push({
      keyObj: key,
      publicKey: key.getPublic('hex'),
      privateKey: key.getPrivate('hex'),
    });
  }
}

export interface IWalletKey {
  keyObj: any;
  publicKey: string;
  privateKey: string;
}
