const CONFIG = {
    subject: {
        name: "[HER NAME]",
        aliases: ["[Nickname 1]", "[Nickname 2]", "[Nickname 3]"],
        occupation: "[Funny description of occupation]",
        specialAbilities: [
            "Sending the perfect sticker at the worst possible time",
            "[Personal joke / Special Ability 1]",
            "[Personal joke / Special Ability 2]",
            "Having the balls to do things nobody else would"
        ],
        stats: [
            { label: "Sticker Usage", percentage: 100 },
            { label: "Random Adventures", percentage: 82 },
            { label: "Normal Conversations", percentage: 1 },
            { label: "Niggi", percentage: 147, overflow: true }
        ]
    },
    witnesses: [
        {
            id: 1,
            name: "[Friend 1 Name]",
            role: "[Narrator / Funny Role]",
            context: "[How they know her / How long]",
            description: "[One extremely inaccurate sentence describing her.]",
            image: "assets/images/placeholder_friend.png"
        },
        {
            id: 2,
            name: "[Friend 2 Name]",
            role: "[Comic Relief / Funny Role]",
            context: "[How they know her / How long]",
            description: "[One extremely inaccurate sentence describing her.]",
            image: "assets/images/placeholder_friend.png"
        },
        {
            id: 3,
            name: "[Friend 3 Name]",
            role: "[Memory Keeper / Funny Role]",
            context: "[How they know her / How long]",
            description: "[One extremely inaccurate sentence describing her.]",
            image: "assets/images/placeholder_friend.png"
        },
        {
            id: 4,
            name: "[Friend 4 Name]",
            role: "[Emotional Support / Funny Role]",
            context: "[How they know her / How long]",
            description: "[One extremely inaccurate sentence describing her.]",
            image: "assets/images/placeholder_friend.png"
        },
        {
            id: 5,
            name: "[Friend 5 Name]",
            role: "[Funny Role]",
            context: "[How they know her / How long]",
            description: "[One extremely inaccurate sentence describing her.]",
            image: "assets/images/placeholder_friend.png"
        },
        {
            id: 6,
            name: "[Friend 6 Name]",
            role: "[Final Message / Funny Role]",
            context: "[How they know her / How long]",
            description: "[One extremely inaccurate sentence describing her.]",
            image: "assets/images/placeholder_friend.png"
        }
    ],
    stickers: [
        {
            id: "sticker1",
            category: "EMOTIONAL SUPPORT",
            description: "Stickers deployed when words have failed.",
            image: "assets/stickers/placeholder_sticker1.png",
            audioPath: "assets/audio/placeholder_sticker1.mp3",
            narrationText: "[Friend 1 voice: She uses these...]"
        },
        {
            id: "sticker2",
            category: "VIOLENCE",
            description: "Stickers deployed when words have failed and patience has disappeared.",
            image: "assets/stickers/placeholder_sticker2.png",
            audioPath: "assets/audio/placeholder_sticker2.mp3",
            narrationText: "[Friend 2 voice: And these for violence.]"
        }
    ],
    evidence: [
        {
            id: "ev1",
            title: "INCIDENT #042",
            context: "Location: Somewhere we definitely shouldn't have been.",
            importance: "Extremely high.",
            image: "assets/images/placeholder_evidence1.png"
        },
        {
            id: "ev2",
            title: "EVIDENCE OF NORMALCY",
            context: "Context: Unknown",
            importance: "The photographic evidence that we occasionally behaved normally.",
            image: "assets/images/placeholder_evidence2.png"
        },
        {
            id: "ev3",
            title: "EXHIBIT: BALLS",
            context: "Description: Unquantifiable balls. Possibly the highest ever recorded.",
            importance: "Classified.",
            image: "assets/images/placeholder_evidence1.png"
        }
    ],
    seriousPart: {
        text: [
            "Okay. We've made enough jokes.",
            "So here's the part we actually wanted to tell you.",
            "This year hasn't always been easy.",
            "There have been days where things didn't go the way you wanted.",
            "There have been exams that demanded more from you than you thought you had.",
            "There have probably been moments where you wondered whether all this effort was actually leading somewhere.",
            "But you are not defined by one exam.",
            "You are not defined by one result.",
            "Your timeline does not have to look like someone else's.",
            "We believe in you.",
            "We don't know exactly what the next few months will look like.",
            "But we trust that you will find your way."
        ],
        audioFiles: [
            "assets/audio/placeholder_motivation1.mp3",
            "assets/audio/placeholder_motivation2.mp3"
        ]
    },
    last1sLore: [
        "Last1s was formed",
        "[Questionable decisions were made]",
        "Last1s Standing",
        "Last1s Consolation",
        "[More questionable decisions]",
        "[HER NAME] became an important part of the story",
        "Balls were had",
        "Today"
    ],
    futurePart: {
        text: [
            "We don't know exactly what the next few months are going to look like.",
            "There will probably be good days.",
            "There will probably be terrible days.",
            "There will probably be at least three completely unnecessary existential crises.",
            "But whatever happens...",
            "You won't be figuring it all out alone."
        ]
    },
    birthdayReveal: {
        title: "HAPPY BIRTHDAY, [HER NAME]",
        audioFiles: [
            "assets/audio/placeholder_bday1.mp3",
            "assets/audio/placeholder_bday2.mp3"
        ]
    }
};

export default CONFIG;
