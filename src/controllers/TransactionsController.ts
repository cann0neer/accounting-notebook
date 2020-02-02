import { Next, Request, Response } from 'restify';
import restifyErrors from 'restify-errors';
import { Controller, Get, interfaces, Post } from 'inversify-restify-utils';
import { inject, injectable } from 'inversify';
import { ITransactionBody } from '../types/ITransactionBody';
import { TransactionType } from '../types/TransactionType';
import { AccountingNotebookModel } from '../models/AccountingNotebookModel';
import Joi from 'joi';
import { transactionInputSchema } from '../validations/transactionInputSchema';

@Controller('/transactions')
@injectable()
export class TransactionsController implements interfaces.Controller {

	constructor(
		@inject(AccountingNotebookModel) private storage: AccountingNotebookModel
	) {}

	@Post('/', (req, _res, next) => {
		const { error } = Joi.validate(req.body, transactionInputSchema);
		return error ? next(new restifyErrors.UnprocessableEntityError(error.message)) : next();
	})
	async makeTransaction(req: Request, _res: Response, next: Next) {
		try {
			const transactionBody = req.body as ITransactionBody;

			if (transactionBody.type === TransactionType.DEBIT) {
				await this.storage.decrease(Number(transactionBody.amount));
			} else if (transactionBody.type === TransactionType.CREDIT) {
				await this.storage.increase(Number(transactionBody.amount));
			} else {
				return new Error(`Unsupported transaction type=${transactionBody.type}`);
			}

			return { success: true };

		} catch (err) {
			next(err);
		}
	}

	@Get('/')
	async getTransactionHistory(_req: Request, _res: Response, next: Next) {
		try {
			return await this.storage.getTransactionHistory();

		} catch (err) {
			next(err);
		}
	}

	@Get('/:id', (req, _res, next) => {
		const { error } = Joi.validate(req.params.id, Joi.string().uuid());
		return error ? next(new restifyErrors.UnprocessableEntityError(error.message)) : next();
	})
	async getTransactionHistoryById(req: Request, _res: Response, next: Next) {
		try {
			const transactionHistoryItem = await this.storage.getTransactionHistoryById(req.params.id);
			if (!transactionHistoryItem) {
				return next(new restifyErrors.NotFoundError('Transaction Not Found'));
			}
			return transactionHistoryItem;

		} catch (err) {
			next(err);
		}
	}
}
