import { Button } from "@heroui/react"
import { useNavigate } from "react-router-dom"
import { ArrowLeftIcon } from "./icons"

interface BackButtonProps {
    message?: string
}

export const BackButton: React.FC<BackButtonProps> = ({
    message = "Volver"
}) => {
    const navigate = useNavigate()
    return (
        <Button
            variant="tertiary"
            onClick={() => navigate(-1)}
        >
            <ArrowLeftIcon />
            {message}
        </Button>
    )
}