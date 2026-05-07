import { Tooltip } from "@heroui/react/tooltip";
import { Link } from "@heroui/react/link";

import { InfoIcon } from "./icons";

interface AboutTooltipProps {
  isIconOnly: boolean;
}

const InnerLink = ({ isIconOnly }: AboutTooltipProps) => {
  return (
    <Link
      aria-label="Acerca de"
      className={`button button--ghost gap-2 ${isIconOnly && "button--icon-only"}`}
      href="/about"
    >
      <InfoIcon />
      {isIconOnly || "Acerca de"}
    </Link>
  );
};

export const AboutTooltip = ({ isIconOnly = false }: AboutTooltipProps) => {
  if (!isIconOnly) return <InnerLink isIconOnly={isIconOnly} />;

  return (
    <Tooltip delay={300}>
      <InnerLink isIconOnly={isIconOnly} />
      <Tooltip.Content showArrow>Acerca de BOLIPeliculas</Tooltip.Content>
    </Tooltip>
  );
};
