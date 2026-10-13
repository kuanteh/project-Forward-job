const mongoose = require("mongoose");
const User = require("./models/User");
const Inbox = require("./models/Inbox");
const Attendance = require("./models/Attendance");
const Mission = require("./models/Mission");
require("dotenv").config();

const users = [
    {
        name: "Sir Paul",
        email: "paul@forward.edu",
        role: "teacher",
        characterName: "Sir Paul",
        image: "/image/SirPaulGta.png",
        isProtected: true,
    },
    {
        name: "Ms Kher Nee",
        email: "khernee@forward.edu",
        role: "office",
        characterName: "Ms Kher Nee",
        image: "/image/MsKherNeeGta.png",
        isProtected: true,
    },
    {
        name: "ZeYu",
        email: "zeyu@forward.edu",
        role: "student",
        characterName: "ZeYu",
        image: "/image/ZeYuGta.png",
        isProtected: true,
    },
    {
        name: "Sir Howie",
        email: "howie@forward.edu",
        role: "admin",
        characterName: "Sir Howie",
        image: "/image/SirHowieGta.png",
        isProtected: true,
    },
    {
        name: "Michael De Santa",
        email: "mike@forward.edu",
        role: "mike",
        characterName: "Michael De Santa",
        money: 0,
        image: "/image/Mike.png",
        isProtected: true,
    },
];

// Connect to MongoDB and seed data
mongoose
    .connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log("Connected to MongoDB");

        // Clear existing data
        await User.deleteMany({});
        await Inbox.deleteMany({});
        await Attendance.deleteMany({});
        await Mission.deleteMany({});
        console.log("Cleared old data");

        const createdUsers = await User.insertMany(users);
        console.log(`Seeded ${createdUsers.length} users`);

        console.log("\nCharacters:");
        createdUsers.forEach((u) => {
            console.log(`- ${u.characterName} | ${u._id} | role: ${u.role}`);
        });

        process.exit(0);
    })
    .catch((err) => {
        console.error("Error seeding database:", err);
        process.exit(1);
    });
