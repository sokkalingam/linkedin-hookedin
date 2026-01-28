const verbs = [
  'dancing', 'jumping', 'running', 'flying', 'swimming', 'singing',
  'coding', 'debugging', 'testing', 'deploying', 'building', 'designing',
  'thinking', 'learning', 'teaching', 'writing', 'reading', 'exploring',
  'creating', 'innovating', 'optimizing', 'scaling', 'refactoring', 'merging',
  'pushing', 'pulling', 'committing', 'branching', 'reviewing', 'shipping',
  'driving', 'walking', 'hiking', 'climbing', 'surfing', 'skating',
  'spinning', 'rolling', 'bouncing', 'sliding', 'gliding', 'soaring'
];

const nouns = [
  'orange', 'apple', 'banana', 'monkey', 'elephant', 'giraffe',
  'penguin', 'dolphin', 'tiger', 'lion', 'panda', 'koala',
  'robot', 'rocket', 'satellite', 'server', 'laptop', 'keyboard',
  'mouse', 'monitor', 'processor', 'compiler', 'debugger', 'terminal',
  'cloud', 'database', 'firewall', 'algorithm', 'function', 'variable',
  'mountain', 'ocean', 'forest', 'desert', 'river', 'lake',
  'sunset', 'sunrise', 'rainbow', 'thunder', 'lightning', 'tornado',
  'pizza', 'burger', 'taco', 'sushi', 'pasta', 'sandwich'
];

export function generateWebhookPath(): string {
  const verb = verbs[Math.floor(Math.random() * verbs.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNum = Math.floor(Math.random() * 1000);
  return `${verb}-${noun}-${randomNum}`;
}

export function isValidCustomPath(path: string): boolean {
  // Allow alphanumeric characters and hyphens, 3-50 characters
  const regex = /^[a-z0-9-]{3,50}$/;
  return regex.test(path);
}
