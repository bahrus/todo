///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
///<reference path="todo.ts"/>

module todo.Polymer{
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
		path?: string;
		objRef?: T
	}
}
