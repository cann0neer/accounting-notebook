import { injectable } from 'inversify';
import restifyErrors from 'restify-errors';
import Lockable from '../locker/decorators/Lockable';
import WriteLock from '../locker/decorators/WriteLock';
import { AccountEntity } from '../types/entities/AccountEntity';
import { TransactionEntity } from '../types/entities/TransactionEntity';
import { TransactionType } from '../types/TransactionType';
import ReadLock from '../locker/decorators/ReadLock';

@injectable()
@Lockable('balance')
export class AccountingNotebookModel {
	account: AccountEntity;
	transactionsHistory: TransactionEntity[];

	constructor() {
		this.account = new AccountEntity(0);
		this.transactionsHistory = [];

		this.decrease = this.decrease.bind(this);
		this.increase = this.increase.bind(this);
	}

	@WriteLock('balance')
	async decrease(amount: number) {
		if (amount < 0) {
			throw new Error();
		}

		const newAmount = this.account.balance - amount;

		if (newAmount < 0) {
			throw new restifyErrors.ConflictError('This transaction leads to negative account balance');
		}

		const transaction = new TransactionEntity(TransactionType.CREDIT, amount);
		this.transactionsHistory.push(transaction);
		this.account.balance = newAmount;

		console.debug(`Balance DECREASED for ${amount}, balance ${this.account.balance}`);
	}

	@WriteLock('balance')
	async increase(amount: number) {
		if (amount < 0) {
			throw new Error();
		}

		const transaction = new TransactionEntity(TransactionType.DEBIT, amount);
		this.transactionsHistory.push(transaction);
		this.account.balance = this.account.balance + amount;

		console.debug(`Balance INCREASED for ${amount}, balance ${this.account.balance}`);
	}

	@ReadLock('balance')
	async getBalance() {
		return this.account.balance;
	}

	async getTransactionHistory() {
		return this.transactionsHistory;
	}

	async getTransactionHistoryById(id: string) {
		return this.transactionsHistory.find(historyItem => historyItem.id === id);
	}
}
