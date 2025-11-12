import { Box, Text, TextField } from "@radix-ui/themes";

interface GiftsPerPersonInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function GiftsPerPersonInput({
  value,
  onChange,
}: GiftsPerPersonInputProps) {
  return (
    <Box>
      <Text as="label" htmlFor="giftsPerPerson" size="3" color="gray">
        Gifts per person
      </Text>
      <TextField.Root
        mt="1"
        id="giftsPerPerson"
        size="3"
        placeholder="Gifts per person"
        type="number"
        min={1}
        value={value.toString()}
        onChange={(event) => {
          const val = event.target.value;
          if (val === "") {
            onChange(0);
            return;
          }
          const numValue = Number(val);
          if (isNaN(numValue) || numValue < 1) {
            return;
          }
          onChange(numValue);
        }}
      />
    </Box>
  );
}
