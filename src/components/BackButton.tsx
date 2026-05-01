import { ArrowLeftIcon } from "./icons";
import { Link } from "@heroui/react/link";

interface BackButtonProps {
  message?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  message = "Volver",
}) => {
  return (
    <Link href="/page/1" className="button button--tertiary gap-2">
      <ArrowLeftIcon />
      {message}
    </Link>
  );
};

export default BackButton;
