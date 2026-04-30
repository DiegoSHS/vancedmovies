interface RepeaterProps<T> {
    items: T[];
    children: ((item: T) => React.ReactNode);
}

export const Repeater = <T extends object>(props: RepeaterProps<T>) => {
    return props.items.map(props.children)
}