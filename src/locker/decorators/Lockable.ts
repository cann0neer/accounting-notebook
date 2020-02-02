import { JobQueue } from '../JobQueue';

export default function Lockable(field: string) {
	return function <T extends {new(...args:any[]):{}}>(constructor:T) {
		const jobQueue = new JobQueue();
		Reflect.defineMetadata(field, { jobQueue }, constructor);
		return constructor;
	}
}
