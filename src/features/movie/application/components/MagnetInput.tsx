import { checkMagnet } from "@/utils/magnetGenerator"
import { Description, FieldError, Input, Label, TextField } from "@heroui/react"

interface MagnetInputProps {
    onChange: React.Dispatch<React.SetStateAction<string>> | ((magnet: string) => {})
    magnet: string
}

export const MagnetInput: React.FC<MagnetInputProps> = ({
    onChange,
    magnet
}) => {
    console.log(magnet)
    const isInvalid = magnet ? !checkMagnet(magnet) : false
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