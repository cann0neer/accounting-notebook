import { Controller, Get, interfaces } from 'inversify-restify-utils';
import { inject, injectable } from 'inversify';
import { AccountingNotebookModel } from '../models/AccountingNotebookModel';
import { Next, Request, Response } from 'restify';

@Controller('/')
@injectable()
export class DefaultController implements interfaces.Controller {

	constructor(
		@inject(AccountingNotebookModel) private storage: AccountingNotebookModel
	) {}

	@Get('/')
	async getBalance(_req: Request, _res: Response, next: Next) {
		try {
			const balance = await this.storage.getBalance();
			return { balance };

		} catch (err) {
			next(err);
		}
	}
}
