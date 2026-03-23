const BASE_URL = "http://localhost:3000";

const products = [
  {
    name: "Sonic-u Wireless Speaker",
    description: "Portable wireless speaker with deep bass and crisp vocals.",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=900",
    price: 129,
    priceUnit: "dollar",
  },
  {
    name: "Metro Classic Timepiece",
    description: "Minimal stainless watch for everyday wear.",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=900",
    price: 85.5,
    priceUnit: "dollar",
  },
  {
    name: "Artisan Ceramic Mug",
    description: "Handmade ceramic mug with matte finish.",
    image: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=900",
    price: 24,
    priceUnit: "dollar",
  },
  {
    name: "Glow Essentials Kit",
    description: "Daily skin care starter kit with natural ingredients.",
    image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=900",
    price: 45,
    priceUnit: "dollar",
  },
  {
    name: "Nova Studio Headphones",
    description: "Over-ear noise isolation headphones with memory foam.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900",
    price: 149.99,
    priceUnit: "dollar",
  },
  {
    name: "Aurora Desk Lamp",
    description: "Warm LED desk lamp with touch dimmer control.",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900",
    price: 39.9,
    priceUnit: "euro",
  },
  {
    name: "Orbit Travel Backpack",
    description: "Water-resistant backpack with laptop sleeve.",
    image: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=900",
    price: 79,
    priceUnit: "euro",
  },
  {
    name: "Fresh Leaf Diffuser",
    description: "Ultrasonic diffuser for home and office spaces.",
    image: "https://images.unsplash.com/photo-1616627452096-7de58bd6e8c0?w=900",
    price: 54,
    priceUnit: "euro",
  },
  {
    name: "Cloud Knit Sneakers",
    description: "Lightweight knit sneakers for daily walking comfort.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900",
    price: 6690,
    priceUnit: "inr",
  },
  {
    name: "Terra Yoga Mat",
    description: "Non-slip yoga mat with extra cushioning.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900",
    price: 2499,
    priceUnit: "inr",
  },
  {
    name: "Pulse Smart Bottle",
    description: "Hydration reminder bottle with temperature display.",
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=900",
    price: 3299,
    priceUnit: "inr",
  },
  {
    name: "Breeze Linen Shirt",
    description: "Breathable premium linen shirt with relaxed fit.",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900",
    price: 58.75,
    priceUnit: "dollar",
  },
];

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body?.status === false) {
    const message = body?.error?.message || `${response.status} ${response.statusText}`;
    throw new Error(message);
  }
  return body;
}

async function createAdminAndGetToken() {
  const stamp = Date.now();
  const username = `seed_admin_${stamp}`;
  const payload = {
    firstName: "Seed",
    lastName: "Admin",
    email: `${username}@example.com`,
    username,
    password: "SeedAdmin123!",
    role: "admin",
    age: 30,
  };

  const signUpBody = await request("/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const token = signUpBody?.data?.token;
  if (!token) {
    throw new Error("Could not get token from signup response.");
  }
  return { token, username };
}

async function seedProducts() {
  const { token, username } = await createAdminAndGetToken();
  console.log(`Admin created: ${username}`);

  let created = 0;
  for (const product of products) {
    await request("/product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    created += 1;
    console.log(`Created ${created}/${products.length}: ${product.name}`);
  }

  console.log(`Done. Added ${created} products via API.`);
}

seedProducts().catch((error) => {
  console.error("Seeding failed:", error.message);
  process.exit(1);
});
