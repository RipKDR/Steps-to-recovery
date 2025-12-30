// App constants

export const STEPS = [
  {
    number: 1,
    title: 'Admit Powerlessness',
    description: 'We admitted we were powerless over our addiction—that our lives had become unmanageable.',
  },
  {
    number: 2,
    title: 'Believe in a Higher Power',
    description: 'Came to believe that a Power greater than ourselves could restore us to sanity.',
  },
  {
    number: 3,
    title: 'Turn Our Will Over',
    description: 'Made a decision to turn our will and our lives over to the care of God as we understood Him.',
  },
  {
    number: 4,
    title: 'Make a Moral Inventory',
    description: 'Made a searching and fearless moral inventory of ourselves.',
  },
  {
    number: 5,
    title: 'Admit Our Wrongs',
    description: 'Admitted to God, to ourselves, and to another human being the exact nature of our wrongs.',
  },
  {
    number: 6,
    title: 'Become Ready',
    description: 'Were entirely ready to have God remove all these defects of character.',
  },
  {
    number: 7,
    title: 'Ask for Removal',
    description: 'Humbly asked Him to remove our shortcomings.',
  },
  {
    number: 8,
    title: 'Make a List',
    description: 'Made a list of all persons we had harmed, and became willing to make amends to them all.',
  },
  {
    number: 9,
    title: 'Make Amends',
    description: 'Made direct amends to such people wherever possible, except when to do so would injure them or others.',
  },
  {
    number: 10,
    title: 'Continue Inventory',
    description: 'Continued to take personal inventory and when we were wrong promptly admitted it.',
  },
  {
    number: 11,
    title: 'Seek Through Prayer',
    description: 'Sought through prayer and meditation to improve our conscious contact with God as we understood Him, praying only for knowledge of His will for us and the power to carry that out.',
  },
  {
    number: 12,
    title: 'Carry the Message',
    description: 'Having had a spiritual awakening as the result of these steps, we tried to carry this message to addicts, and to practice these principles in all our affairs.',
  },
] as const;

export const MILESTONE_DAYS = [1, 7, 14, 30, 60, 90, 180, 365] as const;

export const MOOD_EMOJIS = {
  happy: '😊',
  neutral: '😐',
  sad: '😢',
  anxious: '😰',
  craving: '😣',
} as const;
