///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
///<reference path="todo.ts"/>

module todo.PolymerActions {

	export interface PolymerElement extends HTMLElement{
		/**
		 * See https://www.polymer-project.org/1.0/docs/devguide/templates.html#dom-repeat
		 * @param path - path within element model to update
		 * @param obj - object to add on to array
		 */
		push(path: string, obj:any);

		pop(path: string) : any;
	}

	export interface IPolymerAction extends IAction{
		polymerElement?: PolymerElement;
	}

	export interface IPushIntoModelArrayAction<T> extends IPolymerAction{
		pathToArray?: string;
		arrayRef?:  T[];
	}

	export function pushIntoModelArrayActionImpl<T>(context: todo.IContext, callback: todo.ICallback, action: IPushIntoModelArrayAction<T>){
		if(!action) action = this;
		const el = action.polymerElement;
		action.arrayRef.forEach(itm => el.push(action.pathToArray, itm) )
	}

	export interface IPopFromModelAction<T> extends IPolymerAction{
		pathToArray?: string;
		item?: T;
	}

	export interface IMergeIntoModelAction<T> extends IPolymerAction{
		targetPath?: string;
		objRef?: T
	}

	interface FixedFormData { //Temporary until typescript 1.6
		prototype: FormData;
		new (form?: HTMLFormElement): FormData;
	}

	var FixedFormData: FixedFormData = FormData;

	export interface IStoreResultAction extends todo.PolymerActions.IPolymerAction{
		targetSelector?: string;
		transformer?: Function;
		targetPath?: string;
	}

	export interface IXHRExtensionAction extends IPolymerAction{
		successAction: IStoreResultAction;
		errorAction: IStoreResultAction;
		autoSubmit:  boolean;
		validator:  (fd: FormData) => boolean;
	}

	export function IXHRExtensionImpl(context: todo.IContext, callback: todo.ICallback, action: IXHRExtensionAction) {
		const polyEl =  action.polymerElement;
		if(polyEl.tagName !== 'FORM') throw `Not allowed to add XHRExtension to ${polyEl.tagName} element.`;
		const frmEl = <HTMLFormElement><any> polyEl;
		frmEl.addEventListener('submit', (ev:Event) => {
			//region handle submit event, turn it into ajax call
			ev.preventDefault();
			const request = new XMLHttpRequest();
			const action = frmEl.action;
			const method = frmEl.method;
			request.open(method, action);
			const frmData = new FixedFormData(frmEl);
			request.send(<any> frmData);
			//endregion
		});

	}
}
