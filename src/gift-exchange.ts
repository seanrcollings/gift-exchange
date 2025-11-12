import { type Color } from "./utils";

export interface Person {
  name: string;
  color: Color;
}

export interface GiftExchangeConfig {
  giftsPerPerson: number;
  people: Person[];
  exclusions: Record<string, string[]>;
}

interface GiftAssignment {
  giver: Person;
  receivers: Person[];
}

export interface GiftExchangeResult {
  success: boolean;
  assignments: GiftAssignment[];
  errors: string[];
}

export function buildAssignments(
  config: GiftExchangeConfig,
  retries: number = 100
): GiftExchangeResult {
  let assignments: GiftAssignment[] = [];
  const errors: string[] = [];

  for (let attempt = 0; attempt < retries; attempt++) {
    const result = tryAssignment(config);

    if (result) {
      assignments = result;
      break;
    }
  }

  errors.push(...validateAssignments(config, assignments));

  return {
    success: errors.length === 0,
    assignments,
    errors,
  };
}

function tryAssignment(config: GiftExchangeConfig): GiftAssignment[] | null {
  const assignments: GiftAssignment[] = [];
  const giftsToGive = Object.fromEntries(
    config.people.map((person) => [person.name, config.giftsPerPerson])
  );
  const giftsToReceive = Object.fromEntries(
    config.people.map((person) => [person.name, config.giftsPerPerson])
  );

  const shuffledPeople = [...config.people].sort(() => Math.random() - 0.5);

  for (const giver of shuffledPeople) {
    const assignment: GiftAssignment = {
      giver,
      receivers: [],
    };

    while (giftsToGive[giver.name] > 0) {
      const excludedReceivers = config.exclusions[giver.name] || [];

      const potentialReceivers = shuffledPeople.filter(
        (p) =>
          p.name !== giver.name && // cannot give to self
          giftsToReceive[p.name] > 0 && // receiver still needs gifts
          !assignment.receivers.some((r) => r.name === p.name) && // not already assigned in this round
          !excludedReceivers.includes(p.name) // not excluded
      );

      if (potentialReceivers.length === 0) {
        // We ran out of valid receivers, fail this attempt
        return null;
      }

      const receiver =
        potentialReceivers[
          Math.floor(Math.random() * potentialReceivers.length)
        ];

      assignment.receivers.push(receiver);

      giftsToGive[giver.name]--;
      giftsToReceive[receiver.name]--;
    }

    assignments.push(assignment);
  }

  return assignments.length > 0 ? assignments : null;
}

function validateAssignments(
  config: GiftExchangeConfig,
  assignments: GiftAssignment[]
): string[] {
  const errors: string[] = [];

  const giftsGiven: Record<string, number> = {};
  const giftsReceived: Record<string, number> = {};

  for (const person of config.people) {
    giftsGiven[person.name] = 0;
    giftsReceived[person.name] = 0;
  }

  for (const assignment of assignments) {
    giftsGiven[assignment.giver.name] += assignment.receivers.length;
    for (const receiver of assignment.receivers) {
      giftsReceived[receiver.name]++;
    }
  }

  // Validate gift counts
  for (const person of config.people) {
    if (
      giftsGiven[person.name] !== config.giftsPerPerson ||
      giftsReceived[person.name] !== config.giftsPerPerson
    ) {
      errors.push(
        `${person.name} was not be assigned the correct number of gifts.`
      );
    }
  }

  return errors;
}
