import { getApprovedSubmissions } from "@/lib/submissions";

export type Template = {
  id: string;
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  description: string;
  tags: string[];
  image: string;
  fileSize: string;
  dimensions: string;
  software: string;
  license: string;
  isFree: boolean;
  downloads: number;
  favorites: number;
  date: string;
  author: string;
  status: "APPROVED" | "PENDING";
};

type FlyerTheme = {
  name: string;
  slug: string;
  colors: [string, string, string];
  phrases: string[];
  note: string;
  imagePaths?: string[];
};

export const categories = [
  {
    name: "Church Flyers",
    slug: "church-flyers",
    count: 12,
    note: "Worship, conference, and ministry designs ready to edit.",
    tone: "bg-[#e9f0ff] text-[#2457bb]",
  },
  {
    name: "Birthday Flyers",
    slug: "birthday-flyers",
    count: 16,
    note: "Celebrate louder with colorful, editable invitations.",
    tone: "bg-[#e8f7f1] text-[#167451]",
  },
  {
    name: "Business Flyers",
    slug: "business-flyers",
    count: 24,
    note: "Professional promotions for brands, teams, and services.",
    tone: "bg-[#fff0df] text-[#a25d19]",
  },
  {
    name: "Party Flyers",
    slug: "party-flyers",
    count: 23,
    note: "Make the next event impossible to miss.",
    tone: "bg-[#f2eafd] text-[#7543ad]",
  },
  {
    name: "Restaurant Flyers",
    slug: "restaurant-flyers",
    count: 22,
    note: "Menus, offers, and food promotions with appetite.",
    tone: "bg-[#fbe9ee] text-[#ad4561]",
  },
  {
    name: "Event Flyers",
    slug: "event-flyers",
    count: 11,
    note: "Conference, launch, and community event templates.",
    tone: "bg-[#e5f4f8] text-[#23768b]",
  },
];

const themes: FlyerTheme[] = [
  {
    name: "Church Flyers",
    slug: "church-flyers",
    colors: ["#182b49", "#59c3c3", "#f7f4ed"],
    phrases: ["WORSHIP NIGHT", "SUNDAY SERVICE", "FAITH & COMMUNITY"],
    note: "Church flyer previews supplied for FlyerHub and ready to customize in Photoshop.",
    imagePaths: [
      "Church Banner Design.jpg",
      "Church Event Flyer.jpg",
      "Church flyer (1).jpg",
      "Church Flyer Design.jpg",
      "Church flyer _ Premium PSD (1).jpg",
      "Church flyer _ Premium PSD.jpg",
      "Church Flyer.jpg",
      "Copy of church flyer.jpg",
      "Create the perfect design by customizing easy to….jpg",
      "Esther Conference Church Flyer PSD.jpg",
      "Modern Church Flyer Design.jpg",
      "RECHARGE Worship and Prayer Summit Flyer Design.jpg",
    ],
  },
  {
    name: "Birthday Flyers",
    slug: "birthday-flyers",
    colors: ["#542b70", "#ff7b89", "#ffd166"],
    phrases: ["HAPPY BIRTHDAY", "LET'S CELEBRATE", "MAKE A WISH"],
    note: "Birthday flyer previews supplied for FlyerHub and ready to customize in Photoshop.",
    imagePaths: [
      "16M views · 1_2M reactions _ Big names on display at the #FIFAWorldCup ✨ _ FIFA World Cup.jpg",
      "Birthday Celebration Square Template.jpg",
      "BIRTHDAY DESIGN FLYER.jpg",
      "Birthday Flyer (1).jpg",
      "birthday flyer (2).jpg",
      "Birthday Flyer (3).jpg",
      "Birthday Flyer Design (1).jpg",
      "Birthday Flyer Design.jpg",
      "Birthday Flyer or Poster Design.jpg",
      "Birthday flyer.jpg",
      "Copy of Maximalist Happy Birthday A4.jpg",
      "Create the perfect design by customizing easy to….jpg",
      "Creative Birthday Party Flyer _ Graphic Design Inspiration.jpg",
      "Happy birthday day.jpg",
      "Happy birthday greeting card.jpg",
      "Luxury Emerald Green Birthday Flyer Design _ Premium Modern Birthday Poster Inspiration.jpg",
    ],
  },
  {
    name: "Business Flyers",
    slug: "business-flyers",
    colors: ["#102a43", "#f28f3b", "#f5f1e8"],
    phrases: ["BUILD YOUR BRAND", "NOW OPEN", "MAKE IT HAPPEN"],
    note: "Business flyer previews supplied for FlyerHub and ready to customize in Photoshop.",
    imagePaths: [
      "A simple flyer design ✨🥰   #graphicdesigncentral….jpg",
      "Beauty flyer design 💯.jpg",
      "boutique flyer.jpg",
      "Business flyer (1).jpg",
      "Business flyer.jpg",
      "Business Poster.jpg",
      "BUSINESS REGISTRATION FLYER DESIGN CAC.jpg",
      "Church Morning Service Template.jpg",
      "Clean, vibrant, and deliciously inviting! 👩🏽_🍳✨….jpg",
      "Creative flyer PSD, High Quality Free PSD Templates for Download _ Magnific (formerly Freepik).jpg",
      "Digital Marketing Flyer Design.jpg",
      "Food Flyer Design.jpg",
      "Gadget Flyer Design.jpg",
      "Graphic Design Flyer.jpg",
      "Graphic design.jpg",
      "GRAPHICS FLYER.jpg",
      "Happy Sunday famz_  Here's something lil to round….jpg",
      "Here's a recent business design I handled   The….jpg",
      "Modern Business Flyer Design.jpg",
      "Promotional Flyer Design.jpg",
      "PSD Zone.jpg",
      "Rehoboth Flyer.jpg",
      "Studio flyer.jpg",
      "Tree Removal Services Template.jpg",
    ],
  },
  {
    name: "Party Flyers",
    slug: "party-flyers",
    colors: ["#24113f", "#ff4f81", "#f7d46b"],
    phrases: ["PARTY TONIGHT", "DANCE ALL NIGHT", "GOOD VIBES ONLY"],
    note: "Party flyer previews supplied for FlyerHub and ready to customize in Photoshop.",
    imagePaths: [
      "18366310975704640.jpg",
      "229754018510529604.jpg",
      "421157002677716710.jpg",
      "Afro Vibes Party Instagram Ad Template.jpg",
      "BIRTHDAY DESIGN FLYER.jpg",
      "Copy of Black Maximalist 3d Ladies Night Party Event Flyer A4.jpg",
      "Crazy Night Club Party Flyer Design PSD.jpg",
      "EPIC SATURDAY.jpg",
      "FLYER DESIGN (1).jpg",
      "FLYER DESIGN.jpg",
      "Get Professional Club Flyer!   DM us for….jpg",
      "Ladies Night Club Party Flyer PSD Template.jpg",
      "Ladies Night Flyer Design.jpg",
      "Outdoor Party Flyer Design.jpg",
      "Party flyer design (1).jpg",
      "Party flyer design.jpg",
      "party time, night club.jpg",
      "RAVE PARTY.jpg",
      "Saturday Bash @80krestaurant Vibe and Party_ It's….jpg",
      "Singles House Party Flyer Design.jpg",
      "SLIDE 1 VS 2_ Which one is your favourite_….jpg",
      "Sunday Chills.jpg",
      "Urban Party PSD Flyer Template - Pro 3D Title Design.jpg",
    ],
  },
  {
    name: "Restaurant Flyers",
    slug: "restaurant-flyers",
    colors: ["#21150c", "#d99b2b", "#f7ead0"],
    phrases: ["GOOD FOOD", "SPECIAL OFFER", "TASTE THAT STAYS"],
    note: "Restaurant flyer previews supplied for FlyerHub and ready to customize in Photoshop.",
    imagePaths: [
      "Affiche restaurant.jpg",
      "Catering Flyer Design.jpg",
      "food flyer (1).jpg",
      "Food flyer design (1).jpg",
      "Food flyer design (2).jpg",
      "Food Flyer Design.jpg",
      "food flyer.jpg",
      "Food Menu Cafe Or Restaurant Poster Print Template _ PSD Free Download - Pikbest.jpg",
      "How to Create Flyer in Photoshop [Restaurant Flyer].jpg",
      "Modern Restaurant Food Poster Design _ Premium….jpg",
      "Premium Luxury Restaurant Food Poster Design _ Modern Restaurant Flyer _ Elegant Menu Promotion _ So.jpg",
      "Premium Restaurant Flyer Template _ Editable Canva Design _ Modern Food Promotion – $26_99.jpg",
      "professional food flyer design.jpg",
      "Restaurant banner design.jpg",
      "Restaurant Flyer Design (1).jpg",
      "Restaurant flyer design.jpg",
      "Restaurant Flyer Designs.jpg",
      "Restaurant flyer.jpg",
      "Restaurant Food Flyer Design _ PSD Free Download - Pikbest.jpg",
      "Restaurant Social Media Ad Design _ Food Promotion Flyer.jpg",
      "SBS CREATIVE.jpg",
      "Scholaric Eatery.jpg",
      "Super Delicious Resturant Food Flyer Design _ PSD Free Download - Pikbest.jpg",
    ],
  },
  {
    name: "Event Flyers",
    slug: "event-flyers",
    colors: ["#101b36", "#ee5366", "#f3d27b"],
    phrases: ["EVENT NIGHT", "LIVE EXPERIENCE", "SAVE THE DATE"],
    note: "Event flyer previews supplied for FlyerHub and ready to customize in Photoshop.",
    imagePaths: [
      "60869032460730034.jpg",
      "Ballers night.jpg",
      "CLUB AND PARTY FLYER DESIGN IDEAS AND INSPIRATION- SUNDAY CLUB FLYER.jpg",
      "Copy of Night club party flyer.jpg",
      "Event Flyer Design.jpg",
      "event flyers design in.jpg",
      "I will design attractive party flyer, event, club, concert flyer.jpg",
      "JPI SOKOTO STATE.jpg",
      "Night club flyer design 2026.jpg",
      "party flyer design.jpg",
      "ShutDown Wave Flyer Design.jpg",
    ],
  },
];

function makeFlyerImage(
  colors: [string, string, string],
  phrase: string,
  index: number,
) {
  const [background, accent, paper] = colors;
  const rotation = (index % 5) * 3 - 6;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><rect width="800" height="1000" fill="${background}"/><circle cx="650" cy="180" r="210" fill="${accent}" opacity=".9"/><circle cx="80" cy="900" r="260" fill="${accent}" opacity=".35"/><path d="M0 720 Q330 530 800 700 V1000 H0Z" fill="${paper}" opacity=".95"/><g transform="rotate(${rotation} 400 480)"><text x="70" y="210" fill="${paper}" font-family="Arial,sans-serif" font-size="28" font-weight="700" letter-spacing="6">FLYERHUB / ${String(index + 1).padStart(2, "0")}</text><text x="65" y="500" fill="${paper}" font-family="Arial,sans-serif" font-size="76" font-weight="900">${phrase}</text><text x="70" y="555" fill="${paper}" font-family="Arial,sans-serif" font-size="22" letter-spacing="3">EDITABLE PSD TEMPLATE</text><rect x="70" y="800" width="190" height="8" fill="${accent}"/></g></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const catalogTemplates: Template[] = themes.flatMap((theme) =>
  Array.from({ length: theme.imagePaths?.length ?? 50 }, (_, index) => ({
    id: `${theme.slug}-${index + 1}`,
    slug: `${theme.slug}-${index + 1}`,
    title: theme.name.slice(0, -1),
    category: theme.name,
    categorySlug: theme.slug,
    description: theme.note,
    tags: [theme.name.replace(" Flyers", ""), "PSD", "Editable"],
    image: theme.imagePaths
      ? `/${theme.slug}/${encodeURIComponent(theme.imagePaths[index % theme.imagePaths.length])}`
      : makeFlyerImage(
          theme.colors,
          theme.phrases[index % theme.phrases.length],
          index,
        ),
    fileSize: `${40 + (index % 70)} MB`,
    dimensions: "3000 × 4000 px",
    software: "Photoshop CC 2022+",
    license: "Commercial",
    isFree: true,
    downloads: 120 + index * 17,
    favorites: 20 + index * 3,
    date: "Sep 08, 2026",
    author: "FlyerHub Studio",
    status: "APPROVED" as const,
  })),
);

export const templates: Template[] = [
  ...catalogTemplates,
  ...getApprovedSubmissions(),
];

export function getTemplate(slug: string) {
  return templates.find((template) => template.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}
