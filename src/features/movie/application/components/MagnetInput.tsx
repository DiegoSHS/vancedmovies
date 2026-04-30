import { Description, FieldError, Input, Label, TextField } from "@heroui/react"
import { useEffect, useState } from "react"

interface MagnetInputProps {
    onChange: React.Dispatch<React.SetStateAction<string>> | ((magnet: string) => {})
    magnet: string
}

export const MagnetInput: React.FC<MagnetInputProps> = ({
    onChange,
    magnet
}) => {
    const [isInvalid, setIsInvalid] = useState(false);
    useEffect(() => {
        const checkInvalid = async () => {
            const { checkMagnet } = await import('@/utils/magnetGenerator')
            const isInvalid = magnet ? !checkMagnet(magnet) : false
            setIsInvalid(isInvalid)
        }
        checkInvalid()
    }, []);
    return (
        <TextField
            isRequired
            name="magnet"
            onChange={onChange}
            isInvalid={isInvalid}
            value={magnet}
            fullWidth
        >
            <Label>Magnet Link</Label>
            <Input
                variant="secondary"
                aria-label="magnet-link"
                placeholder="magnet:?xt=urn"
            />
            {
                isInvalid ? (
                    <FieldError>El link no es un magnet válido</FieldError>
                ) : (
                    <Description>Escribe o pega el magnet link del torrent</Description>
                )
            }
        </TextField>
    )
}