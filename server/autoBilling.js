import Client from "../server/models/Client.js"
import Vehicle from "../server/models/Vehicle.js"
export const runAutoBilling = async () => {
    const now = new Date();
    const vehicles = await Vehicle.find({ subscriptionType: "monthly" }).populate("client");
    // console.log("Found vehicles:", vehicles.length);

    for (const vehicle of vehicles) {
        const { client, subscriptionAmount, subscriptionEndDate } = vehicle;
        // console.log(`Checking vehicle ${vehicle.licensePlate}`);
        // console.log(`  End date: ${vehicle.subscriptionEndDate}`);
        // console.log(`  Now: ${now}`);
        if (!client) continue;
        if (vehicle.subscriptionType !== 'monthly') {
            console.log(`[SKIP] Vehicle ${vehicle.licensePlate} is not monthly`);
            continue;
        }

        const shouldCharge =
            !vehicle.subscriptionEndDate || new Date(vehicle.subscriptionEndDate) <= now;
        // console.log(`  Should charge? ${shouldCharge}`);
        if (shouldCharge) {

            const chargeAmount = subscriptionAmount || 30;
            client.balance -= chargeAmount;


            if (client.balance < 0) {
                client.status = "overdue";
            } else {
                client.status = "active";
            }
            vehicle.washHistory.push({
                date: now,
                service: 'Monthly Subscription Billing',
                price: chargeAmount
            });

            vehicle.subscriptionStartDate = now;
            const nextMonth = new Date(now);
            nextMonth.setMonth(now.getMonth() + 1);
            vehicle.subscriptionEndDate = nextMonth;

            await client.save();
            await vehicle.save();

            // console.log(`[BILLING] Charged $${subscriptionAmount} for ${client.firstName} | New Balance: $${client.balance}`);
        }
    }
};