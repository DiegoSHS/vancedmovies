import { checkMagnet } from "@/utils/magnetGenerator";
import { Button, Description, FieldError, Input, Label, Modal, Surface, TextField } from "@heroui/react"
import { useState } from "react";
import { useMovieContext } from "../providers/MovieProvider";
import { HashResult } from "../../domain/entities/Hashes";

interface MovieModalProps {
    isOpen: boolean,
    onOpenChange: (isOpen: boolean) => void,
    setHashes: React.Dispatch<React.SetStateAction<HashResult[]>>
}

export const MovieCommunityModal: React.FC<MovieModalProps> = ({ isOpen, onOpenChange, setHashes }) => {
    const [magnet, setMagnet] = useState<string>('')
    const { addCommunityHash, loading } = useMovieContext()
    const handleSubmit = async () => {
        const { extractMagnetInfo } = await import("@/utils/magnetGenerator")
        const info = extractMagnetInfo(magnet)
        if (!info) return
        const result = await addCommunityHash(info.name, info.hash)
        if (result > 0) {
            const { hash, name } = info
            setHashes((prev) => [...prev, { hash, name }])
        }
    }
    const isInvalid = magnet ? !checkMagnet(magnet) : false
    const isDisabled = !checkMagnet(magnet)
    return (
        <Modal.Backdrop
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <Modal.Container>
                <Modal.Dialog>
                    <Modal.CloseTrigger />
                    <Modal.Header>
                        <Modal.Heading>
                            Añade un nuevo torrent
                        </Modal.Heading>
                    </Modal.Header>
                    <Modal.Body>
                        <Surface className="p-1 w-full">
                            <TextField
                                isRequired
                                name="magnet"
                                onChange={setMagnet}
                                isInvalid={isInvalid}
                            >
                                <Label>Magnet Link</Label>
                                <Input
                                    fullWidth
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
                        </Surface>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            onPress={handleSubmit}
                            className={isDisabled ? "" : "bg-success"}
                            isDisabled={isDisabled || loading}
                        >
                            Añadir
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    )
}