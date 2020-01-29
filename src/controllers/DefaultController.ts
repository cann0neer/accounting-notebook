import { Controller, Get, interfaces } from 'inversify-restify-utils';
import { inject, injectable } from 'inversify';
import { InMemoryStorage } from '../storages/InMemoryStorage';

@Controller('/')
@injectable()
export class DefaultController implements interfaces.Controller {

	constructor(
		@inject(InMemoryStorage) private storage: InMemoryStorage
	) {}

	@Get('/')
	async getBalance() {
		const balance = await this.storage.getBalance();
		return { balance };
	}
}
