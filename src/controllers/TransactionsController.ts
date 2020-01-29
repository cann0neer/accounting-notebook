import { Request } from 'restify';
import { Controller, interfaces, Post } from 'inversify-restify-utils';
import { inject, injectable } from 'inversify';
import { ITransactionBody } from '../types/ITransactionBody';
import { TransactionType } from '../types/TransactionType';
import { InMemoryStorage } from '../storages/InMemoryStorage';

@Controller('/transactions')
@injectable()
export class TransactionsController implements interfaces.Controller {

	constructor(
		@inject(InMemoryStorage) private storage: InMemoryStorage
	) {}

	// TODO: add params validation
	@Post('/')
	async makeTransaction(req: Request) {
		console.log(req.body);
		const transactionBody = req.body as ITransactionBody;

		if (transactionBody.type === TransactionType.DEBIT) {
			await this.storage.increase(Number(transactionBody.amount));
		} else if (transactionBody.type === TransactionType.CREDIT) {
			await this.storage.decrease(Number(transactionBody.amount));
		} else {
			return new Error();
		}

		return { success: true };
	}

	async getBalance() {
		const balance = await this.storage.getBalance();
		return { balance };
	}
}
