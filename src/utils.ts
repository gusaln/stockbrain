export type ServerActionWithState<TState> = (prevState: TState, formData: FormData) => TState | Promise<TState>;
export type ServerAction = (formData: FormData) => void | Promise<void>;
