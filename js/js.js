let greenPointsTotal = 0;
let greenPointsLastWeek = 0;
const MAX_POINTS = 1500;
const REWARD_1 = 500;
const REWARD_2 = 1000;
const REWARD_3 = 1500;

fetch('json/greenPoints.json')
    .then(response => response.json())
    .then(data => {
        const today = new Date();
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);

        const tbody = document.getElementById("data-from-json");

        data.forEach(item => {
            greenPointsTotal += item.points;

            const d = new Date(item.dateOfActivity);

            if (d >= weekAgo && d <= today) {
                greenPointsLastWeek += item.points;

                const tr = document.createElement("tr");
                tr.innerHTML =
                    "<td>" + item.citizenId + "</td>" +
                    "<td>" + item.activity + "</td>" +
                    "<td>" + item.points + "</td>";
                tbody.appendChild(tr);
            }
        });

        updateProgress(greenPointsTotal);
        updateLastWeek(greenPointsLastWeek);
        updateNextReward(greenPointsTotal);

        const weekNumberElem = document.getElementById('weekNumber');
        const weekRangeElem = document.getElementById('weekRange');

        const weekNumber = getWeekNumber(today);
        weekNumberElem.textContent = 'Week ' + weekNumber;

        weekRangeElem.textContent =
            formatDate(weekAgo) + ' to ' + formatDate(today);
    });


//Tasks:

fetch('json/tasks.json')
    .then(response => response.json())
    .then(data => {
        const taskGrid = document.getElementById("tasks-grid");

        data.forEach(item => {
            const div = document.createElement("div");
            div.className = "task";
            div.innerHTML =
                '<img src="taskSymbol.png" alt="Tasks symbol" class="task-icon">' +
                '<p>' +
                item.goodsToOffer + '<br>' +
                'Owner: ' + item.fullName + '<br>' +
                item.price + ' Points' +
                '</p>';

            taskGrid.appendChild(div);
        })


    })


//Green Points Functions!
function updateProgress(points) {
    const percent = Math.min(points / MAX_POINTS * 100, 100); // max 100 %

    const fill = document.getElementById('progressFill');
    const pointsText = document.getElementById('pointsText');

    fill.style.width = percent + '%';
    pointsText.textContent = 'Total Points: ' + points;
}

function updateLastWeek(points) {
    const lastWeekInfo = document.getElementById("lastWeekInfo");
    lastWeekInfo.textContent = 'Points last 7 days: ' + points;
}

function getWeekNumber(date) {
    // January 1st of the same year
    const firstJan = new Date(date.getFullYear(), 0, 1);
    const diff = date - firstJan;

    const oneDay = 1000 * 60 * 60 * 24;

    // Day of the year (1–366)
    const dayNumber = Math.floor(diff / oneDay) + 1;
    return Math.ceil(dayNumber / 7);                  
}


function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0–11 in JavaScript

    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(month).padStart(2, '0');

    return dayStr + "." + monthStr;
}

function updateNextReward(points) {
    const nextRewardText = document.getElementById("nextReward");
    const nextRewardInPercentages = document.getElementById("nextRewardInPercentages");

    let targetPoints = 0;

    if (points < REWARD_1) {
        targetPoints = REWARD_1;
        nextRewardText.textContent = `Next reward: pizza party at ${REWARD_1} points.`;
    } else if (points < REWARD_2) {
        targetPoints = REWARD_2;
        nextRewardText.textContent = `Next reward: outdoor movie night at ${REWARD_2} points.`;
    } else if (points < REWARD_3) {
        targetPoints = REWARD_3;
        nextRewardText.textContent = `Next reward: wellness day at ${REWARD_3} points.`;
    } else {
        nextRewardText.textContent = "All rewards unlocked!";
        nextRewardInPercentages.textContent = "";
        return;
    }

    const percent = Math.min(Math.round((points / targetPoints) * 100), 100);
    nextRewardInPercentages.textContent =
        `${percent} percent of the way to the next reward.`;
}