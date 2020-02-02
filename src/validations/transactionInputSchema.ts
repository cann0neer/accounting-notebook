import Joi from 'joi';

export const transactionInputSchema = Joi.object({
	type: Joi.string().valid('debit', 'credit').required(),
	amount: Joi.number().greater(0).required()
});
