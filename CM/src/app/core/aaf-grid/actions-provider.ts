export interface Action {
	label: String;
	handler: (args?: any) => void;
}
export interface ActionsProvider {
	actions(): Array<Action>;
} 