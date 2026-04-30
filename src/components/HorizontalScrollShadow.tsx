import { ScrollShadow } from "@heroui/react/scroll-shadow"
import { useRef } from "react";

interface HorizontalScrollProps {
    children: React.ReactNode
}

export const HorizontalScrollShadow: React.FC<HorizontalScrollProps> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null)

    const handleScroll = async (event: WheelEvent) => {
        event.preventDefault()
        const container = containerRef.current;
        if (!container) return
        const { HorizontalScroll } = await import('@/utils/scroll')
        const scrollAmount = event.deltaY;
        HorizontalScroll(container, scrollAmount / 4)
    };

    containerRef.current?.addEventListener('wheel', handleScroll, { passive: false })

    return (
        <ScrollShadow
            ref={containerRef}
            className="w-full flex overflow-auto"
            orientation="horizontal"
            hideScrollBar
        >
            {children}
        </ScrollShadow>

    )
}