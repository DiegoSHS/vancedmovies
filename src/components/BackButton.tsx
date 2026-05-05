import { Link } from "@heroui/react/link";

import { ArrowLeftIcon } from "./icons";

interface BackButtonProps {
  message?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  message = "Volver",
}) => {
  return (
    <Link className="button button--tertiary gap-2" href="/page/1">
      <ArrowLeftIcon />
      {message}
    </Link>
  );
};

export default BackButton;
