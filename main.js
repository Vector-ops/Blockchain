const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

}

class Block {
    constructor( timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        } 
        
        console.log("Block mined: " + this.hash);
    }
}

class Blockchain {
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;  //counteract hacking and mining
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block('01/01/2022', "Genesis block", "0");

    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined");
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];

    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;
        
        for(const block of this.chain) {
            for(const trans of block.transactions) {
                if(trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if(trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let tidCoin = new Blockchain();

tidCoin.createTransaction(new Transaction('address1', 'address2', 100));
tidCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\nStarting the miner.....');
tidCoin.minePendingTransactions('miner-address');

console.log('\nBalance of miner is', tidCoin.getBalanceOfAddress('miner-address')); //does not provide any reward until next block is mined


console.log('\nStarting the miner.....');
tidCoin.minePendingTransactions('miner-address');

console.log('\nBalance of miner is', tidCoin.getBalanceOfAddress('miner-address')); //first balance increase takes place due to first transaction
//new reward is in pendingtransactions and will recieve after the previous transactions are completed and a new block is mined

console.log('\nStarting the miner.....');
tidCoin.minePendingTransactions('miner-address');

console.log('\nBalance of miner is', tidCoin.getBalanceOfAddress('miner-address')); //balance deduction due to second transaction takes place









// console.log('Mining block 1...');
// tidCoin.addBlock(new Block(1, "10/07/2022", {amount: 4 }));

// console.log('Mining block 1...');
// tidCoin.addBlock(new Block(1, "12/07/2022", {amount: 10 }));

// console.log("Is blockchain valid?" + tidCoin.isChainValid());

// tidCoin.chain[1].data = {amount: 100}; //tampering with data
// tidCoin.chain[1].hash = tidCoin.chain[1].calculateHash();  //recalculating hash

// console.log("Is blockchain valid?" + tidCoin.isChainValid());

// console.log(JSON.stringify(tidCoin, null, 4));







//changes history
/** 
 * block class and constructor changed data to transactions to make it more appealing
 * block class and constructor removed "index" parameter since it serves order of blocks is determined their position in array but not their index
 *  "   addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        // newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }" replaced with minePendingTransactions()
 */