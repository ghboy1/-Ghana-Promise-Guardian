// src/data/manifestoData.js
// Structured promises extracted from manifestos

export const NDC_2024_PROMISES = [
  // ECONOMY & JOBS
  {
    id: 'ndc-2024-001',
    party: 'NDC',
    year: 2024,
    title: 'Scrap E-Levy within first 100 days',
    description: 'Remove the electronic levy on mobile money transactions to reduce the burden on Ghanaians and ease the cost of doing business.',
    category: 'economy',
    priority: 'high',
    status: 'pending',
    timeline: {
      start: '2025-01-07',
      end: '2025-04-16', // 100 days
      duration: '100 days'
    },
    region: 'National',
    district: 'All',
    budget: null,
    source: '2024 NDC Manifesto - Page 22',
    evidenceRequired: ['Legislative action', 'Official announcement'],
    metrics: {
      target: 'Complete removal of E-Levy',
      measurable: true,
      verifiable: true
    }
  },
  {
    id: 'ndc-2024-002',
    party: 'NDC',
    year: 2024,
    title: 'Implement 24-Hour Economy Policy',
    description: 'Encourage businesses to operate 24/7 in three 8-hour shifts to boost production, promote productivity, and generate well-paying jobs through tax incentives and cheaper electricity.',
    category: 'economy',
    priority: 'flagship',
    status: 'pending',
    timeline: {
      start: '2025-01-07',
      end: '2029-01-07',
      duration: '4 years'
    },
    region: 'National',
    district: 'All',
    budget: null,
    source: '2024 NDC Manifesto - Pages 26-32',
    evidenceRequired: [
      'Legislative framework',
      'Number of participating businesses',
      'Jobs created',
      'Time-of-Use tariff implementation'
    ],
    metrics: {
      target: 'Establish 24-hour operations framework',
      measurable: true,
      verifiable: true
    }
  },
  {
    id: 'ndc-2024-003',
    party: 'NDC',
    year: 2024,
    title: "Women's Development Bank",
    description: 'Establish a special-purpose bank run by women to support women-owned businesses with low-interest loans to economically empower one million Ghanaian women.',
    category: 'economy',
    priority: 'high',
    status: 'pending',
    timeline: {
      start: '2025-01-07',
      end: '2028-12-31',
      duration: '4 years'
    },
    region: 'National',
    district: 'All',
    budget: null,
    source: '2024 NDC Manifesto - Pages 26, 63',
    evidenceRequired: [
      'Bank establishment',
      'Number of loans disbursed',
      'Women beneficiaries count'
    ],
    metrics: {
      target: '1 million women economically empowered',
      measurable: true,
      verifiable: true
    }
  },
  {
    id: 'ndc-2024-004',
    party: 'NDC',
    year: 2024,
    title: 'National Apprenticeship Programme',
    description: 'Provide free technical and vocational training for young people in various crafts with certification and start-up capital support.',
    category: 'education',
    priority: 'high',
    status: 'pending',
    timeline: {
      start: '2025-01-07',
      end: '2029-01-07',
      duration: '4 years'
    },
    region: 'National',
    district: 'All',
    budget: null,
    source: '2024 NDC Manifesto - Page 26',
    evidenceRequired: [
      'Training centers established',
      'Number of trainees',
      'Certifications issued',
      'Start-up capital disbursed'
    ],
    metrics: {
      target: 'Train and equip youth with technical skills',
      measurable: true,
      verifiable: true
    }
  },

  // EDUCATION
  {
    id: 'ndc-2024-005',
    party: 'NDC',
    year: 2024,
    title: 'No-Academic-Fee for First-Year Tertiary Students',
    description: 'Implement No-Fees-Stress initiative for all first-year students in public tertiary institutions including Universities, Colleges of Education, and Nursing Training Colleges.',
    category: 'education',
    priority: 'high',
    status: 'pending',
    timeline: {
      start: '2025-09-01', // Academic year
      end: '2029-01-07',
      duration: '4 years'
    },
    region: 'National',
    district: 'All',
    budget: null,
    source: '2024 NDC Manifesto - Pages 22, 39',
    evidenceRequired: [
      'Policy implementation',
      'Number of beneficiaries',
      'Budget allocation'
    ],
    metrics: {
      target: 'Zero academic fees for all first-year tertiary students',
      measurable: true,
      verifiable: true
    }
  },
  {
    id: 'ndc-2024-006',
    party: 'NDC',
    year: 2024,
    title: 'Free Tertiary Education for Persons with Disability',
    description: 'Provide completely free tertiary education for all persons with disabilities.',
    category: 'education',
    priority: 'high',
    status: 'pending',
    timeline: {
      start: '2025-09-01',
      end: '2029-01-07',
      duration: '4 years'
    },
    region: 'National',
    district: 'All',
    budget: null,
    source: '2024 NDC Manifesto - Pages 22, 39',
    evidenceRequired: [
      'Policy enactment',
      'Number of PWD beneficiaries',
      'Budget allocation'
    ],
    metrics: {
      target: 'Free education for all PWDs in tertiary institutions',
      measurable: true,
      verifiable: true
    }
  },
  {
    id: 'ndc-2024-007',
    party: 'NDC',
    year: 2024,
    title: 'Abolish Double-Track System in SHS',
    description: 'Restore stable one-track academic calendar for Senior High Schools by completing abandoned E-blocks and expanding infrastructure.',
    category: 'education',
    priority: 'high',
    status: 'pending',
    timeline: {
      start: '2025-09-01',
      end: '2027-09-01',
      duration: '2 years'
    },
    region: 'National',
    district: 'All',
    budget: null,
    source: '2024 NDC Manifesto - Page 38',
    evidenceRequired: [
      'Infrastructure completion',
      'Single-track implementation',
      'Official announcement'
    ],
    metrics: {
      target: 'All SHS on single-track system',
      measurable: true,
      verifiable: true
    }
  },

  // HEALTHCARE
  {
    id: 'ndc-2024-008',
    party: 'NDC',
    year: 2024,
    title: 'Ghana Medical Care Trust (MahamaCares)',
    description: 'Establish trust fund to support cost of healthcare for persons with chronic diseases including kidney failure, cancers, sickle cell, diabetes, hypertension, and heart diseases.',
    category: 'health',
    priority: 'high',
    status: 'pending',
    timeline: {
      start: '2025-01-07',
      end: '2026-12-31',
      duration: '2 years'
    },
    region: 'National',
    district: 'All',
    budget: null,
    source: '2024 NDC Manifesto - Pages 22, 42',
    evidenceRequired: [
      'Trust fund establishment',
      'Number of beneficiaries',
      'Fund disbursements'
    ],
    metrics: {
      target: 'Operational trust fund supporting chronic disease patients',
      measurable: true,
      verifiable: true
    }
  },
  {
    id: 'ndc-2024-009',
    party: 'NDC',
    year: 2024,
    title: 'Free Primary Healthcare',
    description: 'Implement free primary healthcare from CHPS compound to polyclinic level in short to medium term.',
    category: 'health',
    priority: 'high',
    status: 'pending',
    timeline: {
      start: '2025-01-07',
      end: '2027-12-31',
      duration: '3 years'
    },
    region: 'National',
    district: 'All',
    budget: null,
    source: '2024 NDC Manifesto - Pages 22, 42',
    evidenceRequired: [
      'Policy implementation',
      'Healthcare facilities coverage',
      'Patient numbers'
    ],
    metrics: {
      target: 'Free healthcare at CHPS and polyclinic levels',
      measurable: true,
      verifiable: true
    }
  },
  {
    id: 'ndc-2024-010',
    party: 'NDC',
    year: 2024,
    title: 'Construct 500-bed Specialist Children\'s Hospital',
    description: 'Build state-of-the-art 500-bed Specialist Children\'s Hospital and Fertility Centre in Accra.',
    category: 'health',
    priority: 'medium',
    status: 'pending',
    timeline: {
      start: '2025-01-07',
      end: '2028-12-31',
      duration: '4 years'
    },
    region: 'Greater Accra',
    district: 'Accra',
    budget: null,
    source: '2024 NDC Manifesto - Page 43',
    evidenceRequired: [
      'Construction start',
      'Construction progress',
      'Facility completion',
      'Operationalization'
    ],
    metrics: {
      target: 'Fully operational 500-bed children\'s hospital',
      measurable: true,
      verifiable: true
    }
  },

  // INFRASTRUCTURE
  {
    id: 'ndc-2024-011',
    party: 'NDC',
    year: 2024,
    title: '$10 Billion Big Push Infrastructure Development',
    description: 'Roll out $10 billion Big Push policy for rapid infrastructure development to continue legacy of massive infrastructure development for job creation.',
    category: 'infrastructure',
    priority: 'flagship',
    status: 'pending',
    timeline: {
      start: '2025-01-07',
      end: '2029-01-07',
      duration: '4 years'
    },
    region: 'National',
    district: 'All',
    budget: '$10 billion',
    source: '2024 NDC Manifesto - Pages 22, 29, 56',
    evidenceRequired: [
      'Fund mobilization',
      'Project list',
      'Implementation progress',
      'Jobs created'
    ],
    metrics: {
      target: '$10 billion infrastructure investment',
      measurable: true,
      verifiable: true
    }
  },

  // AGRICULTURE
  {
    id: 'ndc-2024-012',
    party: 'NDC',
    year: 2024,
    title: 'Feed Ghana Programme',
    description: 'Implement Feed Ghana Programme to boost food production through farmer service centers and farm banks in all districts.',
    category: 'agriculture',
    priority: 'high',
    status: 'pending',
    timeline: {
      start: '2025-01-07',
      end: '2029-01-07',
      duration: '4 years'
    },
    region: 'National',
    district: 'All',
    budget: null,
    source: '2024 NDC Manifesto - Pages 28, 45',
    evidenceRequired: [
      'Farmer service centers established',
      'Farm banks created',
      'Food production statistics'
    ],
    metrics: {
      target: 'Increase food production and guarantee food security',
      measurable: true,
      verifiable: true
    }
  },

  // GENDER & SOCIAL PROTECTION
  {
    id: 'ndc-2024-013',
    party: 'NDC',
    year: 2024,
    title: '30% Women in Political Appointments',
    description: 'Mandate minimum 30 per cent quota for women in all political appointments.',
    category: 'governance',
    priority: 'high',
    status: 'pending',
    timeline: {
      start: '2025-01-07',
      end: '2025-06-30',
      duration: '6 months'
    },
    region: 'National',
    district: 'All',
    budget: null,
    source: '2024 NDC Manifesto - Page 63',
    evidenceRequired: [
      'Appointment statistics',
      'Gender breakdown of appointees'
    ],
    metrics: {
      target: 'At least 30% women in all political appointments',
      measurable: true,
      verifiable: true
    }
  },
  {
    id: 'ndc-2024-014',
    party: 'NDC',
    year: 2024,
    title: 'Free Sanitary Pads for School Girls',
    description: 'Provide free sanitary pads for female students in basic and secondary schools.',
    category: 'education',
    priority: 'high',
    status: 'pending',
    timeline: {
      start: '2025-09-01',
      end: '2029-01-07',
      duration: '4 years'
    },
    region: 'National',
    district: 'All',
    budget: null,
    source: '2024 NDC Manifesto - Pages 22, 63',
    evidenceRequired: [
      'Distribution records',
      'Number of beneficiaries',
      'Schools covered'
    ],
    metrics: {
      target: 'Free pads for all female students in basic and secondary schools',
      measurable: true,
      verifiable: true
    }
  },

  // GOVERNANCE & CORRUPTION
  {
    id: 'ndc-2024-015',
    party: 'NDC',
    year: 2024,
    title: 'Reduce Ministers to Maximum of 60',
    description: 'Drastically reduce the size of government by appointing not more than sixty (60) Ministers.',
    category: 'governance',
    priority: 'high',
    status: 'pending',
    timeline: {
      start: '2025-01-07',
      end: '2025-03-31',
      duration: '3 months'
    },
    region: 'National',
    district: 'All',
    budget: null,
    source: '2024 NDC Manifesto - Page 51',
    evidenceRequired: [
      'Official list of ministers',
      'Total count verification'
    ],
    metrics: {
      target: 'Maximum 60 ministers appointed',
      measurable: true,
      verifiable: true
    }
  },
  {
    id: 'ndc-2024-016',
    party: 'NDC',
    year: 2024,
    title: 'Operation Recover All Loot',
    description: 'Launch Operation-Recover-All-Loot to investigate, prosecute and recover proceeds of corruption.',
    category: 'governance',
    priority: 'high',
    status: 'pending',
    timeline: {
      start: '2025-01-07',
      end: '2029-01-07',
      duration: '4 years'
    },
    region: 'National',
    district: 'All',
    budget: null,
    source: '2024 NDC Manifesto - Page 51',
    evidenceRequired: [
      'Cases investigated',
      'Prosecutions',
      'Assets recovered'
    ],
    metrics: {
      target: 'Recover stolen state funds',
      measurable: true,
      verifiable: true
    }
  },
];

export const NPP_2016_PROMISES = [
  // Note: These are from 2016 manifesto, so dates are historical
  // Useful for tracking what was promised vs delivered
  {
    id: 'npp-2016-001',
    party: 'NPP',
    year: 2016,
    title: 'Free Senior High School Education',
    description: 'Make SHS free for all Ghanaian children, covering fees, tuition, and textbooks.',
    category: 'education',
    priority: 'flagship',
    status: 'completed', // Already implemented
    timeline: {
      start: '2017-09-01',
      end: '2017-09-01',
      duration: 'Immediate'
    },
    region: 'National',
    district: 'All',
    budget: null,
    source: '2016 NPP Manifesto - Pages 103-108',
    evidenceRequired: [
      'Policy implementation',
      'Enrollment statistics',
      'Budget allocation'
    ],
    metrics: {
      target: 'Free SHS for all students',
      measurable: true,
      verifiable: true
    },
    actualOutcome: 'Implemented in 2017, though with challenges including double-track system'
  },
  {
    id: 'npp-2016-002',
    party: 'NPP',
    year: 2016,
    title: 'One District One Factory',
    description: 'Implement One District, One Factory initiative to ensure even spatial spread of industries across all districts.',
    category: 'economy',
    priority: 'flagship',
    status: 'partial', // Partially completed
    timeline: {
      start: '2017-01-07',
      end: '2020-12-31',
      duration: '4 years'
    },
    region: 'National',
    district: 'All',
    budget: null,
    source: '2016 NPP Manifesto - Page 31',
    evidenceRequired: [
      'Number of factories established',
      'Districts covered',
      'Jobs created'
    ],
    metrics: {
      target: 'At least one factory per district',
      measurable: true,
      verifiable: true
    },
    actualOutcome: 'Some factories established but not in all districts'
  },
  {
    id: 'npp-2016-003',
    party: 'NPP',
    year: 2016,
    title: 'Restore Teacher Training Allowances',
    description: 'Fully restore allowances for teacher trainees that were cancelled by NDC.',
    category: 'education',
    priority: 'high',
    status: 'completed',
    timeline: {
      start: '2017-09-01',
      end: '2017-09-01',
      duration: 'Immediate'
    },
    region: 'National',
    district: 'All',
    budget: null,
    source: '2016 NPP Manifesto - Page 112',
    evidenceRequired: [
      'Policy announcement',
      'Disbursement records'
    ],
    metrics: {
      target: 'Restored allowances for all teacher trainees',
      measurable: true,
      verifiable: true
    },
    actualOutcome: 'Restored in 2017 but later converted to student loans'
  },
  {
    id: 'npp-2016-004',
    party: 'NPP',
    year: 2016,
    title: 'End DUMSOR Permanently',
    description: 'Solve electricity supply crisis (DUMSOR) through improved power generation and management.',
    category: 'energy',
    priority: 'flagship',
    status: 'completed',
    timeline: {
      start: '2017-01-07',
      end: '2018-12-31',
      duration: '2 years'
    },
    region: 'National',
    district: 'All',
    budget: null,
    source: '2016 NPP Manifesto - Pages 37-42',
    evidenceRequired: [
      'Power generation capacity',
      'Outage statistics',
      'Consumer feedback'
    ],
    metrics: {
      target: 'Stable, reliable electricity supply',
      measurable: true,
      verifiable: true
    },
    actualOutcome: 'Largely resolved though recent challenges have emerged'
  },
];

// Helper function to get promises by various criteria
export const getPromisesByCategory = (promises, category) => {
  return promises.filter(p => p.category === category);
};

export const getPromisesByRegion = (promises, region) => {
  return promises.filter(p => p.region === region || p.region === 'National');
};

export const getPromisesByPriority = (promises, priority) => {
  return promises.filter(p => p.priority === priority);
};

export const getFlagshipPromises = (promises) => {
  return promises.filter(p => p.priority === 'flagship');
};

export const getAllPromises = () => {
  return [...NDC_2024_PROMISES, ...NPP_2016_PROMISES];
};