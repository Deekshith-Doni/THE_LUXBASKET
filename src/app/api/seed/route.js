import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const initialCategories = [
  {
    name: "Luxury Hampers",
    slug: "luxury-hampers",
    description:
      "Indulgent premium gift hampers curated for gourmet lovers and wellness enthusiasts.",
    image:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80",
    isActive: true,
    sortOrder: 1,
  },
  {
    name: "Corporate Gifts",
    slug: "corporate",
    description:
      "Sleek, executive gift sets crafted to impress clients, partners, and employees.",
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80",
    isActive: true,
    sortOrder: 2,
  },
  {
    name: "Wedding Gifts",
    slug: "wedding",
    description:
      "Exquisite wedding return gifts and trousseau hampers to make your big day unforgettable.",
    image:
      "https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800&q=80",
    isActive: true,
    sortOrder: 3,
  },
  {
    name: "Festive Hampers",
    slug: "festive",
    description:
      "Cinematic, celebratory gift baskets curated for Diwali, Eid, Christmas, and new beginnings.",
    image:
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=80",
    isActive: true,
    sortOrder: 4,
  },
  {
    name: "Customized Gifts",
    slug: "customized",
    description:
      "Tailor-made gift hampers where you choose the box style, ribbons, contents, and message.",
    image:
      "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&q=80",
    isActive: true,
    sortOrder: 5,
  },
];

const getProductsData = (categoriesMap) => [
  {
    name: "Royal Diwali Celebration Hamper",
    slug: "royal-diwali-hamper",
    description: `Experience the pinnacle of festive gifting with our Royal Diwali Celebration Hamper. Each basket is hand-curated with the finest selection of premium dry fruits, artisanal chocolates, luxury sweets, and fragrant incense — all presented in our signature emerald and gold gift box.
    Perfect for corporate gifting, family celebrations, and showing your appreciation in the most luxurious way possible.`,
    shortDescription:
      "Premium dry fruits, sweets & artisanal chocolates in signature packaging",
    images: [
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=90",
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&q=90",
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=90",
    ],
    price: 2999,
    discountPrice: 2499,
    category: categoriesMap["festive"],
    tags: ["festive", "diwali", "luxury", "premium"],
    customizationOptions: {
      available: true,
      options: ["Add Name Card", "Custom Ribbon Color", "Add Premium Box"],
    },
    bulkOrderAvailable: true,
    minBulkQuantity: 25,
    stock: 50,
    sku: "TLB-ROY-DIW-01",
    isActive: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    rating: 4.9,
    numReviews: 234,
  },
  {
    name: "Corporate Elegance Box",
    slug: "corporate-elegance-box",
    description: `Make a lasting impression with the Corporate Elegance Box, custom-tailored for business professionals and corporate gifting. This sleek package features high-end desktop accessories, a premium leather-bound planner, an insulated flask, and gourmet chocolates. Includes options for corporate logo debossing and customized brand cards.`,
    shortDescription:
      "Premium executive gift set with branded packaging options",
    images: [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=90",
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&q=90",
    ],
    price: 1999,
    discountPrice: 1699,
    category: categoriesMap["corporate"],
    tags: ["corporate", "office", "elegant"],
    customizationOptions: {
      available: true,
      options: ["Engrave Logo", "Custom Color Theme"],
    },
    bulkOrderAvailable: true,
    minBulkQuantity: 10,
    stock: 200,
    sku: "TLB-CORP-ELG-02",
    isActive: true,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    rating: 4.8,
    numReviews: 189,
  },
  {
    name: "Luxury Spa & Wellness Hamper",
    slug: "luxury-spa-wellness-hamper",
    description: `Bring the spa experience home with our Luxury Spa & Wellness Hamper. Carefully curated with premium organic bath salts, aromatherapy candles, natural body scrub, plush hand towels, and skin-replenishing essential oils. Packed in a handwoven white willow basket that radiates serenity and self-care.`,
    shortDescription:
      "Artisanal bath salts, candles & premium skincare products",
    images: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=90",
      "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&q=90",
    ],
    price: 3499,
    category: categoriesMap["luxury-hampers"],
    tags: ["spa", "wellness", "self-care", "luxury"],
    customizationOptions: {
      available: false,
      options: [],
    },
    bulkOrderAvailable: false,
    stock: 30,
    sku: "TLB-SPA-WELL-03",
    isActive: true,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.9,
    numReviews: 156,
  },
  {
    name: "Wedding Return Gift Set",
    slug: "wedding-return-gift-set",
    description: `Express your gratitude to your guests with our Wedding Return Gift Set. Featuring a hand-crafted metal platter with premium dry fruit jars, a pair of customized designer diyas, and authentic Indian sweets. Every element is customizable with your wedding emblem, initials, and date to match your theme.`,
    shortDescription: "Elegant customizable return gift set for your big day",
    images: [
      "https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800&q=90",
    ],
    price: 899,
    discountPrice: 749,
    category: categoriesMap["wedding"],
    tags: ["wedding", "return-gift", "traditional"],
    customizationOptions: {
      available: true,
      options: ["Emblem Printing", "Monogram Label", "Specific Box Color"],
    },
    bulkOrderAvailable: true,
    minBulkQuantity: 50,
    stock: 500,
    sku: "TLB-WED-RET-04",
    isActive: true,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    rating: 4.7,
    numReviews: 312,
  },
  {
    name: "Artisan Chocolate Gift Box",
    slug: "artisan-chocolate-gift-box",
    description: `Satisfy the sweetest tooth with our signature Artisan Chocolate Gift Box. Contains 24 hand-rolled Belgian truffles, milk chocolate pralines, and gourmet dark chocolate bars infused with sea salt, nuts, and berries. Arranged inside a premium magnetic-latch black matte box.`,
    shortDescription: "Hand-crafted Belgian chocolates in luxury packaging",
    images: [
      "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&q=90",
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=90",
    ],
    price: 1299,
    category: categoriesMap["luxury-hampers"],
    tags: ["chocolate", "sweets", "luxury", "gourmet"],
    customizationOptions: {
      available: true,
      options: ["Add Customized Greeting Sleeve"],
    },
    bulkOrderAvailable: true,
    minBulkQuantity: 15,
    stock: 100,
    sku: "TLB-CHO-BOX-05",
    isActive: true,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.8,
    numReviews: 98,
  },
  {
    name: "Premium Tea & Biscuit Hamper",
    slug: "premium-tea-biscuit-hamper",
    description: `Sip in style with the Premium Tea & Biscuit Hamper. Curated for tea lovers, this hamper brings together three premium organic loose-leaf tea tins (Earl Grey, Jasmine Green, and Masala Chai) accompanied by custom-baked almond biscotti and a gold-plated tea strainer.`,
    shortDescription:
      "Exotic tea collection with artisanal biscuits and gold strainer",
    images: [
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80",
    ],
    price: 1599,
    discountPrice: 1299,
    category: categoriesMap["festive"],
    tags: ["tea", "festive", "beverage", "healthy"],
    customizationOptions: {
      available: false,
      options: [],
    },
    bulkOrderAvailable: true,
    minBulkQuantity: 20,
    stock: 75,
    sku: "TLB-TEA-BIS-06",
    isActive: true,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    rating: 4.6,
    numReviews: 67,
  },
];

export async function GET() {
  try {
    await connectDB();

    // 1. Seed Categories
    await Category.deleteMany({});
    const createdCategories = await Category.insertMany(initialCategories);

    // Map slug to category ID
    const categoriesMap = {};
    createdCategories.forEach((cat) => {
      categoriesMap[cat.slug] = cat._id.toString();
    });

    // 2. Seed Products
    await Product.deleteMany({});
    const productsData = getProductsData(categoriesMap);
    await Product.insertMany(productsData);

    // 3. Seed Default Admin User
    await User.deleteMany({ email: "admin@theluxbasket.com" });
    const hashedPassword = await bcrypt.hash("admin12345", 10);
    await User.create({
      name: "Lux Basket Admin",
      email: "admin@theluxbasket.com",
      password: hashedPassword,
      role: "admin",
      provider: "credentials",
      isVerified: true,
    });

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully!",
      categoriesSeeded: createdCategories.length,
      productsSeeded: productsData.length,
      adminCreated: {
        email: "admin@theluxbasket.com",
        password: "admin12345 (Change this immediately in production)",
      },
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: error.message },
      { status: 500 },
    );
  }
}
