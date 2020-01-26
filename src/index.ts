import 'reflect-metadata';
import { Container } from 'inversify';
import { interfaces, InversifyRestifyServer, TYPE } from 'inversify-restify-utils';
import { FooController } from './controllers/FooController';

// set up container
const container = new Container();

// note that you *must* bind your controllers to Controller
container.bind<interfaces.Controller>(TYPE.Controller).to(FooController).whenTargetNamed('FooController');

// create server
let server = new InversifyRestifyServer(container);

let app = server.build();
app.listen(3000, 'localhost');

console.info(`🚀 Rest Server is available at port 3000`);
