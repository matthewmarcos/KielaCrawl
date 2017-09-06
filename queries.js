const searchStrings = [
    'How to download nintendo DS games',
];

const querify = (queries) => {
    return queries.map(entry => entry.replace(/\+/g, '%2B').replace(/ /g, '+'));
};

export default searchStrings;
