"use client";
import { useState, useEffect } from "react";
import ProgressBar from "../components/ProgressBar";
import BudgetCards from "../components/BudgetCards";
import axiosInstance from "../lib/apiClient";

export default function Dashboard() {
  const [plannedBudget, setPlannedBudget] = useState(0);
  const [spentSoFar, setSpentSoFar] = useState(0);
  const [categories, setCategories] = useState([]);

  // Fetch total budget data from backend
  useEffect(() => {
    axiosInstance
      .get("/budget/get-budget")
      .then((response) => {
        const { totalBudget, spentBudget } = response.data.data.data;
        setPlannedBudget(parseFloat(totalBudget));
        setSpentSoFar(parseFloat(spentBudget));
      })
      .catch((error) => {
        console.error("Error fetching total budget data:", error.message);
      });
  }, []);

  // Fetch categories data from backend
  useEffect(() => {
    axiosInstance
      .get("/categories/get-categories")
      .then((response) => {
        const fetchedCategories = response.data.data.categories;
        setCategories(fetchedCategories);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error.message);
      });
  }, []);

  const remaining = plannedBudget - spentSoFar;

  // Calculate percentages for the progress bar
  const spentPercentage =
    plannedBudget > 0 ? (spentSoFar / plannedBudget) * 100 : 0;
  const remainingPercentage = 100 - spentPercentage;

  return (
    <div className="p-6 w-full h-full bg-white shadow-md rounded-lg">
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Here's an overview of your budget!
      </h2>

      {/* Progress Bar */}
      <div className="my-4 max-w-2xl">
        <ProgressBar
          spentPercentage={spentPercentage}
          remainingPercentage={remainingPercentage}
        />
      </div>

      {/* Overall Budget Summary */}
      <BudgetCards
        plannedBudget={plannedBudget}
        spentBudget={spentSoFar}
        remainingBudget={remaining}
      />

      {/* Categories Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-black mb-4">
          Budget by Categories
        </h3>
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category.id} className="mb-8">
              {/* Category Name */}
              <h4 className="text-md font-semibold text-gray-700 mb-4">
                {category.name}
              </h4>
              {/* Budget Cards for Category */}
              <BudgetCards
                plannedBudget={parseFloat(category.totalBudget)}
                spentBudget={parseFloat(category.spentBudget)}
                remainingBudget={parseFloat(category.remainingBudget)}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500">No categories found.</p>
        )}
      </div>
    </div>
  );
}
