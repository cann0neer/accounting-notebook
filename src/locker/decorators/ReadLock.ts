import ActionLock from './ActionLock';

export default function WriteLock(field: string) {
	return ActionLock(field, 'R');
}
