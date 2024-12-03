let i = 0;
let offset = 0.5;
let smaller = 0.3;
export const notesData = [
    { type: "quarter", startTime: i++, stringIndex: 2 },
    { type: "eight", startTime: i++, stringIndex: 1 },
    { type: "cloud", startTime: i - 1 + offset, stringIndex: 1},
    { type: "quarter", startTime: i++, stringIndex: 0 },
    { type: "quarter", startTime: i++, stringIndex: 2 },
    { type: "cloud", startTime: i - 1 + smaller, stringIndex: 3 }, 
    { type: "eight", startTime: i++, stringIndex: 4 },
    { type: "eight", startTime: i++, stringIndex: 1 },
    { type: "quarter", startTime: i++, stringIndex: 2 },
    { type: "cloud", startTime: i - 1 + offset, stringIndex: 0 }, 
    { type: "quarter", startTime:  i++, stringIndex: 1 },    
    { type: "eight", startTime:  i++, stringIndex: 0 },  
    { type: "quarter", startTime: i++, stringIndex: 2 },
    { type: "cloud", startTime: i - 1 + smaller, stringIndex: 2},
    { type: "quarter", startTime:  i++, stringIndex: 3},
    { type: "eight", startTime:  i++, stringIndex: 4 },
    { type: "quarter", startTime:  i++, stringIndex: 1 },
    { type: "cloud", startTime: i - 1 + offset, stringIndex: 3},
    { type: "eight", startTime:  i++, stringIndex: 2 },
    { type: "cloud", startTime: i, stringIndex: 3},
    { type: "cloud", startTime: i, stringIndex: 0},
    { type: "quarter", startTime:  i++, stringIndex: 4 },
    { type: "eight", startTime:  i++, stringIndex: 2 },
    { type: "cloud", startTime:  i-1+offset, stringIndex: 4 },
    { type: "eight", startTime:  i++, stringIndex: 3 },
    { type: "cloud", startTime:  i++, stringIndex: 3},
    { type: "quarter", startTime:  i++, stringIndex: 3},

    { type: "quarter", startTime: i++, stringIndex: 2 },
    { type: "eight", startTime: i++, stringIndex: 1 },
    { type: "cloud", startTime: i - 1 + offset, stringIndex: 1},
    { type: "quarter", startTime: i++, stringIndex: 0 },
    { type: "quarter", startTime: i++, stringIndex: 2 },
    { type: "cloud", startTime: i - 1 + smaller, stringIndex: 3 }, 
    { type: "eight", startTime: i++, stringIndex: 4 },
    { type: "eight", startTime: i++, stringIndex: 1 },
    { type: "quarter", startTime: i++, stringIndex: 2 },
    { type: "cloud", startTime: i - 1 + offset, stringIndex: 0 }, 
    { type: "quarter", startTime:  i++, stringIndex: 1 },    
    { type: "eight", startTime:  i++, stringIndex: 0 },  
    { type: "quarter", startTime: i++, stringIndex: 2 },
    { type: "cloud", startTime: i - 1 + smaller, stringIndex: 2},
    { type: "quarter", startTime:  i++, stringIndex: 3},
    { type: "eight", startTime:  i++, stringIndex: 4 },
    { type: "quarter", startTime:  i++, stringIndex: 1 },
    { type: "cloud", startTime: i - 1 + offset, stringIndex: 3},
    { type: "eight", startTime:  i++, stringIndex: 2 },
    { type: "cloud", startTime: i, stringIndex: 3},
    { type: "cloud", startTime: i, stringIndex: 0},
    { type: "quarter", startTime:  i++, stringIndex: 4 },
    { type: "eight", startTime:  i++, stringIndex: 2 },
    { type: "cloud", startTime:  i-1+offset, stringIndex: 4 },
    { type: "eight", startTime:  i++, stringIndex: 3 },
    { type: "cloud", startTime:  i++, stringIndex: 3},
    { type: "quarter", startTime:  i++, stringIndex: 3},
    { type: "quarter", startTime: i++, stringIndex: 2 },
    { type: "eight", startTime: i++, stringIndex: 1 },
    { type: "cloud", startTime: i - 1 + offset, stringIndex: 1},
    { type: "quarter", startTime: i++, stringIndex: 0 },
    { type: "quarter", startTime: i++, stringIndex: 2 },
    { type: "cloud", startTime: i - 1 + smaller, stringIndex: 3 }, 
    { type: "eight", startTime: i++, stringIndex: 4 },
    { type: "eight", startTime: i++, stringIndex: 1 },
    { type: "quarter", startTime: i++, stringIndex: 2 },
    { type: "cloud", startTime: i - 1 + offset, stringIndex: 0 }, 
    { type: "quarter", startTime:  i++, stringIndex: 1 },    
    { type: "eight", startTime:  i++, stringIndex: 0 },  
    { type: "quarter", startTime: i++, stringIndex: 2 },
    { type: "cloud", startTime: i - 1 + smaller, stringIndex: 2},
    { type: "quarter", startTime:  i++, stringIndex: 3},
    { type: "eight", startTime:  i++, stringIndex: 4 },
    { type: "quarter", startTime:  i++, stringIndex: 1 },
    { type: "cloud", startTime: i - 1 + offset, stringIndex: 3},
    { type: "eight", startTime:  i++, stringIndex: 2 },
    { type: "cloud", startTime: i, stringIndex: 3},
    { type: "cloud", startTime: i, stringIndex: 0},
    { type: "quarter", startTime:  i++, stringIndex: 4 },
    { type: "eight", startTime:  i++, stringIndex: 2 },
    { type: "cloud", startTime:  i-1+offset, stringIndex: 4 },
    { type: "eight", startTime:  i++, stringIndex: 3 },
    { type: "cloud", startTime:  i++, stringIndex: 3},
    { type: "quarter", startTime:  i++, stringIndex: 3},
    { type: "quarter", startTime: i++, stringIndex: 2 },
    { type: "eight", startTime: i++, stringIndex: 1 },
    { type: "cloud", startTime: i - 1 + offset, stringIndex: 1},
    { type: "quarter", startTime: i++, stringIndex: 0 },
    { type: "quarter", startTime: i++, stringIndex: 2 },
    { type: "cloud", startTime: i - 1 + smaller, stringIndex: 3 }, 
    { type: "eight", startTime: i++, stringIndex: 4 },
    { type: "eight", startTime: i++, stringIndex: 1 },
    { type: "quarter", startTime: i++, stringIndex: 2 },
    { type: "cloud", startTime: i - 1 + offset, stringIndex: 0 }, 
    { type: "quarter", startTime:  i++, stringIndex: 1 },    
    { type: "eight", startTime:  i++, stringIndex: 0 },  
    { type: "quarter", startTime: i++, stringIndex: 2 },
    { type: "cloud", startTime: i - 1 + smaller, stringIndex: 2},
    { type: "quarter", startTime:  i++, stringIndex: 3},
    { type: "eight", startTime:  i++, stringIndex: 4 },
    { type: "quarter", startTime:  i++, stringIndex: 1 },
    { type: "cloud", startTime: i - 1 + offset, stringIndex: 3},
    { type: "eight", startTime:  i++, stringIndex: 2 },
    { type: "cloud", startTime: i, stringIndex: 3},
    { type: "cloud", startTime: i, stringIndex: 0},
    { type: "quarter", startTime:  i++, stringIndex: 4 },
    { type: "eight", startTime:  i++, stringIndex: 2 },
    { type: "cloud", startTime:  i-1+offset, stringIndex: 4 },
    { type: "eight", startTime:  i++, stringIndex: 3 },
    { type: "cloud", startTime:  i++, stringIndex: 3},
    { type: "quarter", startTime:  i++, stringIndex: 3},
];


//120bpm, new beat every 0.5 seconds
//if speed of notes is 6 units/second then 
//it takes 3 seconds for a note to hit character
//so it has to appear 3 secs before the beat
//{ type: "cloud", startTime: 8, stringIndex: 4 },