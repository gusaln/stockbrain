export type ServerActionWithState<TState> = (prevState: TState, formData: FormData) => TState | Promise<TState>;
export type ServerAction = (formData: FormData) => void | Promise<void>;

export type PaginatedResponse<T> = {
    data: T[],
    page: number,
    limit: number,
    total: number,
}

export function createPaginatedResponse<T>(data: T[], page: number, limit: number, total: number): PaginatedResponse<T> {
    return {
        data,
        page,
        limit,
        total,
    };
}