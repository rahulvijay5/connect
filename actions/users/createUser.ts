import { db } from "@/lib/db";

export default async function createUser() {
    try {
      const newUser = await db.user.create({
        data: {
          email: "user1@example.com",
          name: "John Doe",
          username: "user1",
          birthdate: new Date("1990-05-15"),
          currentLocation: "New York",
          hometown: "Los Angeles",
          profession: "Software Engineer",
          bio: "Passionate about technology and coding.",
          contactDetails: {
            create: {
              phone: "1234567890",
              address: "123 Main St, New York"
            }
          },
          socialLinks: {
            create: {
              facebook: "https://www.facebook.com/user1",
              Instagram: "https://twitter.com/user1"
            }
          },
          interests: ["Technology", "Coding", "Music"],
          hobbies: ["Hiking", "Reading"],
          images: ["https://example.com/user1-image1.jpg", "https://example.com/user1-image2.jpg"]
        }
      });
  
      console.log("User created:", newUser);
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      await db.$disconnect();
    }
  }