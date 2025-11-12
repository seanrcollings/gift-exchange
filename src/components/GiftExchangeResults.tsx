import { Box, Button, Flex, Text } from "@radix-ui/themes";
import { type GiftExchangeResult } from "../gift-exchange";
import { PersonLabel } from "./PersonLabel";
import { CopyIcon } from "@radix-ui/react-icons";

interface GiftExchangeResultsProps {
  result: GiftExchangeResult | null;
}

export function GiftExchangeResults({ result }: GiftExchangeResultsProps) {
  const handleCopy = () => {
    if (!result || !result.success) return;

    const formatter = new Intl.ListFormat("en", {
      style: "long",
      type: "conjunction",
    });

    let output = "";

    result.assignments.forEach((assignment) => {
      output += `${assignment.giver.name} gives to: ${formatter.format(
        assignment.receivers.map((r) => r.name)
      )}\n`;
      output += `\n`;
    });

    navigator.clipboard.writeText(output.trim());
  };

  if (!result) {
    return (
      <Box>
        <Text size="3" color="gray">
          No results yet. Configure settings and generate assignments.
        </Text>
      </Box>
    );
  }

  if (!result.success) {
    return (
      <Box p="3">
        <Flex align="center" gap="2">
          <Text size="3" color="red">
            Unable to generate assignments. Please review your restrictions and
            try again.
          </Text>
        </Flex>
      </Box>
    );
  }

  return (
    <Box p="3" overflow="auto">
      {result.assignments.map((assignment, index) => (
        <Box
          key={index}
          mb="3"
          pb="3"
          style={{
            borderBottom:
              index < result.assignments.length - 1
                ? "1px solid var(--gray-6)"
                : "none",
          }}
        >
          <Flex align="center" gap="3" mb="2">
            <PersonLabel person={assignment.giver} size="2" />
            <Text size="2" color="gray">
              gives to
            </Text>
          </Flex>
          <Box ml="4">
            {assignment.receivers.map((receiver, receiverIndex) => (
              <Flex key={receiverIndex} align="center" gap="2" mb="1">
                <Text size="1" color="gray">
                  →
                </Text>
                <PersonLabel person={receiver} size="2" />
              </Flex>
            ))}
          </Box>
        </Box>
      ))}
      <Flex justify="end">
        <Button variant="soft" onClick={handleCopy} disabled={!result.success}>
          <CopyIcon />
          Copy
        </Button>
      </Flex>
    </Box>
  );
}
