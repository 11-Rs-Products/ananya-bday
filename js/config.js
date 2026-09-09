const CONFIG = {
    subject: {
        name: "Ananya Verma",
        aliases: ["Niggi", "Sukhi", "Resident Barista"],
        occupation: "Certified Chotu & CEO of the local Daaru Ka Tent",
        specialAbilities: [
            "Deploying the exact right sticker at the absolute worst psychological moment",
            "Hoarding an ungodly collection of weird, cursed, and questionable internet artifacts",
            "Rocking suspiciously majestic blue hair with undeniable main-character energy",
            "Possessing the undisputed balls to do things nobody else would dare attempt",
            "Providing aggressive emotional support followed by immediate violence"
        ],
        stats: [
            { label: "Sticker Warfare", percentage: 100 },
            { label: "Random Chaotic Quests", percentage: 88 },
            { label: "Normal Human Conversations", percentage: 2 },
            { label: "Pure Niggi Energy", percentage: 147, overflow: true }
        ]
    },
    witnesses: [
        {
            id: 1,
            name: "Abhita",
            role: "[Narrator / Funny Role]",
            context: "[How they know her / How long]",
            description: "[One extremely inaccurate sentence describing her.]",
            image: "assets/images/placeholder_friend.png"
        },
        {
            id: 2,
            name: "Ksreya",
            role: "[Comic Relief / Funny Role]",
            context: "[How they know her / How long]",
            description: "[One extremely inaccurate sentence describing her.]",
            image: "assets/images/placeholder_friend.png"
        },
        {
            id: 3,
            name: "Himansii",
            role: "[Memory Keeper / Funny Role]",
            context: "[How they know her / How long]",
            description: "[One extremely inaccurate sentence describing her.]",
            image: "assets/images/placeholder_friend.png"
        },
        {
            id: 4,
            name: "Amrutansii",
            role: "[Emotional Support / Funny Role]",
            context: "[How they know her / How long]",
            description: "[One extremely inaccurate sentence describing her.]",
            image: "assets/images/placeholder_friend.png"
        },
        {
            id: 5,
            name: "Vinita",
            role: "[Funny Role]",
            context: "[How they know her / How long]",
            description: "[One extremely inaccurate sentence describing her.]",
            image: "assets/images/placeholder_friend.png"
        },
        {
            id: 6,
            name: "Reyansii",
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
            description: "Stickers deployed when words have failed and aggressive comfort is required.",
            image: "assets/stickers/few/emotionalsupport.webp",
            audioPath: "assets/audio/placeholder_sticker1.mp3",
            narrationText: "[Friend 1 voice: Ye le aur randirona band kr]"
        },
        {
            id: "sticker2",
            category: "VIOLENCE & RETALIATION",
            description: "Stickers deployed when words have failed and patience has permanently exited.",
            image: "assets/stickers/few/violence.webp",
            audioPath: "assets/audio/placeholder_sticker2.mp3",
            narrationText: "[Friend 2 voice: Dosto side hona, mujhe iski gand me bans dalna hai]"
        },

        {
            id: "sticker4",
            category: "CRISIS DE-ESCALATION",
            description: "Deployed when someone commits the crime of taking themselves too seriously.",
            image: "assets/stickers/few/UBfc-04ZU5EvW7tn6rCCWWTuCKWvivQSTY+ROh4a3M4=.webp",
            audioPath: "assets/audio/placeholder_sticker2.mp3",
            narrationText: "[Friend 4 voice: Chill out, it's a joke not a dick, don't take it so hard]"
        },
        {
            id: "sticker5",
            category: "BOUNDARY CONTROL",
            description: "Extreme social distancing protocol deployed against uninvited opinions.",
            image: "assets/stickers/few/tyvbXKsypl+sL6DHUZW1CJ3e2gf1vSme4yFCUmHrOaM=.webp",
            audioPath: "assets/audio/placeholder_sticker1.mp3",
            narrationText: "[Friend 5 voice: Dur reh]"
        },
        {
            id: "sticker6",
            category: "EMERGENCY BRAKES",
            description: "The emergency handbrake deployed when Ananya is doing entirely too much.",
            image: "assets/stickers/few/CG9jkYw0jI-K59EDSPZopVbf8aZLIWNypxARKe4v6wQ=.webp",
            audioPath: "assets/audio/placeholder_sticker2.mp3",
            narrationText: "[Friend 6 voice: Tham ja bawli gand]"
        },
        {
            id: "sticker7",
            category: "AFFECTIONATE THREATS",
            description: "The purest expression of long-distance love and emotional attachment.",
            image: "assets/stickers/few/XRnfiK5p2BG3xLYiyasiUo1ukQnQfb-isiRcoRoI63I=.webp",
            audioPath: "assets/audio/placeholder_sticker1.mp3",
            narrationText: "[All friends: Time mile to kabhi chud lena miss u ❤️]"
        },
        {
            id: "sticker8",
            category: "ANCIENT WISDOM",
            description: "Philosophical poetry analyzing the human condition and nearby company.",
            image: "assets/stickers/few/rhxVD0yVIzj1BdpCzrtK4yWa0MlNR5aB6K-PaMc8E5A=.webp",
            audioPath: "assets/audio/placeholder_sticker2.mp3",
            narrationText: "[Friend 1 voice: Kahat kabir sansar mai bhati-bhati ke log...]"
        },
        {
            id: "sticker9",
            category: "DAILY DISCIPLINE",
            description: "A balanced timetable of wholesome nutrition followed by midnight violence.",
            image: "assets/stickers/few/uVygro9KhvG07wB9mzW4HJeHRcCBfwJgGWfYOhOwDJk=.webp",
            audioPath: "assets/audio/placeholder_sticker1.mp3",
            narrationText: "[Friend 2 voice: Din mai Salt, Raat mai Assault]"
        },
        {
            id: "sticker10",
            category: "CONVERSATION ENDER",
            description: "The nuclear option when an argument needs to stop immediately.",
            image: "assets/stickers/few/EiIwCtan+dThbPcFig2e52wnhONE5YldzI9dvrqyd3I=.webp",
            audioPath: "assets/audio/placeholder_sticker2.mp3",
            narrationText: "[Friend 3 voice: Kam bol Fati hui chaddi]"
        },
        {
            id: "sticker11",
            category: "PUBLIC WARNING",
            description: "Crucial intelligence advisory warning against highly suspicious individuals.",
            image: "assets/stickers/few/zc1okEC1msiA-HwqyHcS7St8uHZugV5A5EpL7REmVFc=.webp",
            audioPath: "assets/audio/placeholder_sticker1.mp3",
            narrationText: "[Friend 4 voice: This person right here... do not trust this guy at all]"
        }
    ],
    allStickers: [
        "assets/stickers/All/+eebENyzF5UXtY7SsrC4RRnl8nEX35DzXT7PHJiRRws=.webp",
        "assets/stickers/All/+jDu1DK0T1-LNFVi5APClnY5wq6JBl-ZlfDF0e5woBA=.webp",
        "assets/stickers/All/-8ryZm9m2RySsEM3HMEclM7ZdNiA9Bv6zjXe1AifcKM=.webp",
        "assets/stickers/All/2FQeUORNmtwRqTR-Dn9Zxqg+WETzmGJ85uVbPGf2Q8M=.webp",
        "assets/stickers/All/3yeOU6T0rT0cFaXJi+YjKztQQIt-N05rRUhPX94VfWQ=.webp",
        "assets/stickers/All/4qGcs-8adRcENYAoLUY3HT+0owby7LgAP+qorotxYUk=.webp",
        "assets/stickers/All/5KB78fMCg0WgT16V7nGjwp17UeEgjjmcYo38kGiKT3o=.webp",
        "assets/stickers/All/5R1RZoomr2zo1HiU85DM-rEX9z6OEHl3V743QXLZ3Og=.webp",
        "assets/stickers/All/709e31b3-c8c1-4041-979a-2d33edb80696.png",
        "assets/stickers/All/9XMsdBmHlhbro1F8rQyuh0NfUq9m83UPcgk79FJbgd8=.webp",
        "assets/stickers/All/Bd5SG76ZkEKIPh9i5aQgcroKqVWPxLFXoWWI-TbIVG0=.webp",
        "assets/stickers/All/CG9jkYw0jI-K59EDSPZopVbf8aZLIWNypxARKe4v6wQ=.webp",
        "assets/stickers/All/DYYDkhLz4MsfIVjAbnG2VfsueNutYlEjg6mF5ncfevQ=.webp",
        "assets/stickers/All/Dla9sp4D897MYYAww+oM1srDYy-0Ites8iYvOBHOzhQ=.webp",
        "assets/stickers/All/EiIwCtan+dThbPcFig2e52wnhONE5YldzI9dvrqyd3I=.webp",
        "assets/stickers/All/FRrNa0uZO7nE+Vd6xfSP+y3v8L-P7PztL-ghtTzMQQk=.webp",
        "assets/stickers/All/Ixcm30InNAmpXBjH2yKZp1WHYgsnCztWotUjcVKU6xM=.webp",
        "assets/stickers/All/J0II8W9wqPYH-HBGLvsulW-JyOxAKpicLa-NHFhO+e4=.webp",
        "assets/stickers/All/KWXmL72VxRlSp6Vm-EjLsgA-mIgN9aSfH4WewQRGiA4=.webp",
        "assets/stickers/All/LJOs3eAwqDSAZaY+QgnO-bQZtXtK8aIXFu68FnaYTJ8=.webp",
        "assets/stickers/All/MLH2OpkjD123FeMyQP0oLUuS5OI3Gzr9N8uiQy7Qal0=.webp",
        "assets/stickers/All/NPBeP2aw6FxMxNWhamJqzJ6cBPLyeGr-sLmBuMqjc+E=.webp",
        "assets/stickers/All/NVgWGDnZUsDOljNqgXLFII8hLjCH8nEUyviA7RxibCo=.webp",
        "assets/stickers/All/OMXZYlhZzGd6hjCxS8h466m9iw5toAH11S25qpM1vxs=.webp",
        "assets/stickers/All/PhgaKqnWv+CLvm7exAhNBNsMcOLOEVrkss9VLV4Pda8=.webp",
        "assets/stickers/All/RMLqu7xDEXTw0sfpl6PXDaCcC7A5Cz+Cb5VgxZBNwkM=.webp",
        "assets/stickers/All/RUvm3sAy6ulR+xjfxrgSIfpxiOzJwYnpzQHs9f9s7vI=.webp",
        "assets/stickers/All/Ry-NBmHXZ86C4Top02IwxqsdTZw0z2PfsehI6PxJFgs=.webp",
        "assets/stickers/All/SnsC561VufnDBSPhsVIZwSNq6tFchf9hJe+hVkHnlcs=.webp",
        "assets/stickers/All/TlBgC0s+z08eKqllJJE-sUrmiBBaYSDq2KFVP31UdOo=.webp",
        "assets/stickers/All/U+QaE4tNvVFp1ayvV3W2FPH2De-+B9a0UIpt0Q2PZVU=.webp",
        "assets/stickers/All/UBfc-04ZU5EvW7tn6rCCWWTuCKWvivQSTY+ROh4a3M4=.webp",
        "assets/stickers/All/UyyaBCkY9D3vLTf3CFSN0TLVLDQdAYYTPaPzKwnA7cc=.webp",
        "assets/stickers/All/V8sCP69qukcRe1yz0cd-Y7-cdBIJsutggQHHhWs97EY=.webp",
        "assets/stickers/All/VDk+hbJiXDHpdafBlnNl4lahaHwpnCycE75QKw1MclI=.webp",
        "assets/stickers/All/WBTlDhNGFRCG8qR-uhrpGUfUhdnqsAkDC8HBKHoI5lw=.webp",
        "assets/stickers/All/XRnfiK5p2BG3xLYiyasiUo1ukQnQfb-isiRcoRoI63I=.webp",
        "assets/stickers/All/XmwVlpOL3WSvmcqvZp-YFF3ex-FLys5GAI6DN45j-eA=.webp",
        "assets/stickers/All/YRdREAGnsIO8DnHTBz6Ga-ysjX4BpI3ag+0kVZBr038=.webp",
        "assets/stickers/All/ZPWyVPqfNkYSnr4zEI+Wkbkw9n5ZWl7rqnVmmNJPisE=.webp",
        "assets/stickers/All/a8M6neXtlyPdmi8G97Zyc0c15+qdqwCqhispUVQC9uA=.webp",
        "assets/stickers/All/aWW8iywKAsGGrC5ZkRg72Aak2CKUS54Sxp51-atxeGM=.webp",
        "assets/stickers/All/d5c2LR8dbAZeJvUbd55YELjMj0Kkqo-amMXIJci71CM=.webp",
        "assets/stickers/All/dYR6V5ui5WOEDe5CNA1osmlD7S9rT2Dq+-jtR9uX9+U=.webp",
        "assets/stickers/All/dggKVaJprjr1o5OSKWPl1F8FCU93X1bZcgUhUoaJbrg=.webp",
        "assets/stickers/All/eMfTt5aBwdv7TFdHRbAmAvzGn75lIXVXUOy9u1b-IAw=.webp",
        "assets/stickers/All/fcc4c949-1ede-4df4-91f2-e04d718a1b5f.png",
        "assets/stickers/All/hL24CFLCQhp7oXgUz-Z5qtmIQIrhNUth3eEXq7z9ehg=.webp",
        "assets/stickers/All/jNyWAcGs0zgHhsmPYEqnlUTKlGBxEqFEM6hwVoj9xLI=.webp",
        "assets/stickers/All/lMyYUX80cbU3g80yako5cP6KPuKsXEZeMJrQvINqiR0=.webp",
        "assets/stickers/All/lQ-vZBgnxesDBkv9lkRRaBxqF6j85KCwzH26psr2MPE=.webp",
        "assets/stickers/All/n9x0SFGZMc3BXHac-EcC7bc67H+nYfREYufo3OinwOs=.webp",
        "assets/stickers/All/ociBdWiDsfduMcYQCMEysoXl+A-Kxb-3E+5mdLOHbsg=.webp",
        "assets/stickers/All/ppseJrsRcyC19lL6VWNWN4KRLeNfyuP+zj8zpjqe8Mg=.webp",
        "assets/stickers/All/qZ+v1QDD6LpL1HfkZJDi6R8S7+eISgFhKlAqF4XhOnk=.webp",
        "assets/stickers/All/qv-jb+r1KRDfvm8Ioyd+bo1WQEySgCWbSdzGnV+zOxA=.webp",
        "assets/stickers/All/rhxVD0yVIzj1BdpCzrtK4yWa0MlNR5aB6K-PaMc8E5A=.webp",
        "assets/stickers/All/rl7UaPzK8PWSx+FJMbMZNqIvePhGPjEkvpN0pT+dJkM=.webp",
        "assets/stickers/All/tBdDaU97T5xgLo+Pn81sMniAanhcZ9mxZg4mNwGwJFM=.webp",
        "assets/stickers/All/tyvbXKsypl+sL6DHUZW1CJ3e2gf1vSme4yFCUmHrOaM=.webp",
        "assets/stickers/All/uVygro9KhvG07wB9mzW4HJeHRcCBfwJgGWfYOhOwDJk=.webp",
        "assets/stickers/All/wWVmM-lmVy89A-fIzdJJEZWPNXL3VgCTJOfgOB7fgps=.webp",
        "assets/stickers/All/xEpImU6elfWZEGZGOc6QwdIO6kq1C9Db89bWK7Z9-O8=.webp",
        "assets/stickers/All/xQMOx20o35E5+nfrPSKQGzz5XCynOyWYirtVpmQ1-mc=.webp",
        "assets/stickers/All/xoonsPnfYHWPdAq3CBfNHz9b+ZwHHpyP23XbuW8aw+M=.webp",
        "assets/stickers/All/yR78nLUEdl6f9s0bDci5I7r+hNO7+vDtVmNKB8V-FQI=.webp",
        "assets/stickers/All/yS1BpOvxKcF7dzaNrwdskSUVVkb0hv9tQtraziBHsp0=.webp",
        "assets/stickers/All/zc1okEC1msiA-HwqyHcS7St8uHZugV5A5EpL7REmVFc=.webp",
        "assets/stickers/All/zmMnadx6WEg5B6wBU6FFrn5mXqCskzSlpfWt7E2x2kw=.webp"
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
            "I know things haven't always been easy lately, especially with all the exams and everything that's been going on."
        ],
        audioFiles: [
            "assets/audio/Video Project 9.m4a"
        ]
    },
    LAST1sLore: [
        "LAST1s was formed",
        "[Questionable decisions were made]",
        "LAST1s Standing",
        "LAST1s Consolation",
        "[More questionable decisions]",
        "Ananya became an important part of the story",
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
        title: "HAPPY BIRTHDAY, ANANYA",
        audioFiles: [
            "assets/audio/placeholder_bday1.mp3",
            "assets/audio/placeholder_bday2.mp3"
        ]
    }
};

export default CONFIG;
