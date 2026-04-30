import { Surface } from "@heroui/react/surface"
import { Modal } from "@heroui/react/modal"
import { Button } from "@heroui/react/button"
import { lazy, useEffect, useState } from "react";
import { useMovieContext } from "../providers/MovieProvider";
import { PlusIcon } from "@/components/icons";
const MagnetInput = lazy(() => import("./MagnetInput"))

interface MovieModalProps {
    isOpen: boolean,
    onOpenChange: (isOpen: boolean) => void,
    setHashes: React.Dispatch<React.SetStateAction<import("../../domain/entities/Hashes").HashResult[]>>
}

export const MovieCommunityModal: React.FC<MovieModalProps> = ({ isOpen, onOpenChange, setHashes }) => {
    const [magnet, setMagnet] = useState<string>('')
    const [isDisabled, setIsDisabled] = useState(false);
    const { addCommunityHash, status } = useMovieContext()
    const handleSubmit = async () => {
        const { extractMagnetInfo } = await import("@/utils/magnetGenerator")
        const info = await extractMagnetInfo(magnet)
        if (!info) return
        const result = await addCommunityHash(info.name, info.hash)
        if (result > 0) {
            const { hash, name } = info
            setHashes((prev) => [...prev, { hash, name }])
        }
    }
    useEffect(() => {
        const check = async () => {
            const { checkMagnet } = await import("@/utils/magnet/regexp")
            const isDisabled = !checkMagnet(magnet)
            setIsDisabled(isDisabled)
        }
        check()
    }, []);
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
                            <PlusIcon />
                            Añadir
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    )
}

export default MovieCommunityModal