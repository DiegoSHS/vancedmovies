import { Tooltip } from "@heroui/react/tooltip"
import { Link } from "@heroui/react/link"
import { InfoIcon } from "./icons"

export const AboutTooltip = ({ isIconOnly = false }: { isIconOnly?: boolean }) => {
    const InnerLink = () => {
        return (
            <Link
                className={`button button--ghost gap-2 ${isIconOnly && "button--icon-only"}`}
                aria-label="Acerca de"
                href="/about"
            >
                <InfoIcon />
                {
                    isIconOnly || ("Acerca de")
                }
            </Link>
        )
    }
    if (!isIconOnly) return <InnerLink />
    return (
        <Tooltip delay={300}>
            <InnerLink />
            <Tooltip.Content showArrow>Acerca de BOLIPeliculas</Tooltip.Content>
        </Tooltip>
    )
}