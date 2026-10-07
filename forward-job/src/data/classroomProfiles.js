/**
 * Classroom seats.
 * Only ZeYu (student) and Sir Paul (teacher) got a seat now.
 *
 * laptopApps:
 * - student => Inbox only
 * - teacher => Inbox + Forward Campus Network
 */
export const classroomProfiles = {
    ZeYu: {
        seat: "Sem 2 - window side",
        theme: "zeyu",
        apps: ["inbox"],
        defaultApp: "inbox",
    },
    "Sir Paul": {
        seat: "Teacher desk",
        theme: "paul",
        apps: ["inbox", "fcn"],
        defaultApp: "fcn",
    },
};

// mapLocations.js use this for classroom door check
export const classroomCharacters = Object.keys(classroomProfiles);
