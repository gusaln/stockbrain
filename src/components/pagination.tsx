import { useState } from "react";

export function usePagination() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    return {
        page,
        setPage,
        limit,
        setLimit,
    };
}

const DEFAULT_WINDOW = 2;
export function PaginationSteps(props: {
    page: number;
    total: number;
    limit?: number;
    onPageChange: (page: number) => void;
    window?: number;
}) {
    const totalPages = Math.ceil(props.total / (props.limit ?? 10));
    const window = props.window ?? DEFAULT_WINDOW;

    const pages = [];
    if (props.page - window > 2) {
        pages.push(1, "...");
    } else if (props.page - window == 2) {
        pages.push(1);
    }

    for (let index = props.page - window; index <= props.page + window; index++) {
        if (index >= 1 && index <= totalPages) {
            pages.push(index);
        }
    }

    if (props.page + window < totalPages) {
        pages.push("...", totalPages);
    } else if (props.page + window == totalPages - 1) {
        pages.push(totalPages);
    }

    return (
        <div className="join">
            {pages.map((page, index) => {
                if (typeof page == "number") {
                    return (
                        <button
                            key={index}
                            className={`join-item btn ${page == props.page ? "btn-active" : ""}`}
                            onClick={() => props.onPageChange(page)}
                        >
                            {page}
                        </button>
                    );
                } else {
                    return (
                        <button key={index} className="join-item btn btn-disabled">
                            {page}
                        </button>
                    );
                }
            })}
        </div>
    );
}
