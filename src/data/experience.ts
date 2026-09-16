/** Shared by the homepage timeline and the CV, so both tell the same story. */
export type RoleKey = 'itOfficer' | 'player' | 'consultant' | 'intern' | 'proPlayer';

export interface Position {
  kind: 'code' | 'court';
  /** ISO year-month; Intl turns these into the visitor's language */
  start: string;
  end: string | null;
  role: RoleKey;
  org: string;
}

export const experience: Position[] = [
  { kind: 'code', start: '2026-02', end: null, role: 'itOfficer', org: 'CrediBill' },
  { kind: 'court', start: '2025-08', end: null, role: 'player', org: 'Kontich Wolves' },
  { kind: 'code', start: '2025-10', end: '2026-01', role: 'consultant', org: 'Triple A Solutions · Flexcredit' },
  { kind: 'code', start: '2025-06', end: '2025-07', role: 'intern', org: 'FLEXAMIT' },
  { kind: 'court', start: '2023-08', end: '2025-07', role: 'proPlayer', org: 'Circus Brussels Basketball' },
  { kind: 'court', start: '2020-08', end: '2023-07', role: 'proPlayer', org: 'Hubo Limburg United' },
  { kind: 'court', start: '2018-08', end: '2020-07', role: 'proPlayer', org: 'Basketbalclub Filou Oostende' },
  { kind: 'court', start: '2015-08', end: '2018-07', role: 'proPlayer', org: 'Hubo Limburg United' },
  { kind: 'court', start: '2012-08', end: '2015-07', role: 'proPlayer', org: 'Stella Artois Leuven Bears' },
  { kind: 'court', start: '2011-08', end: '2012-07', role: 'proPlayer', org: 'Optima Gent' },
];

/** One place for the contact details, used by the CV and the contact section. */
export const contact = {
  email: 'hello@example.com',
  github: 'https://github.com/',
  linkedin: 'https://www.linkedin.com/',
};
