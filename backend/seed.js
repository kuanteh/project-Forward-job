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
        password: "123456",
        role: "teacher",
        characterName: "Sir Paul",
    },
    {
        name: "Sir Sean",
        email: "sean@forward.edu",
        password: "123456",
        role: "teacher",
        characterName: "Sir Sean",
    },
    {
        name: "Ms Kher Nee",
        email: "khernee@forward.edu",
        password: "123456",
        role: "office",
        characterName: "Ms Kher Nee",
        officeRole: "kherNee",
    },
    {
        name: "Melissa",
        email: "melissa@forward.edu",
        password: "123456",
        role: "office",
        characterName: "Melissa",
        officeRole: "melissa",
    },
    {
        name: "Yisheng",
        email: "yisheng@forward.edu",
        password: "123456",
        role: "student",
        characterName: "Yisheng",
    },
    {
        name: "ZeYu",
        email: "zeyu@forward.edu",
        password: "123456",
        role: "student",
        characterName: "ZeYu",
    },
    {
        name: "Ian",
        email: "ian@forward.edu",
        password: "123456",
        role: "student",
        characterName: "Ian",
    },
    {
        name: "Sir Howie",
        email: "howie@forward.edu",
        password: "123456",
        role: "admin",
        characterName: "Sir Howie",
    },
    {
        name: "Mike",
        email: "mike@forward.edu",
        password: "123456",
        role: "mike",
        characterName: "Mike",
        money: 0,
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

        // use save() so password hash works
        const createdUsers = [];
        for (const userData of users) {
            const user = new User(userData);
            await user.save();
            createdUsers.push(user);
        }
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

        console.log("\nLogin accounts (password: 123456):");
        createdUsers.forEach((u) => {
            console.log(`- ${u.characterName} | ${u.email} | role: ${u.role}`);
        });

        process.exit(0);
    })
    .catch((err) => {
        console.error("Error seeding database:", err);
        process.exit(1);
    });
