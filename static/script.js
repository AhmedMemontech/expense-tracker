const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const total = document.getElementById("total");
const message = document.getElementById("message");
const healthButton = document.getElementById("healthButton");
const healthStatus = document.getElementById("healthStatus");


// Load expenses from the Flask backend
async function loadExpenses() {
    try {
        const response = await fetch("/items");
        const expenses = await response.json();

        expenseList.innerHTML = "";

        if (expenses.length === 0) {
            expenseList.innerHTML =
                '<p class="empty">No expenses added yet.</p>';
        } else {
            expenses.forEach(expense => {
                const item = document.createElement("div");
                item.className = "expense-item";

                item.innerHTML = `
                    <span class="expense-name">${expense.name}</span>
                    <span class="expense-amount">₹${expense.amount}</span>
                `;

                expenseList.appendChild(item);
            });
        }

        const totalAmount = expenses.reduce(
            (sum, expense) => sum + Number(expense.amount),
            0
        );

        total.textContent = `Total: ₹${totalAmount.toFixed(2)}`;

    } catch (error) {
        expenseList.innerHTML =
            '<p class="empty">Unable to load expenses.</p>';
    }
}


// Add a new expense
expenseForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const amount = document.getElementById("amount").value;

    try {
        const response = await fetch("/items", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                amount: amount
            })
        });

        const data = await response.json();

        if (response.ok) {
            message.textContent = "Expense added successfully.";
            expenseForm.reset();
            loadExpenses();
        } else {
            message.textContent = data.error || "Failed to add expense.";
        }

    } catch (error) {
        message.textContent = "Unable to connect to the backend.";
    }
});


// Check Flask backend health
healthButton.addEventListener("click", async function() {
    try {
        const response = await fetch("/health");
        const data = await response.json();

        if (response.ok) {
            healthStatus.textContent =
                `Backend Status: ${data.status}`;
        } else {
            healthStatus.textContent = "Backend check failed.";
        }

    } catch (error) {
        healthStatus.textContent =
            "Backend is not reachable.";
    }
});


// Load expenses when page opens
loadExpenses();