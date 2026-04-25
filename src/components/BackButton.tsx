import { Button } from "@heroui/react"
import { useNavigate } from "react-router-dom"

export const BackButton: React.FC = () => {
    const navigate = useNavigate()
    return (
        <Button
            variant="ghost"
            onClick={() => navigate(-1)}
        >
            ← Volver
        </Button>
    )
}