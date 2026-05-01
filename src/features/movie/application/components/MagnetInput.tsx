import { Description } from "@heroui/react/description";
import { FieldError } from "@heroui/react/field-error";
import { TextField } from "@heroui/react/textfield";
import { Input } from "@heroui/react/input";
import { Label } from "@heroui/react/label";
import checkMagnet from "@/utils/magnet/regexp";

interface MagnetInputProps {
  onChange:
  | React.Dispatch<React.SetStateAction<string>>
  | ((magnet: string) => {});
  magnet: string;
}

export const MagnetInput: React.FC<MagnetInputProps> = ({
  onChange,
  magnet,
}) => {
  const isInvalid = magnet ? !checkMagnet(magnet) : false;

  return (
    <TextField
      fullWidth
      isRequired
      isInvalid={isInvalid}
      name="magnet"
      value={magnet}
      onChange={onChange}
    >
      <Label>Magnet Link</Label>
      <Input
        aria-label="magnet-link"
        placeholder="magnet:?xt=urn"
        variant="secondary"
      />
      {isInvalid ? (
        <FieldError>El link no es un magnet válido</FieldError>
      ) : (
        <Description>Escribe o pega el magnet link del torrent</Description>
      )}
    </TextField>
  );
};

export default MagnetInput;
