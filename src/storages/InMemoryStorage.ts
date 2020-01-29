import { injectable } from 'inversify';
import Lockable from '../decorators/Lockable';
import WriteLock from '../decorators/WriteLock';

@injectable()
@Lockable('balance')
export class InMemoryStorage {
	private balance: number;
	// @ts-ignore
	private transactionsHistory: any[];

	constructor() {
		this.balance = 0;
		this.transactionsHistory = [];
		console.log('InMemoryStorage created');
	}

	@WriteLock('balance')
	async decrease(amount: number) {
		console.debug(`START Balance DECREASED for ${amount}`);

		if (amount < 0) {
			throw new Error();
		}

		const newAmount = this.balance - amount;

		if (newAmount < 0) {
			throw new Error();
		}

		this.balance = newAmount;
		console.debug(`Balance DECREASED for ${amount}, balance ${this.balance}`);
	}

	@WriteLock('balance')
	async increase(amount: number) {
		console.debug(`START Balance INCREASED for ${amount}`);

		if (amount < 0) {
			throw new Error();
		}

		return new Promise((resolve) => {
			setTimeout(() => {
				this.balance = (this.balance || 0) + amount;
				console.debug(`Balance INCREASED for ${amount}, balance ${this.balance}`);
				resolve();
			}, 10000);
		});

	}

	async getBalance() {
		return this.balance;
	}
}
