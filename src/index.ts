import 'reflect-metadata';
import { Container } from 'inversify';
import { interfaces, InversifyRestifyServer, TYPE } from 'inversify-restify-utils';
import { TransactionsController } from './controllers/TransactionsController';
import { InMemoryStorage } from './storages/InMemoryStorage';
import restify from 'restify';
import { DefaultController } from './controllers/DefaultController';
import { JobQueue } from './lockers/JobQueue';
import { AccountEntity } from './entities/AccountEntity';

// set up container
export const container = new Container();

container.bind<interfaces.Controller>(TYPE.Controller)
	.to(TransactionsController)
	.whenTargetNamed('TransactionsController');

container.bind<interfaces.Controller>(TYPE.Controller)
	.to(DefaultController)
	.whenTargetNamed('DefaultController');

container.bind(InMemoryStorage).toSelf().inSingletonScope();
container.bind(JobQueue).toSelf().inSingletonScope();

container.bind(AccountEntity).toSelf();

// create server
let server = new InversifyRestifyServer(container);
server.setConfig((app) => {
	app.use(restify.plugins.acceptParser(app.acceptable));
	app.use(restify.plugins.queryParser());
	app.use(restify.plugins.bodyParser());
});

const app = server.build();
app.listen(3000, 'localhost');

console.info(`🚀 Rest Server is available at port 3000`);
