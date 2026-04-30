import { checkMagnet } from "@/utils/magnetGenerator";
import { Button, IconPlus, Modal, Surface } from "@heroui/react"
import { useState } from "react";
import { useMovieContext } from "../providers/MovieProvider";
import { HashResult } from "../../domain/entities/Hashes";
import { MagnetInput } from "./MagnetInput";

interface MovieModalProps {
    isOpen: boolean,
    onOpenChange: (isOpen: boolean) => void,
    setHashes: React.Dispatch<React.SetStateAction<HashResult[]>>
}

export const MovieCommunityModal: React.FC<MovieModalProps> = ({ isOpen, onOpenChange, setHashes }) => {
    const [magnet, setMagnet] = useState<string>('')
    const { addCommunityHash, status } = useMovieContext()
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
                            <MagnetInput magnet={magnet} onChange={setMagnet} />
                        </Surface>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            onPress={handleSubmit}
                            isDisabled={isDisabled || status === "loading"}
                        >
                            <IconPlus />
                            Añadir
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    )
}