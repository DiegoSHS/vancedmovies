export const HorizontalScroll = (element: HTMLDivElement, amount: number) => {
    element.scrollTo({
        left: element.scrollLeft + amount,
        behavior: 'smooth'
    })
}