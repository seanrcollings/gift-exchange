import { Cross1Icon, PlusIcon } from "@radix-ui/react-icons";
import { Box, Card, Flex, IconButton, Text, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { getColor } from "../utils";
import { type Person } from "../gift-exchange";
import { PersonLabel } from "./PersonLabel";

interface PeopleSelectionProps {
  people: Person[];
  onPeopleChange?: (people: Person[]) => void;
}

export function PeopleSelection(props: PeopleSelectionProps) {
  const { people, onPeopleChange } = props;
  const [currentValue, setCurrentValue] = useState("");

  const handleAddPerson = () => {
    if (
      people.some((p) => p.name === currentValue) ||
      currentValue.trim() === ""
    )
      return;

    const newPerson: Person = {
      name: currentValue.trim(),
      color: getColor(currentValue.trim()),
    };
    const newPeople = [...people, newPerson];
    onPeopleChange?.(newPeople);
    setCurrentValue("");
  };

  return (
    <Box>
      <Text as="label" htmlFor="people" size="3" color="gray">
        People
      </Text>
      <TextField.Root
        mt="1"
        id="people"
        value={currentValue}
        onChange={(event) => setCurrentValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleAddPerson();
          }
        }}
        placeholder="Add person..."
        size="3"
      >
        <TextField.Slot></TextField.Slot>
        <TextField.Slot>
          <IconButton variant="ghost" onClick={handleAddPerson}>
            <PlusIcon />
          </IconButton>
        </TextField.Slot>
      </TextField.Root>

      <Box mt="4">
        <Card>
          <Box maxHeight="200px" overflow="auto">
            {people.map((person) => (
              <Box key={person.name} p="1">
                <Flex align="center" justify="between">
                  <PersonLabel person={person} size="2" />
                  <IconButton
                    size="2"
                    variant="soft"
                    color="crimson"
                    onClick={() => {
                      const newPeople = people.filter(
                        (p) => p.name !== person.name
                      );
                      onPeopleChange?.(newPeople);
                    }}
                  >
                    <Cross1Icon />
                  </IconButton>
                </Flex>
              </Box>
            ))}
            {people.length === 0 && (
              <Text size="2" color="gray">
                No people added yet.
              </Text>
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
