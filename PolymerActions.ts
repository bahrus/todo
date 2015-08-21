///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
///<reference path="todo.ts"/>

module todo.PolymerActions {

	export interface PolymerElement extends HTMLElement{
		/**
		 * See https://www.polymer-project.org/1.0/docs/devguide/templates.html#dom-repeat
		 * @param path - path within element model to update
		 * @param obj - object to add on to array
		 */
		push?(path: string, obj:any);

		pop?(path: string) : any;
	}

	export interface IPolymerAction extends IAction{
		targetElement?: PolymerElement;
	}

	export interface IPushIntoModelArrayAction<T> extends IPolymerAction{
		pathToArray?: string;
		arrayRef?:  T[];
	}

	export function pushIntoModelArrayActionImpl<T>(context: todo.IContext, callback: todo.ICallback, action: IPushIntoModelArrayAction<T>){
		if(!action) action = this;
		const el = action.targetElement;
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

	var FixedFormData: FixedFormData = FormData; //Temporary until typescript 1.6

	export interface IStoreResultConfig{
		targetSelector?: string;
		transformer?: Function;
		targetPath?: string;
		
	}
	
	export interface IStoreResultAction extends IStoreResultConfig, todo.PolymerActions.IPolymerAction{
		resultMessage?: string;
		formElement?: HTMLFormElement;
	}
	
	function IStoreResultActionImpl(context:todo.IContext, callback: todo.ICallback, action: IStoreResultAction){
		const result = <any> action.resultMessage;
		let targetElements = [action.formElement];
		
		if(action.targetSelector){
			throw "not implemented";
		}
		if(!action.targetPath){
			throw "targetPath not specified."
		}
		targetElements.forEach(targetElement =>{
			targetElement[action.targetPath] = result;
		});
	}

	export interface IXHRExtensionAction extends IPolymerAction{
		successAction?: IStoreResultAction;
		errorAction?: IStoreResultAction;
		autoSubmit?:  boolean;
		validator?:  (fd: FormData) => boolean;
		cacheLastTransaction?: boolean;
		addTimestampToPreventServerSideCaching?: boolean;
		reprocessEvenWhenCached?: boolean;
		
	}
	
	
	
	function deepCompare(lhs: FormData, rhs: FormData){ //is there an es 2015 function that does this?
		return JSON.stringify(lhs) === JSON.stringify(rhs);
	}
	
	function processData(context:todo.IContext, callback: todo.ICallback, action: IXHRExtensionAction, data: any) {
		//const frmEl = <HTMLFormElement> action.targetElement;
		if(action.successAction){
			const sA = action.successAction;
			if(!sA.do){
				sA.do = IStoreResultActionImpl;
			}
			sA.resultMessage = data;
			sA.formElement = <HTMLFormElement> action.targetElement;
			sA.do(context, callback, sA);
			delete sA.resultMessage;
			delete sA.formElement;
		}
		
	}
	
	interface IXHRTransaction{
		frmAction: string;
		method: string;
		frmData: FormData;
		data: string;	
	}

    const lastTransaction = 'lastTransaction';

	export function IXHRExtensionImpl(context: todo.IContext, callback: todo.ICallback, action: IXHRExtensionAction) {
		if(!action) action = <IXHRExtensionAction> this;
		const polyEl =  action.targetElement;

		if(polyEl.tagName !== 'FORM') throw `Not allowed to add XHRExtension to ${polyEl.tagName} element.`;
		const frmEl = <HTMLFormElement><any> polyEl;
		
		//frmEl.addEventListener('submit', (ev:Event) => {
		frmEl.submit = () =>{
			//region handle submit event, turn it into ajax call if passes validation
			//const ev = window.event;
			//ev.preventDefault();
			const frmData = new FixedFormData(frmEl); //Temporary until typescript 1.6
			if(action.validator){
				if(!action.validator(frmData)) return;
			}
			const request = new XMLHttpRequest();
			const frmAction = frmEl.action;
			const method = frmEl.method;
			const lt = lastTransaction;
			if(action.cacheLastTransaction){
				const lastTransaction = <IXHRTransaction> frmEl[lt];
				if(lastTransaction){
					if((lastTransaction.frmAction === frmAction) && (lastTransaction.method === method)){
						if(deepCompare(lastTransaction.frmData, frmData)){
							//get from cache
							if(action.reprocessEvenWhenCached){
								processData(context, callback, action, lastTransaction.data);
							}
							return;
						}
					}
				}
				
			}
			let url = frmAction;
			if(action.addTimestampToPreventServerSideCaching){
				if(url.indexOf('?') > -1){
					url += '&';
				}else{
					url += '?';
				}
				url += 'todo_ts=' + (new Date()).getTime();
			}
			request.open(method, url);
			request.onreadystatechange = sc => {
				if(request.readyState === 4){
					if(action.cacheLastTransaction){
						const thisTransaction : IXHRTransaction = {
							frmAction: frmAction,
							method: method,
							frmData: frmData,
							data: request.responseText
						};
						frmEl[lastTransaction] = thisTransaction;
					}
					processData(context, callback, action, request.responseText);
				}
			}
			request.send(<any> frmData);
			//endregion
		}
		if(action.autoSubmit){
			const mutObserver = new MutationObserver(mutations =>{
				mutations.forEach(mutation => {
					console.log(mutation);
					frmEl.submit()
				});
				
			});
			const mutObserverConfig : MutationObserverInit = {
				childList: true,
				attributes: true,
				subtree: true,
			}
			mutObserver.observe(frmEl, mutObserverConfig);
			frmEl.submit();
		}
		
	}
}
