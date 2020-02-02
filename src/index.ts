import 'reflect-metadata';
import { Container } from 'inversify';
import { interfaces, InversifyRestifyServer, TYPE } from 'inversify-restify-utils';
import { TransactionsController } from './controllers/TransactionsController';
import { AccountingNotebookModel } from './models/AccountingNotebookModel';
import restify from 'restify';
import restifyErrors from 'restify-errors';
import { DefaultController } from './controllers/DefaultController';
import { JobQueue } from './locker/JobQueue';

// set up container
export const container = new Container();

container.bind<interfaces.Controller>(TYPE.Controller)
	.to(TransactionsController)
	.whenTargetNamed('TransactionsController');

container.bind<interfaces.Controller>(TYPE.Controller)
	.to(DefaultController)
	.whenTargetNamed('DefaultController');

container.bind(AccountingNotebookModel).toSelf().inSingletonScope();
container.bind(JobQueue).toSelf().inSingletonScope();

// create server
let server = new InversifyRestifyServer(container, { defaultRoot: '/api' });

server.setConfig(function (app) {
	app.use((req, _res, next) => {
		if (!req.is('json')) {
			next(new restifyErrors.NotAcceptableError(
				`Supported content types: [ 'application/json' ], given '${req.contentType()}'`
			));
		}
		next();
	});
	app.use(restify.plugins.queryParser());
	app.use(restify.plugins.bodyParser());
});

const app = server.build();
app.listen(3000, 'localhost');

console.info(`🚀 Rest Server is available at http://localhost:3000/api`);
