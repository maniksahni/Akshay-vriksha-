import { HeritageTour } from '../types';

export const HERITAGE_TOURS: HeritageTour[] = [
  {
    id: 'kashmir-haven',
    title: 'The Royal Silk Route & Himalayan Haven',
    region: 'Kashmir & Ladakh Foothills',
    duration: '7 Days • Private Luxury Concierge',
    curationHighlight: 'Private pine retreats, Shikara sunset dinners & ancient Sufi shrines',
    description:
      'Immerse in pristine mountain serenity, historical houseboats crafted with fragrant cedar, and exclusive artisan workshops preserving millennia-old pashmina and carpet crafts.',
    experiences: [
      'Private sunrise shikara cruise on Dal Lake with live santoor music',
      'Exclusive access to private saffron fields & master pashmina weavers',
      'Stargazing high-altitude camp with private resident astronomer',
    ],
    imageTag: 'Alpine Sanctuary',
    tag: 'Mountain Heritage',
  },
  {
    id: 'chettinad-mansions',
    title: 'The Merchant Palaces & Chola Heritage Circuit',
    region: 'Tamil Nadu (Chettinad, Thanjavur, Madurai)',
    duration: '6 Days • Curated Architectural Journey',
    curationHighlight: '100-room ancestral mansions, teakwood pillars & UNESCO stone temples',
    description:
      'Explore the architectural splendor of the Chettiar merchant dynasties and the 1,000-year-old engineering marvels of the Great Living Chola Temples with private heritage historians.',
    experiences: [
      'Stay in a restored 19th-century Chettinad mansion with private banqueting',
      'VIP sunrise access to Thanjavur Brihadisvara Temple with resident epigraphist',
      'Masterclasses in traditional Athangudi tile-making and bronze casting',
    ],
    imageTag: 'Living Palaces',
    tag: 'Architectural Splendor',
  },
  {
    id: 'sacred-ganga',
    title: 'Eternal Whispers of Kashi & Sacred Waters',
    region: 'Varanasi & Sarnath',
    duration: '4 Days • Spiritual Immersion',
    curationHighlight: 'Private solar cruiser on the Ganga & Vedic chanting ceremonies',
    description:
      'Experience the eternal city of Varanasi through privileged private boat charters, twilight Vedic Aarti ceremonies from private terrace balconies, and private lectures with philosophy scholars.',
    experiences: [
      'Exclusive private Bajra cruiser during the evening Maha Ganga Aarti',
      'Dawn exploration of ancient hidden alleys and classical music gharanas',
      'Private classical dhrupad recital inside a 200-year-old riverfront haveli',
    ],
    imageTag: 'Sacred Sanctuary',
    tag: 'Spiritual Legacy',
  },
];
