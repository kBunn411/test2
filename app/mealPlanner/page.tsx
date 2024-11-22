'use client';
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import RecipeCard from "@/components/RecipeCard";
import styles from "./mealPlanner.module.css"; // Your custom styles


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

    const getMealsForDate = (date: Date) => {
        return mealPlans.filter(
            (meal) => new Date(meal.date).toISOString().split("T")[0] === date.toISOString().split("T")[0]
        );
    };

    return (
        <div>
            <h1>Meal Planner</h1>
            <Calendar value={selectedDate} onChange={setSelectedDate} className={styles.customCalendar}/>
            <h2>Meals for {selectedDate.toDateString()}</h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "20px",
                    justifyContent: "center",
                }}>
                {getMealsForDate(selectedDate).map((meal, index) => (
                    <RecipeCard
                        key={index}
                        recipe={{
                            label: meal.recipeName,
                            image: meal.image,
                            uri: meal.recipeId,
                            source: meal.source,
                        }}
                        onAddToMealPlan={() => {} /* No need for this in the meal planner? */}
                        onSave={() => {} /* same here */}
                    />
                ))}
            </div>
        </div>
    );
}
