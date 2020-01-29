import { TransactionType } from './TransactionType';

export interface ITransactionBody {
	type: TransactionType;
	amount: number;
}
