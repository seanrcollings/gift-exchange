import { Box, Button, Card, Container, Flex, Heading } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { GiftExclusions } from "./GiftExclusions";
import {
  type GiftExchangeResult,
  type GiftExchangeConfig,
  buildAssignments,
} from "../gift-exchange";
import { PeopleSelection } from "./PeopleSelection";
import { GiftsPerPersonInput } from "./GiftsPerPersonInput";
import { GiftExchangeResults } from "./GiftExchangeResults";
import { decodeBase64Url, encodeBase64Url } from "../utils";

const DEFAULT_CONFIG: GiftExchangeConfig = {
  giftsPerPerson: 1,
  people: [],
  exclusions: {},
};

export function App() {
  const [config, setConfig] = useState<GiftExchangeConfig>(() => {
    const path = window.location.pathname.slice(1);
    if (path) {
      const decoded = decodeBase64Url(path);
      if (decoded) return decoded;
    }
    return DEFAULT_CONFIG;
  });
  const [result, setResult] = useState<GiftExchangeResult | null>(null);

  useEffect(() => {
    const encoded = encodeBase64Url(config);
    window.history.replaceState(null, "", `/${encoded}`);
  }, [config]);

  return (
    <Container size="4" py="9" px="2">
      <Heading size="8" align="center" mb="6">
        Gift Exchange Calculator
      </Heading>
      <Flex direction={{ initial: "column", sm: "column", md: "row" }} gap="7">
        <Box flexBasis="1" p="5" asChild>
          <Card>
            <Heading size="5">Settings</Heading>
            <Flex direction="column" pt="4" gap="4" width="100%">
              <GiftsPerPersonInput
                value={config.giftsPerPerson}
                onChange={(giftsPerPerson) =>
                  setConfig({ ...config, giftsPerPerson })
                }
              />
              <PeopleSelection
                people={config.people}
                onPeopleChange={(people) => {
                  const peopleNames = people.map((p) => p.name);

                  const filteredExclusions = Object.fromEntries(
                    Object.entries(config.exclusions)
                      .filter(([person]) => peopleNames.includes(person))
                      .map(([giver, receivers]) => [
                        giver,
                        receivers.filter((r) => peopleNames.includes(r)),
                      ])
                  );

                  setConfig({
                    ...config,
                    people,
                    exclusions: filteredExclusions,
                  });
                }}
              />
              <GiftExclusions
                people={config.people}
                exclusions={config.exclusions}
                onExclusionsChange={(exclusions) =>
                  setConfig({ ...config, exclusions })
                }
              />
              <Flex justify="end" gap="2" mt="4">
                <Button
                  variant="surface"
                  disabled={config.people.length === 0}
                  onClick={() => {
                    setConfig(DEFAULT_CONFIG);
                    setResult(null);
                  }}
                >
                  Clear
                </Button>
                <Button
                  variant="soft"
                  disabled={config.people.length < 2}
                  onClick={() => {
                    const result = buildAssignments(config);
                    setResult(result);
                  }}
                >
                  Submit
                </Button>
              </Flex>
            </Flex>
          </Card>
        </Box>

        <Box flexBasis="1" flexGrow="1" p="5" asChild>
          <Card>
            <Heading size="5" mb="2">
              Results
            </Heading>
            <Card>
              <GiftExchangeResults result={result} />
            </Card>
          </Card>
        </Box>
      </Flex>
    </Container>
  );
}
