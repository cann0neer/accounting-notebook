import { TransactionType } from '../TransactionType';
import uuid from 'uuid';

export class TransactionEntity {
	id: string;
	type: TransactionType;
	amount: number;
	effectiveDate: Date;

	constructor(type: TransactionType, amount: number) {
		this.id = uuid();
		this.effectiveDate = new Date();
		this.type = type;
		this.amount = amount;
	}
}
