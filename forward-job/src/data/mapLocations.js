import { classroomCharacters } from "./classroomProfiles";

/**
 * Every place Mike can teleport to.
 * The icon on the map and the list on the top right corner both read from here,
 * so if i change a name or a position i only change one place.
 *
 * x / y = position in % on forward-map.jpg ( the image is 16:9 ).
 * Upper building is around y 34 , lower building around y 65.
 * If an icon look off , open the map and nudge the number , 1% is about 10px.
 *
 * extraState      = extra thing to pass into the page ( eg. which sem )
 * allowCharacters = only these characterName can go in , others get blocked
 */
export const mapLocations = [
    // lower building
    {
        id: "classroomSem1",
        label: "Classroom Sem 1",
        icon: "🎓",
        x: 36.9,
        y: 65,
        path: "/classroom",
        extraState: { sem: 1 },
        allowCharacters: classroomCharacters,
    },
    {
        id: "classroomSem2",
        label: "Classroom Sem 2",
        icon: "🎓",
        x: 48.3,
        y: 65,
        path: "/classroom",
        extraState: { sem: 2 },
        allowCharacters: classroomCharacters,
    },
    {
        id: "officeSpace",
        label: "Office Space",
        icon: "💼",
        x: 53.9,
        y: 65,
        path: "/office",
    },
    {
        id: "eventSpace",
        label: "Event Space",
        icon: "🎪",
        x: 59.9,
        y: 65,
        path: "/eventSpace",
    },
    {
        id: "pingpong",
        label: "Ping Pong",
        icon: "🏓",
        x: 65.6,
        y: 65,
        path: "/pingpong",
    },
    {
        id: "counter",
        label: "Counter",
        icon: "🛎️",
        x: 75.7,
        y: 65,
        path: "/counter",
    },

    // upper building
    {
        id: "meetingRoom1",
        label: "Meeting Room 1",
        icon: "📋",
        x: 48.5,
        y: 34,
        path: "/meetingroom1",
    },
    {
        id: "sofaKitchen",
        label: "Sofa / Kitchen",
        icon: "🍳",
        x: 54.2,
        y: 34,
        path: "/kitchen",
    },
];
