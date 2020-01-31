import { injectable } from 'inversify';
import { container } from '../index';

interface IJob {
	target: any;
	action: (...args: any[]) => Promise<any>;
	params: any;
	actionType: 'R' | 'W';
	resolve: (value?: any | PromiseLike<any>) => void;
	reject: (reason?: any) => void;
}

@injectable()
export class JobQueue {
	private waitingQueue: IJob[];
	private isLocked: boolean;

	constructor() {
		this.waitingQueue = [];
		this.isLocked = false;
	}

	addToQueue(job: IJob) {
		this.waitingQueue.push(job);
		this.nextJob().catch(console.error);
	}

	async nextJob() {
		if (this.isLocked || !this.waitingQueue.length) {
			return ;
		}

		const nextJob = this.waitingQueue.shift();

		if (!nextJob) {
			return ;
		}

		if (nextJob.actionType === 'R') {
			this.isLocked = false;
		} else if (nextJob.actionType === 'W') {
			this.isLocked = true;
		}

		try {
			const target = container.get(nextJob.target.constructor);
			const resp = await nextJob.action.call(target, nextJob.params);
			nextJob.resolve(resp);
		} catch (err) {
			nextJob.reject(err);
		}

		this.isLocked = false;

		this.nextJob().catch(console.error);
	}
}
