import { Avatar, Flex, Text } from "@radix-ui/themes";
import { type Person } from "../gift-exchange";

interface PersonLabelProps {
  person: Person;
  size?: "1" | "2" | "3" | "4";
  showName?: boolean;
}

export function PersonLabel({
  person,
  size = "2",
  showName = true,
}: PersonLabelProps) {
  return (
    <Flex align="center" gap="2">
      <Avatar
        size={size}
        fallback={person.name.charAt(0).toUpperCase()}
        color={person.color}
      />
      {showName && <Text size={size}>{person.name}</Text>}
    </Flex>
  );
}
