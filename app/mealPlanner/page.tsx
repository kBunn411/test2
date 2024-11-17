'use client';
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Calendar from "react-calendar";

export default function MealPlanner() {
    const { user } = useUser();
    const userId = user?.id;

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [mealPlans, setMealPlans] = useState([]);

    useEffect(() => {
        const fetchMealPlans = async () => {
            if (!userId) return;

            try {
                const response = await fetch(`/api/mealPlans?userId=${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setMealPlans(data);
                } else {
                    console.error("Failed to fetch meal plans.");
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchMealPlans();
    }, [userId]);

    const getMealsForDate = (date) => {
        return mealPlans.filter(
            (meal) => new Date(meal.date).toISOString().split("T")[0] === date.toISOString().split("T")[0]
        );
    };

    return (
        <div>
            <h1>Meal Planner</h1>
            <Calendar value={selectedDate} onChange={setSelectedDate} />
            <h2>Meals for {selectedDate.toDateString()}</h2>
            <ul>
                {getMealsForDate(selectedDate).map((meal, index) => (
                    <li key={index}>{meal.recipeName}</li>
                ))}
            </ul>
        </div>
    );
}
