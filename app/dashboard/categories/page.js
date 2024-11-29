"use client";
import { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import axiosInstance from "../../lib/apiClient";

export default function Categories() {
  const [categoryName, setCategoryName] = useState("");
  const [totalPlannedBudget, setTotalPlannedBudget] = useState("");
  const [categoryType, setCategoryType] = useState("income");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [labels, setLabels] = useState([""]);
  const [categories, setCategories] = useState([]);
  const [newLabelName, setNewLabelName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  // Fetch categories from the backend
  useEffect(() => {
    axiosInstance
      .get("/categories/")
      .then((response) => {
        const fetchedCategories = response.data.data.categories.map(
          (category) => ({
            id: category.id,
            name: category.name,
            labels: category.labels
              ? category.labels.map((label) => label.name)
              : [],
          })
        );

        setCategories(fetchedCategories);
      })
      .catch((error) => {
        console.error("Error fetching categories with labels:", error.message);
      });
  }, []);

  const handleCategoryChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleAddCategory = () => {
    if (categoryName.trim() !== "") {
      const newCategory = {
        name: categoryName,
        totalBudget: parseFloat(totalPlannedBudget),
        categoryType: categoryType,
        description: categoryDescription,
      };

      console.log("new category: ", newCategory);

      axiosInstance
        .post("/categories/add-category", newCategory)
        .then((response) => {
          const newCategoryId = response.data?.data?.data[0]?.id;

          const addedCategory = {
            id: newCategoryId,
            name: categoryName,
            labels: [],
          };

          // Update the categories state
          setCategories((prevCategories) => [...prevCategories, addedCategory]);

          // Reset form fields
          setCategoryName("");
          setTotalPlannedBudget("");
          setCategoryType("income");
          setCategoryDescription("");
          setLabels([""]);
        })
        .catch((error) => {
          console.error("Error adding category:", error.message);
        });
    }
  };

  const handleAddLabel = () => {
    console.log("in handle add label");
    console.log(selectedCategoryId);
    console.log(newLabelName);
    if (newLabelName.trim() !== "" && selectedCategoryId) {
      const newLabel = {
        name: newLabelName,
        categoryId: parseFloat(selectedCategoryId),
      };
      console.log(categories);

      // Confirm what value is being sent
      console.log("Selected Category ID:", selectedCategoryId);
      alert(`Selected Category ID: ${selectedCategoryId}`);

      axiosInstance
        .post("/labels/add-label", newLabel)
        .then(() => {
          // Update the categories state to reflect the new label
          setCategories((prevCategories) =>
            prevCategories.map((category) =>
              category.id === parseFloat(selectedCategoryId)
                ? {
                    ...category,
                    labels: [...category.labels, newLabelName],
                  }
                : category
            )
          );

          // Clear form fields
          setNewLabelName("");
          setSelectedCategoryId("");
        })
        .catch((error) => {
          console.error("Error adding label:", error.message);
        });
    }
  };

  const handleCategoryChange2 = (e) => {
    //alert("id: ", e.target.value);
    setSelectedCategoryId(e.target.value);
  };

  return (
    <div className="flex w-full h-full">
      {/* Left Side: Add Category + Add Label */}
      <div className="w-1/3 h-full p-6 bg-white flex flex-col space-y-6">
        {" "}
        {/* Add Category Section */}
        <div className="text-black">
          <h2 className="text-xl text-black font-semibold mb-4">
            Add Category
          </h2>

          {/* Category Name */}
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Category Name"
            className="w-full bg-gray-100 hover:bg-gray-200 px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
          />
          {/* Total Planned Budget */}
          <input
            type="number"
            value={totalPlannedBudget}
            onChange={(e) => setTotalPlannedBudget(e.target.value)}
            placeholder="Total Planned Budget"
            className="w-full bg-gray-100 hover:bg-gray-200 px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
          />
          {/* Category Type */}
          <select
            value={categoryType}
            onChange={(e) => setCategoryType(e.target.value)}
            className="w-full bg-gray-100 hover:bg-gray-200 px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          {/* Description */}
          <textarea
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            placeholder="Description"
            className="w-full bg-gray-100 hover:bg-gray-200 px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
          />

          <button
            onClick={handleAddCategory}
            className="w-32 py-3 bg-[#043927] text-white rounded-lg hover:bg-green-600 transition-all block"
          >
            Add Category
          </button>
        </div>
        {/* Add Label Section */}
        <div className="text-black">
          <h2 className="text-xl text-black font-semibold mb-4">Add Label</h2>

          {/* Label Name */}
          <input
            type="text"
            value={newLabelName}
            onChange={(e) => setNewLabelName(e.target.value)}
            placeholder="Label Name"
            className="w-full bg-gray-100 hover:bg-gray-200 px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
          />

          {/* Category Dropdown */}
          <select
            id="category"
            value={selectedCategoryId}
            onChange={handleCategoryChange2}
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

          <button
            onClick={handleAddLabel}
            className="w-32 py-3 bg-[#043927] text-white rounded-lg hover:bg-green-600 transition-all block"
          >
            Add Label
          </button>
        </div>
      </div>

      {/* Right Side: Categories Table */}
      <div className="w-2/3 h-full p-6 bg-white text-black flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Categories List</h2>

        <table className="w-full table-auto border-2 border-[#043927] rounded-lg overflow-hidden">
          <thead className="bg-[#043927] h-16">
            <tr>
              <th className="py-2 px-4 text-left text-white">Category</th>
              <th className="py-2 px-4 text-left text-white">Labels</th>
              <th className="py-2 px-4 text-left text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-100">
            {categories.map((category, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4">{category.name}</td>
                <td className="py-2 px-4">
                  <ul className="list-disc pl-5">
                    {category.labels && category.labels.length > 0 ? (
                      category.labels.map((label, idx) => (
                        <li key={`${category.id}-${idx}`}>{label}</li>
                      ))
                    ) : (
                      <li>No labels</li>
                    )}
                  </ul>
                </td>
                <td className="py-2 px-4 flex items-center space-x-2">
                  <button className="text-blue-500 hover:text-blue-700">
                    <FaEdit />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
