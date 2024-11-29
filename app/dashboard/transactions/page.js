"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/app/lib/apiClient";
import { toast } from "react-toastify";

export default function Transactions() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [label, setLabel] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedLabelId, setSelectedLabelId] = useState("");
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/categories/")
      .then((response) => {
        const fetchedCategories = response.data.data.categories.map(
          (category) => ({
            id: category.id,
            name: category.name,
            categoryType: category.categoryType,
            labels: category.labels ? category.labels : [],
          })
        );

        setCategories(fetchedCategories);
      })
      .catch((error) => {
        console.error("Error fetching categories with labels:", error.message);
      });
  }, []);

  useEffect(() => {
    if (!selectedCategoryId) {
    } else {
      const selectedCategory = categories.find(
        (cat) => parseFloat(cat.id) === parseFloat(selectedCategoryId)
      );
      if (selectedCategory) {
        console.log("selected category: ", selectedCategory.name);
        setLabels(selectedCategory.labels);
      } else {
        setLabels([]);
      }
    }
  }, [selectedCategoryId, categories]);

  const handleAmountChange = (e) => setAmount(e.target.value);
  const handleCategoryChange = (e) => {
    //alert("id: ", e.target.value);
    setSelectedCategoryId(e.target.value);
  };
  const handleLabelChange = (e) => {
    setSelectedLabelId(e.target.value);
  };
  const handleDateChange = (e) => setDate(e.target.value);
  const handleNotesChange = (e) => setNotes(e.target.value);

  const handleAddTransaction = () => {
    if (amount && selectedCategoryId && selectedLabelId && date) {
      const selectedCategory = categories.find(
        (category) => category.id === parseInt(selectedCategoryId)
      );
      console.log(selectedCategory);

      const categoryType = selectedCategory
        ? selectedCategory.categoryType
        : "Unknown";

      const today = new Date();
      const selectedDate = new Date(date);
      const isScheduled = selectedDate.toDateString() !== today.toDateString();

      const transactionData = {
        labelId: parseFloat(selectedLabelId),
        categoryId: parseFloat(selectedCategoryId),
        type: categoryType,
        amount: parseFloat(amount),
        date,
        notes,
        isScheduled,
      };

      axiosInstance
        .post("/budget/add-transaction", transactionData)
        .then((response) => {
          console.log("Transaction added successfully:", response.data);
          toast.success("transaction added successfully!");
        })
        .catch((error) => {
          const errorMessage =
            error.response?.data?.message || "Error adding transaction";
          console.error("Error adding transaction:", errorMessage);
          toast.error(errorMessage);
        });

      setAmount("");
      setCategory("");
      setLabel("");
      setDate("");
      setNotes("");
    } else {
      console.log("Please fill in all required fields.");
    }
  };

  return (
    <div className="w-full h-full p-6 bg-white flex flex-col">
      <div className="max-w-96 text-black">
        <h2 className="text-xl text-black font-semibold mb-4">
          Add Transaction
        </h2>

        {/* Amount Input */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="amount"
          >
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter amount"
          />
        </div>

        {/* Category Select */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="category"
          >
            Category
          </label>
          <select
            id="category"
            value={selectedCategoryId}
            onChange={handleCategoryChange} // Update selected category ID
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {" "}
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Label Select */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="label"
          >
            Label
          </label>
          <select
            id="label"
            value={selectedLabelId}
            onChange={handleLabelChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={!selectedCategoryId}
          >
            <option value="">Select Label</option>
            {labels.map((labelItem) => (
              <option key={labelItem.id} value={labelItem.id}>
                {labelItem.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Picker */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="date"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={handleDateChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Notes Text Area */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="notes"
          >
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={handleNotesChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Add any notes here"
          ></textarea>
        </div>

        {/* Add Transaction Button */}
        <button
          onClick={handleAddTransaction}
          className="w-full py-3 bg-[#043927] text-white rounded-lg hover:bg-green-600 transition-all"
        >
          Add Transaction
        </button>
      </div>
    </div>
  );
}
