// src/services/fallbackData.js
// Local fallback data when Firebase is not available
export const FALLBACK_PROMISES = [
  {
    id: '1',
    title: 'Build 100 New SHS',
    description: 'Construct 100 new Senior High Schools across the country',
    status: 'progress',
    category: 'Education',
    party: 'NPP',
    impact: 'High',
    datePromised: '2025-01-07',
    progress: 45,
    region: 'National',
    government: 'current'
  },
  {
    id: '2',
    title: 'Free SHS for All',
    description: 'Continue and expand the Free Senior High School program',
    status: 'fulfilled',
    category: 'Education',
    party: 'NPP',
    impact: 'High',
    datePromised: '2025-01-07',
    progress: 100,
    region: 'National',
    government: 'current'
  },
  {
    id: '3',
    title: 'Scrap E-Levy within first 100 days',
    description: 'Remove the electronic levy on mobile money transactions to reduce the burden on Ghanaians',
    status: 'pending',
    category: 'Economy',
    party: 'NDC',
    impact: 'High',
    datePromised: '2025-01-07',
    progress: 0,
    region: 'National',
    government: 'opposition'
  },
  {
    id: '4',
    title: 'Create 1 Million Jobs',
    description: 'Generate one million new jobs in various sectors of the economy',
    status: 'progress',
    category: 'Employment',
    party: 'NPP',
    impact: 'High',
    datePromised: '2025-01-07',
    progress: 35,
    region: 'National',
    government: 'current'
  },
  {
    id: '5',
    title: 'National Health Insurance Reform',
    description: 'Revamp the NHIS to provide comprehensive healthcare coverage',
    status: 'pending',
    category: 'Health',
    party: 'NDC',
    impact: 'Medium',
    datePromised: '2025-01-07',
    progress: 0,
    region: 'National',
    government: 'opposition'
  }
];

export const getFallbackPromises = () => {
  console.log('📁 Using local fallback data');
  return FALLBACK_PROMISES;
};