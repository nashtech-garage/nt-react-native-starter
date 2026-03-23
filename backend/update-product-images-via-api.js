const BASE_URL = "http://localhost:3000";

const targetImages = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=1200",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1200",
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
  const username = `img_fix_admin_${stamp}`;
  const payload = {
    firstName: "Image",
    lastName: "Fixer",
    email: `${username}@example.com`,
    username,
    password: "ImageFix123!",
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
  return token;
}

async function updateImages() {
  const token = await createAdminAndGetToken();

  for (const item of targetImages) {
    await request(`/product/${item.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ image: item.image }),
    });
    console.log(`Updated product ${item.id} image`);
  }

  console.log("Done.");
}

updateImages().catch((error) => {
  console.error("Update failed:", error.message);
  process.exit(1);
});
