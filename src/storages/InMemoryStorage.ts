import { injectable } from 'inversify';
import Lockable from '../decorators/Lockable';
import WriteLock from '../decorators/WriteLock';
import { AccountEntity } from '../entities/AccountEntity';
import { TransactionEntity } from '../entities/TransactionEntity';
import { TransactionType } from '../types/TransactionType';

@injectable()
@Lockable('balance')
export class InMemoryStorage {
	account: AccountEntity;
	transactionsHistory: TransactionEntity[];

	constructor() {
		this.account = new AccountEntity(0);
		this.transactionsHistory = [];

		this.decrease = this.decrease.bind(this);
		this.increase = this.increase.bind(this);

		console.log('InMemoryStorage created');
	}

	@WriteLock('balance')
	async decrease(amount: number) {
		console.debug(`START Balance DECREASED for ${amount}`);

		if (amount < 0) {
			throw new Error();
		}

		const newAmount = this.account.balance - amount;

		if (newAmount < 0) {
			throw new Error();
		}

		const transaction = new TransactionEntity(TransactionType.CREDIT, amount);
		this.transactionsHistory.push(transaction);
		this.account.balance = newAmount;
		console.debug(`Balance DECREASED for ${amount}, balance ${this.account.balance}`);
	}

	@WriteLock('balance')
	async increase(amount: number) {
		console.debug(`START Balance INCREASED for ${amount}`);

		if (amount < 0) {
			throw new Error();
		}

		return new Promise((resolve) => {
			setTimeout(() => {

				const transaction = new TransactionEntity(TransactionType.DEBIT, amount);
				this.transactionsHistory.push(transaction);
				this.account.balance = this.account.balance + amount;

				console.debug(`Balance INCREASED for ${amount}, balance ${this.account.balance}`);

				resolve();
			}, 1000);
		});

	}

	async getBalance() {
		return this.account.balance;
	}

	async getTransactionHistory() {
		return this.transactionsHistory;
	}
}
