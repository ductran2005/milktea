// Data layer syncing the landing page with the AURATEA CMS.
// The CMS exposes a public read-only endpoint at /api/public/landing.
// When the CMS is unreachable the landing page falls back to the sample data below.

export type Drink = {
  id: string;
  name: string;
  badge: string;
  description: string;
  priceM: number;
  priceL: number;
  image: string;
  color: string;
  ingredients: string[];
};

export type ToppingOption = { name: string; price: number };

export type Promotion = { label: string; title: string; date: string };

export type StoreInfo = {
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
};

export type StoryContent = {
  heroTitle: string;
  heroDesc: string;
  storyTitle: string;
  storyDesc: string;
  ctaText: string;
  ctaButton: string;
};

export type LandingData = {
  drinks: Drink[];
  toppings: ToppingOption[];
  promotions: Promotion[];
  store: StoreInfo;
  content: StoryContent;
};

type CmsProduct = {
  id: string;
  name: string;
  category: string;
  tag: string;
  priceM: number;
  priceL: number;
  image: string;
  desc: string;
  active: boolean;
};

type CmsPayload = {
  products: CmsProduct[];
  toppings: { id: string; name: string; price: number; active: boolean }[];
  offers: { id: string; title: string; desc: string; start: string; end: string; active: boolean }[];
  content: {
    heroTitleVi: string;
    heroDescVi: string;
    storyTitle: string;
    storyDesc: string;
    ctaText: string;
    ctaButton: string;
  };
  settings: {
    shopName: string;
    shopAddress: string;
    shopPhone: string;
    shopEmail: string;
    shopHours: string;
  };
};

const CARD_COLORS = ["#d7a85b", "#9ebe65", "#b990d7", "#e88f6f", "#7fb8c9", "#c9a2b8"];

// Local high-quality cutouts for the sample drinks; remote CMS images are used otherwise.
const LOCAL_IMAGES: Record<string, string> = {
  "trà sữa đường đen": "/milktea-assets/clean-brown-sugar-cutout.png",
  "matcha kem sữa": "/milktea-assets/clean-matcha-cutout.png",
  "khoai môn mây tím": "/milktea-assets/clean-taro-cutout.png",
  "ô long đào": "/milktea-assets/clean-oolong-peach-cutout.png",
};

const DEFAULT_INGREDIENTS = ["Trà ủ mới", "Sữa tươi", "Trân châu"];

export const fallbackData: LandingData = {
  drinks: [
    {
      id: "duong-den",
      name: "Trà sữa đường đen",
      badge: "Bán chạy",
      description: "Trà sữa thơm đậm, sữa tươi béo nhẹ và trân châu đường đen nấu mới mỗi ngày.",
      priceM: 39000,
      priceL: 49000,
      image: "/milktea-assets/clean-brown-sugar-cutout.png",
      color: "#d7a85b",
      ingredients: ["Trà đen", "Sữa tươi", "Đường đen", "Trân châu đen"],
    },
    {
      id: "matcha-kem-sua",
      name: "Matcha kem sữa",
      badge: "Vị thanh",
      description: "Matcha xanh thơm, lớp kem sữa béo nhẹ và hậu vị mát hợp ngày nắng Đà Nẵng.",
      priceM: 45000,
      priceL: 55000,
      image: "/milktea-assets/clean-matcha-cutout.png",
      color: "#9ebe65",
      ingredients: ["Matcha", "Sữa tươi", "Kem sữa", "Trân châu đen"],
    },
    {
      id: "khoai-mon-may-tim",
      name: "Khoai môn mây tím",
      badge: "Món mới",
      description: "Khoai môn tím thơm, chất sữa mịn và màu ly nổi bật khi chụp ảnh cùng bạn bè.",
      priceM: 42000,
      priceL: 52000,
      image: "/milktea-assets/clean-taro-cutout.png",
      color: "#b990d7",
      ingredients: ["Khoai môn", "Sữa tươi", "Kem mây", "Trân châu"],
    },
  ],
  toppings: [
    { name: "Trân châu đen", price: 7000 },
    { name: "Trân châu trắng", price: 7000 },
    { name: "Thạch đào", price: 6000 },
    { name: "Pudding trứng", price: 8000 },
    { name: "Kem cheese", price: 10000 },
    { name: "Thạch cà phê", price: 6000 },
  ],
  promotions: [
    { label: "Ưu đãi 1", title: "Mua 2 ly giảm 15%", date: "Thời hạn: chủ cửa hàng cập nhật" },
    { label: "Ưu đãi 2", title: "Miễn phí topping cho đơn đầu tiên", date: "Thời hạn: chủ cửa hàng cập nhật" },
    { label: "Ưu đãi 3", title: "Giảm 20% cho sinh viên", date: "Thời hạn: chủ cửa hàng cập nhật" },
  ],
  store: {
    name: "AURATEA",
    address: "[ĐỊA CHỈ CỬA HÀNG]",
    phone: "[SỐ ĐIỆN THOẠI]",
    email: "hello@auratea.vn",
    hours: "[GIỜ MỞ CỬA]",
  },
  content: {
    heroTitle: "Trà thơm đúng vị, ngọt vừa đúng gu.",
    heroDesc: "AURATEA mang đến những ly trà sữa tươi mới mỗi ngày, trân châu nấu tại cửa hàng.",
    storyTitle: "Một ly ngon bắt đầu từ nguyên liệu tốt",
    storyDesc: "Trà ủ mới, trân châu nấu mỗi ngày và pha theo khẩu vị của khách.",
    ctaText: "Đặt trà ngay hôm nay",
    ctaButton: "Đặt trà ngay",
  },
};

function mapPayload(payload: CmsPayload): LandingData {
  const drinks: Drink[] = payload.products.map((product, index) => ({
    id: product.id,
    name: product.name,
    badge: product.tag || product.category,
    description: product.desc,
    priceM: product.priceM,
    priceL: product.priceL,
    image: LOCAL_IMAGES[product.name.toLowerCase().trim()] ?? product.image,
    color: CARD_COLORS[index % CARD_COLORS.length],
    ingredients: DEFAULT_INGREDIENTS,
  }));

  const promotions: Promotion[] = payload.offers.map((offer, index) => ({
    label: `Ưu đãi ${index + 1}`,
    title: offer.title,
    date: offer.start && offer.end ? `${offer.start} → ${offer.end}` : offer.desc,
  }));

  return {
    drinks: drinks.length > 0 ? drinks : fallbackData.drinks,
    toppings: payload.toppings.map(({ name, price }) => ({ name, price })),
    promotions: promotions.length > 0 ? promotions : fallbackData.promotions,
    store: {
      name: payload.settings.shopName,
      address: payload.settings.shopAddress,
      phone: payload.settings.shopPhone,
      email: payload.settings.shopEmail,
      hours: payload.settings.shopHours,
    },
    content: {
      heroTitle: payload.content.heroTitleVi,
      heroDesc: payload.content.heroDescVi,
      storyTitle: payload.content.storyTitle,
      storyDesc: payload.content.storyDesc,
      ctaText: payload.content.ctaText,
      ctaButton: payload.content.ctaButton,
    },
  };
}

export async function getLandingData(): Promise<LandingData> {
  const baseUrl = process.env.CMS_API_URL ?? "https://cms-trasua.vercel.app";

  try {
    const response = await fetch(`${baseUrl}/api/public/landing`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) throw new Error(`CMS responded ${response.status}`);
    const payload = (await response.json()) as CmsPayload;
    return mapPayload(payload);
  } catch (error) {
    console.warn("Could not load data from CMS, using fallback sample data.", error);
    return fallbackData;
  }
}
