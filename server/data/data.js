const points = [
    {
        _id: "tt0133093",
        title: "The Matrix",
        type: "film",
        coverImgSrc: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
        year: "1999", 
        by: "Lana Wachowski, Lilly Wachowski",
        country: "US",
        description: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
        link: "https://www.imdb.com/title/tt0133093", 
        mentionedIn: []
    }, 
    {
        _id: "tt18072646", 
        title: "Mirror",
        type: "film",
        coverImgSrc: 'https://imdb-api.com/images/original/MV5BOGRiNDc0ZmMtZWVmNS00ZmRkLWEwNjQtODdmYTIyZGJjMjc5XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_Ratio0.7273_AL_.jpg',
        year: "1975", 
        by: "Andrei Tarkovsky",
        country: "Soviet Union",
        description: "A dying man in his forties remembers his past. His childhood, his mother, the war, personal moments and things that tell of the recent history of all the Russian nation.",
        link: "https://www.imdb.com/title/tt18072646", 
        mentionedIn: ["0000000001"]
    },
    {
        _id: "9780292776241", 
        title: "Sculpting in Time",
        type: "book",
        coverImgSrc: "http://books.google.com/books/content?id=u-HRWkL6vnAC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
        year: "1989", 
        by: "Andrei Tarkovsky",
        country: "Soviet Union",
        description: "A director reveals the original inspirations for his films, their history, his methods of work, and the problems of visual creativity",
        link: "http://books.google.ca/books?id=u-HRWkL6vnAC&dq=sculpting+in+time&hl=&source=gbs_api", 
        mentionedIn: []
    }

];

//each tangent is a collection
//each message is a document
//collection name = randomID

const tangent1 = [   
    {
        _id: "1",
        tangentName: "dilation of time",
        usersInTangent: ["u0000000001"],
        tangentPoints: [], 
        tangentLength: 1,
        userId: "u0000000001", 
        timestamp:  "04/11/2022 16:56",
        text: "I don't know about y'all, but this weather has got me thinking about the nature of time...been watching a lot of Tarkovsky lately"
    }, 
    {
        _id: "m0000000002",
        tangentName: "dilation of time",
        usersInTangent: ["u0000000001"],
        tangentPoints: ["tt18072646"], 
        tangentLength: 2,
        uid: "u0000000001", 
        timestamp: "04/11/2022 16:59",
        pointId: "tt18072646", 
    },
    {
        _id: "m0000000003",
        tangentName: "dilation of time",
        usersInTangent: ["u0000000001"],
        tangentPoints: ["tt18072646"], 
        tangentLength: 3,
        uid: "u0000000001", 
        timestamp:  "04/11/2022 17:01",
        text: "Rewatched this one recently."
    }, 
    {
        _id: "m0000000004",
        tangentName: "dilation of time",
        usersInTangent: ["u0000000001", "u0000000002"],
        tangentPoints: ["tt18072646"], 
        tangentLength: 4,
        uid: "u0000000002",
        timestamp:  "04/11/2022 17:01",
        text: "Ya, the pacing of his films really distorts one's sense of time...not unlike 2 years (3 years??) of a global pandemic!"
    }, 
]


const users = [
    {
        _id: "u0000000001",
        username: "laszlo",
        name: "Laszlo H",
        email: "laszlo@gmail.com",
        avatar: null,
        tagline: "I am a cloud.",
        tangents: [ "tangent1" ],
        points: [ "tt0133093" ],
        circle: [ "u0000000002" ]
    },
    {
        _id: "u0000000002",
        username: "bessa",
        name: "Bessa Y",
        email: "bessa@gmail.com",
        avatar: null,
        tagline: "Always falling for Fellini.",
        tangents: [ "tangent1" ],
        points: [ "9780292776241" ],
        circle: [ "u0000000001" ]
    }
];