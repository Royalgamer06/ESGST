import { DOM, ExtendedInsertPosition } from '../class/DOM';
import { Session } from '../class/Session';
import { ClassNames } from '../constants/ClassNames';

export interface BaseNodes {
	outer: HTMLElement | null;
}

export abstract class Base<T, TNodes extends BaseNodes, TData> {
	protected _nodes: BaseNodes = {
		outer: null,
	};
	protected _data: unknown;
	protected _hasBuilt = false;

	static getError(message: string): Error {
		return new Error(`${this.name}: ${message}`);
	}

	get nodes(): TNodes {
		return this._nodes as TNodes;
	}

	get data(): TData {
		return this._data as TData;
	}

	get hasBuilt(): boolean {
		return this._hasBuilt;
	}

	insert = (referenceEl: Element, position: ExtendedInsertPosition): T => {
		if (!this._nodes.outer) {
			this.build();
		}
		if (!this._nodes.outer) {
			throw this.getError('could not insert');
		}
		DOM.insert(referenceEl, position, this._nodes.outer);
		return (this as unknown) as T;
	};

	destroy = (): T => {
		if (!this._nodes.outer) {
			throw this.getError('could not destroy');
		}
		this._nodes.outer.remove();
		this._nodes.outer = null;
		this._hasBuilt = false;
		this.reset();
		return (this as unknown) as T;
	};

	hide = (): T => {
		if (!this._nodes.outer) {
			throw this.getError('could not hide');
		}
		this._nodes.outer.classList.add(ClassNames[Session.namespace].hidden);
		return (this as unknown) as T;
	};

	show = (): T => {
		if (!this._nodes.outer) {
			throw this.getError('could not show');
		}
		this._nodes.outer.classList.remove(ClassNames[Session.namespace].hidden);
		return (this as unknown) as T;
	};

	getError = (message: string): Error => {
		return new Error(`${this.constructor.name}: ${message}`);
	};

	abstract build(): T;
	abstract reset(): T;
	abstract parse(referenceEl: Element): T;
}
