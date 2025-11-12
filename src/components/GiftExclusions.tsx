import { Box, Card, Flex, IconButton, Select, Text } from "@radix-ui/themes";
import { Cross1Icon, PlusIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import type { Person } from "../gift-exchange";
import { PersonLabel } from "./PersonLabel";

interface GiftExclusionsProps {
  people: Person[];
  exclusions?: Record<string, string[]>;
  onExclusionsChange?: (exclusions: Record<string, string[]>) => void;
}

export function GiftExclusions({
  people,
  exclusions = {},
  onExclusionsChange,
}: GiftExclusionsProps) {
  const [selectedGiver, setSelectedGiver] = useState("");
  const [selectedReceiver, setSelectedReceiver] = useState("");

  const getPersonByName = (name: string) => people.find((p) => p.name === name);

  const handleAddExclusion = () => {
    if (
      !selectedGiver ||
      !selectedReceiver ||
      selectedGiver === selectedReceiver
    )
      return;
    const current = exclusions[selectedGiver] || [];
    if (current.includes(selectedReceiver)) return;
    const updated = {
      ...exclusions,
      [selectedGiver]: [...current, selectedReceiver],
    };
    onExclusionsChange?.(updated);
    setSelectedReceiver("");
  };

  const handleRemoveExclusion = (giver: string, receiver: string) => {
    const updated = {
      ...exclusions,
      [giver]: exclusions[giver].filter((r) => r !== receiver),
    };
    if (updated[giver].length === 0) delete updated[giver];
    onExclusionsChange?.(updated);
  };

  return (
    <Box>
      <Text size="3" color="gray">
        Exclusions
      </Text>
      <Flex gap="2" mt="2" align="center">
        <Select.Root value={selectedGiver} onValueChange={setSelectedGiver}>
          <Select.Trigger placeholder="Select person" style={{ width: 120 }} />
          <Select.Content>
            {people.map((person) => (
              <Select.Item key={person.name} value={person.name}>
                {person.name}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        <Text>can't give to</Text>
        <Select.Root
          value={selectedReceiver}
          onValueChange={setSelectedReceiver}
        >
          <Select.Trigger placeholder="Select person" style={{ width: 120 }} />
          <Select.Content>
            {people
              .filter(
                (p) =>
                  p.name !== selectedGiver &&
                  !(exclusions[selectedGiver] || []).includes(p.name)
              )
              .map((person) => (
                <Select.Item key={person.name} value={person.name}>
                  {person.name}
                </Select.Item>
              ))}
          </Select.Content>
        </Select.Root>
        <IconButton
          variant="soft"
          onClick={handleAddExclusion}
          disabled={
            !selectedGiver ||
            !selectedReceiver ||
            selectedGiver === selectedReceiver
          }
        >
          <PlusIcon />
        </IconButton>
      </Flex>
      <Box mt="4">
        <Card>
          <Box maxHeight="200px" overflow="auto">
            {Object.keys(exclusions).length === 0 && (
              <Text size="2" color="gray">
                No exclusions set.
              </Text>
            )}
            {Object.entries(exclusions).map(([giver, receivers]) =>
              receivers.map((receiver) => {
                const giverPerson = getPersonByName(giver);
                const receiverPerson = getPersonByName(receiver);
                return (
                  <Flex
                    key={giver + receiver}
                    align="center"
                    justify="between"
                    p="1"
                  >
                    <Flex align="center" gap="2">
                      {giverPerson && (
                        <PersonLabel person={giverPerson} size="2" showName />
                      )}
                      <Text size="2">can't give to</Text>
                      {receiverPerson && (
                        <PersonLabel
                          person={receiverPerson}
                          size="2"
                          showName
                        />
                      )}
                    </Flex>
                    <IconButton
                      size="2"
                      variant="soft"
                      color="crimson"
                      onClick={() => handleRemoveExclusion(giver, receiver)}
                    >
                      <Cross1Icon />
                    </IconButton>
                  </Flex>
                );
              })
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
