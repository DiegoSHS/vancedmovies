import { Switch } from "@heroui/react/switch"
import { ListIcon, SquaresIcon } from "./icons"

interface ViewModeSwitchProps {
    mode: string
    isDisabled?: boolean
    swapViewMode: () => void
}

export const ViewModeSwitch = ({ mode, isDisabled = false, swapViewMode }: ViewModeSwitchProps) => {
    const SwitchControl = ({ isSelected }: { isSelected: boolean }) => (
        <Switch.Control className="bg-default">
            <Switch.Thumb>
                <Switch.Icon className="text-default">
                    {
                        isSelected ? (
                            <ListIcon className="size-5" />
                        ) : (
                            <SquaresIcon className="size-5" />
                        )
                    }
                </Switch.Icon>
            </Switch.Thumb>
        </Switch.Control>
    )
    return (
        <Switch
            aria-label="Modo de visualización"
            isDisabled={isDisabled}
            size="lg"
            className="self-end"
            isSelected={mode === 'table'}
            onChange={swapViewMode}
        >
            {SwitchControl}
        </Switch>
    )
}

export default ViewModeSwitch