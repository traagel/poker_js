const HAND_RANKING_MAP = {
    highCard: 0,
    onePair: 1, //counts
    twoPair: 2, //counts
    threeOfAKind: 3, //counts
    straight: 4,
    flush: 5,
    fullHouse: 6, //counts
    fourOfAKind: 7,
    straightFlush: 8,
    royalFlush: 9,
};

let conditionsFulfilled = {
    highCard: false,
    onePair: false, //done
    twoPair: false, //done
    threeOfAKind: false, //done
    straight: false, //done
    flush: false, //done
    fullHouse: false, //done
    fourOfAKind: false, //done
    straightFlush: false, //TODO
    royalFlush: false, //TODO
};

export function winConditions(dealerHand, playerHand) {
    const cards = dealerHand.concat(playerHand);
    const result = countCards(cards);

    checkConditionsFulfilled(result);
    checkFlush(cards);
    checkStraight(cards);
    console.log(conditionsFulfilled);
    resetConditionsFulfilled();
}

Object.filter = (
    obj,
    predicate // thank u god
) =>
    Object.keys(obj)
        .filter((key) => predicate(obj[key]))
        .reduce((res, key) => ((res[key] = obj[key]), res), {});

function countCards(cards) {
    const card_values = [];
    for (const card of cards) {
        card_values.push(card.value);
    }
    const counts = {};
    for (const value of card_values) {
        counts[value] ? (counts[value] += 1) : (counts[value] = 1);
    }

    return Object.filter(counts, (count) => count > 1);
}

function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
}

function checkConditionsFulfilled(obj) {
    let length = Object.keys(obj).length;

    //one pair
    if (length > 0) {
        conditionsFulfilled.onePair = true;
    }
    //two pairs
    if (length > 1) {
        conditionsFulfilled.twoPair = true;
    }
    //three of a kind
    if (length > 0 && Object.values(obj).includes(3)) {
        conditionsFulfilled.threeOfAKind = true;
    }
    //four of a kind
    if (length > 0 && Object.values(obj).includes(4)) {
        conditionsFulfilled.fourOfAKind = true;
    }
    //full house
    if (length > 1 && Object.values(obj).includes(3)) {
        console.log(Object.values(obj));
        conditionsFulfilled.fullHouse = true;
    }
}

function resetConditionsFulfilled() {
    conditionsFulfilled = {
        highCard: false,
        onePair: false, //counts
        twoPair: false, //counts
        threeOfAKind: false, //counts
        straight: false,
        flush: false,
        fullHouse: false, //counts
        fourOfAKind: false, //counts
        straightFlush: false,
        royalFlush: false,
    };
}

function checkFlush(cards) {
    const suits = [];
    for (const card of cards) {
        suits.push(card.getSuit());
    }

    const counts = {};
    for (const value of suits) {
        counts[value] ? (counts[value] += 1) : (counts[value] = 1);
    }
    // return counts;

    if (Object.keys(Object.filter(counts, (count) => count > 4)).length > 0) {
        conditionsFulfilled.flush = true;
        return true;
    } else {
        return false;
    }
}

function mapValues(cards) {
    const values = [];
    for (const card of cards) {
        const value = card.getValue();
        if (value === 'A') {
            values.push(14);
        } else if (value === 'K') {
            values.push(13);
        } else if (value === 'Q') {
            values.push(12);
        } else if (value === 'J') {
            values.push(11);
        } else {
            values.push(parseInt(value));
        }
    }
    values.sort(function (a, b) {
        return a - b;
    });
    return values;
}

function checkStraight(cards) {
    const values = mapValues(cards);
    for (const value of values) {
        let arr = [value, value + 1, value + 2, value + 3, value + 4];
        let isStraight = arr.every((element) => {
            return values.includes(element);
        });
        if (isStraight) {
            conditionsFulfilled.straight = true;
        }
    }
}

//one pair

// high card
// one pair
// two pairs
// threeofakind
// straight
// flush
// fullhouse
// four of a kind
// straight flush
// royal flush
