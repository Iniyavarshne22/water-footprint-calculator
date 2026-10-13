
const waterForm = document.getElementById("waterForm");

const fields = {
    showers: document.getElementById("showers"),
    minutes: document.getElementById("minutes"),
    flushes: document.getElementById("flushes"),
    laundry: document.getElementById("laundry"),
    dishes: document.getElementById("dishes")
};

function getNumber(input) {
    return Number(input.value);
}

function formatLitres(value) {
    return value.toLocaleString("en-IN", {
        maximumFractionDigits: 1,
        minimumFractionDigits: 1
    });
}

function updateText(id, value) {
    document.getElementById(id).textContent = value;
}

function updateBar(id, value, total) {
    const percentage = total > 0 ? (value / total) * 100 : 0;

    document.getElementById(id).style.width =
        `${Math.min(percentage, 100)}%`;
}

function calculateWater(event) {
    if (event) {
        event.preventDefault();
    }

    // Validate all form values.
    for (const input of Object.values(fields)) {
        const value = getNumber(input);
        const max = Number(input.max);

        if (
            input.value.trim() === "" ||
            !Number.isFinite(value) ||
            value < 0 ||
            value > max
        ) {
            alert("Please enter valid values within the allowed ranges.");
            input.focus();
            return;
        }
    }

    // Example assumptions: 9 L/min shower flow,
    // 6 L per toilet flush and 60 L per laundry load.
    const showerWater =
        getNumber(fields.showers) *
        getNumber(fields.minutes) * 9;

    const toiletWater =
        getNumber(fields.flushes) * 6;

    const laundryWater =
        getNumber(fields.laundry) * 60 / 7;

    const dishesWater =
        getNumber(fields.dishes);

    const total =
        showerWater +
        toiletWater +
        laundryWater +
        dishesWater;

    const weekly = total * 7;
    const monthly = total * 30;

    // Update summary figures.
    updateText("dailyTotal", formatLitres(total));
    updateText("weeklyTotal", `${formatLitres(weekly)} L`);
    updateText("monthlyTotal", `${formatLitres(monthly)} L`);

    // Update category figures.
    updateText("showerResult", `${formatLitres(showerWater)} L`);
    updateText("toiletResult", `${formatLitres(toiletWater)} L`);
    updateText("laundryResult", `${formatLitres(laundryWater)} L`);
    updateText("dishesResult", `${formatLitres(dishesWater)} L`);

    // Update the visual breakdown.
    updateBar("showerBar", showerWater, total);
    updateBar("toiletBar", toiletWater, total);
    updateBar("laundryBar", laundryWater, total);
    updateBar("dishesBar", dishesWater, total);
}

// Calculate when the form is submitted.
waterForm.addEventListener("submit", calculateWater);

// Reset the form and restore the default results.
waterForm.addEventListener("reset", function () {
    setTimeout(calculateWater, 0);
});

// Show correct results immediately on page load.
calculateWater();
