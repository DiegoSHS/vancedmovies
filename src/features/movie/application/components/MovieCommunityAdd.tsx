import { Input, Modal } from "@heroui/react"

interface MovieModalProps {
    isOpen: boolean,
    onOpenChange: (isOpen: boolean) => boolean
}

export const MovieCommunityModal: React.FC<MovieModalProps> = ({ isOpen, onOpenChange }) => {
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
                        <Input></Input>
                    </Modal.Body>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    )
}