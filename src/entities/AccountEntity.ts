import { injectable } from 'inversify';

@injectable()
export class AccountEntity {
	public balance: number;

	constructor(balance = 0) {
		this.balance = balance;
	}
}
