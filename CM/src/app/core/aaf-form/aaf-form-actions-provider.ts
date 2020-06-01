export interface Action {
	handler: (args?: any) => void;
}
export interface ActionsProvider {
	actions(): Array<Action>;
} 