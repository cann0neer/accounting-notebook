import { JobQueue } from '../JobQueue';

export default function ActionLock(field: string, actionType: 'R' | 'W') {
	return (target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {

		const originalMethod = descriptor.value;

		descriptor.value = async function(args: any) {
			const { jobQueue }: { jobQueue: JobQueue } = Reflect.getMetadata(field, target.constructor);
			return new Promise((resolve, reject) => {
				jobQueue.addToQueue({
					target: target.constructor,
					action: originalMethod,
					params: args,
					actionType,
					resolve,
					reject
				});
			});
		};

		return descriptor;
	};
}
