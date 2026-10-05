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
        image: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Paul",
    },
    {
        name: "Sir Sean",
        email: "sean@forward.edu",
        role: "teacher",
        characterName: "Sir Sean",
        image: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Sean",
    },
    {
        name: "Ms Kher Nee",
        email: "khernee@forward.edu",
        role: "office",
        characterName: "Ms Kher Nee",
        officeRole: "kherNee",
        image: "https://api.dicebear.com/7.x/pixel-art/svg?seed=KherNee",
    },
    {
        name: "Melissa",
        email: "melissa@forward.edu",
        role: "office",
        characterName: "Melissa",
        officeRole: "melissa",
        image: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Melissa",
    },
    {
        name: "Yisheng",
        email: "yisheng@forward.edu",
        role: "student",
        characterName: "Yisheng",
        image: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Yisheng",
    },
    {
        name: "ZeYu",
        email: "zeyu@forward.edu",
        role: "student",
        characterName: "ZeYu",
        image: "https://api.dicebear.com/7.x/pixel-art/svg?seed=ZeYu",
    },
    {
        name: "Ian",
        email: "ian@forward.edu",
        role: "student",
        characterName: "Ian",
        image: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Ian",
    },
    {
        name: "Sir Howie",
        email: "howie@forward.edu",
        role: "admin",
        characterName: "Sir Howie",
        image: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Howie",
    },
    {
        name: "Mike",
        email: "mike@forward.edu",
        role: "mike",
        characterName: "Mike",
        money: 0,
        image: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Mike",
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

        const findByRole = (role, characterName) =>
            createdUsers.find((u) => u.role === role && u.characterName === characterName);

        const melissa = findByRole("office", "Melissa");
        const kherNee = findByRole("office", "Ms Kher Nee");
        const yisheng = findByRole("student", "Yisheng");
        const zeyu = findByRole("student", "ZeYu");
        const ian = findByRole("student", "Ian");
        const mike = findByRole("mike", "Mike");

        // sample inbox
        await Inbox.insertMany([
            {
                from: melissa._id,
                to: yisheng._id,
                subject: "Tuition Reminder",
                message: "Hi Yisheng, please pay your tuition fee this week. Thank you!",
                type: "tuition",
            },
            {
                from: melissa._id,
                to: zeyu._id,
                subject: "Tuition Reminder",
                message: "Hi ZeYu, your tuition payment is still pending.",
                type: "tuition",
            },
            {
                from: kherNee._id,
                to: ian._id,
                subject: "Warning Letter",
                message: "Ian, you were playing pingpong too long during class time. Please return to class.",
                type: "warning",
            },
        ]);
        console.log("Seeded inbox messages");

        // sample attendance
        const today = new Date();
        await Attendance.insertMany([
            {
                student: yisheng._id,
                date: today,
                status: "present",
                markedBy: kherNee._id,
            },
            {
                student: zeyu._id,
                date: today,
                status: "late",
                markedBy: kherNee._id,
                note: "Came late from pingpong",
            },
            {
                student: ian._id,
                date: today,
                status: "absent",
                markedBy: kherNee._id,
            },
        ]);
        console.log("Seeded attendance records");

        // sample missions for Mike
        await Mission.insertMany([
            {
                player: mike._id,
                title: "Collect 20 pingpong in 10 sec",
                type: "pingpong",
                status: "pending",
                reward: 200,
                targetCount: 20,
                timeLimit: 10,
            },
            {
                player: mike._id,
                title: "Find the lost wallet",
                type: "lostFound",
                status: "pending",
                reward: 200,
                targetLocation: "kitchen",
                timeLimit: 10,
            },
        ]);
        console.log("Seeded missions");

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
