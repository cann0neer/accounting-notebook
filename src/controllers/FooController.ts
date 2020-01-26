import { Request } from 'restify';
import { Controller, Get, interfaces } from 'inversify-restify-utils';
import { injectable } from 'inversify';

@Controller('/foo')
@injectable()
export class FooController implements interfaces.Controller {

	constructor() {}

	@Get('/')
	// @ts-ignore
	private index(req: Request): string {
		return 'OK' + req.query.id;
	}
}
