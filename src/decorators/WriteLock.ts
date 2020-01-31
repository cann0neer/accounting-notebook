import { JobQueue } from '../lockers/JobQueue';

export default function WriteLock(field: string) {
	return (target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {

		const originalMethod = descriptor.value;

		descriptor.value = async function(args: any) {
			const { jobQueue }: { jobQueue: JobQueue } = Reflect.getMetadata(field, target.constructor);
			return new Promise((resolve, reject) => {
				jobQueue.addToQueue({
					target: target,
					action: originalMethod,
					params: args,
					actionType: 'W',
					resolve,
					reject
				});
			});
		};

		return descriptor;
	};
}
