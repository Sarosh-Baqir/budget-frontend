"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/app/lib/apiClient";

export default function Reports() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedLabelId, setSelectedLabelId] = useState("");
  const [labels, setLabels] = useState([]);
  const [reports, setReports] = useState([]);

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
    if (selectedCategoryId) {
      const selectedCategory = categories.find(
        (cat) => parseFloat(cat.id) === parseFloat(selectedCategoryId)
      );
      setLabels(selectedCategory ? selectedCategory.labels : []);
    }
  }, [selectedCategoryId, categories]);

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setSelectedCategoryId(selectedCategoryId);

    const selectedCategory = categories.find(
      (cat) => parseFloat(cat.id) === parseFloat(selectedCategoryId)
    );

    if (selectedCategory) {
      const categoryExists = reports.some(
        (report) => report.categoryId === selectedCategory.id
      );

      if (!categoryExists) {
        setReports((prevReports) => [
          ...prevReports,
          {
            categoryId: selectedCategory.id,
            category: selectedCategory.name,
            label: [],
            startDate: "",
            endDate: "",
            planned: "",
            spending: "",
          },
        ]);
      }
    }
  };
  const handleLabelChange = (e) => {
    const selectedLabelId = e.target.value;
    setSelectedLabelId(selectedLabelId);

    const selectedLabel = labels.find(
      (label) => parseFloat(label.id) === parseFloat(selectedLabelId)
    );

    if (selectedLabel) {
      setReports((prevReports) =>
        prevReports.map((report) =>
          parseFloat(report.categoryId) === parseFloat(selectedCategoryId)
            ? {
                ...report,
                label: report.label.includes(selectedLabel.name)
                  ? report.label
                  : [...report.label, selectedLabel.name],
              }
            : report
        )
      );
    }
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    setReports((prevReports) =>
      prevReports.map((report) =>
        parseFloat(report.categoryId) === parseFloat(selectedCategoryId)
          ? {
              ...report,
              startDate: newStartDate,
            }
          : report
      )
    );
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);

    setReports((prevReports) =>
      prevReports.map((report) =>
        parseFloat(report.categoryId) === parseFloat(selectedCategoryId)
          ? {
              ...report,
              endDate: newEndDate,
            }
          : report
      )
    );
  };
  const generateReport = async () => {
    console.log("in generate report function");
    const filledReports = reports.filter(
      (report) =>
        report.categoryId &&
        report.label.length > 0 &&
        report.startDate &&
        report.endDate
    );

    if (filledReports.length === 0) return;

    const reportsWithLabelIds = filledReports.map((report) => ({
      ...report,
      labelIds: report.label.map((labelName) => {
        const labelObj = labels.find((lbl) => lbl.name === labelName);
        return labelObj ? labelObj.id : null; // Map label name to its ID
      }),
    }));

    reportsWithLabelIds.forEach(async (report) => {
      try {
        const response = await axiosInstance.post("/budget/get-report", {
          categoryId: report.categoryId,
          labelIds: report.labelIds,
          startDate: report.startDate,
          endDate: report.endDate,
        });

        setReports((prevReports) =>
          prevReports.map((r) =>
            r.categoryId === report.categoryId &&
            r.startDate === report.startDate &&
            r.endDate === report.endDate
              ? {
                  ...r,
                  planned: response.data.data.plannedBudget,
                  spending: response.data.data.spending,
                }
              : r
          )
        );
      } catch (error) {
        console.error(
          `Error generating report for category ${report.categoryId}:`,
          error
        );
      }
    });
  };

  const handleExport = () => {
    console.log("Exporting data...");
  };

  return (
    <div className="w-full h-full p-6 bg-white flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="text-black flex space-x-4">
          <select
            value={selectedCategoryId}
            onChange={handleCategoryChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={selectedLabelId}
            onChange={handleLabelChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Label</option>
            {labels.map((labelItem) => (
              <option key={labelItem.id} value={labelItem.id}>
                {labelItem.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          onClick={generateReport}
          className="px-6 py-2 bg-[#043927] text-white rounded-lg hover:bg-green-600 transition-all"
        >
          Generate
        </button>
        <button
          onClick={handleExport}
          className="px-6 py-2 bg-[#043927] text-white rounded-lg hover:bg-green-600 transition-all"
        >
          Export
        </button>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-black table-auto border-2 border-[#043927] rounded-lg overflow-hidden">
          <thead className="bg-[#043927] h-16">
            <tr>
              <th className="py-2 px-4 text-left text-white">Category</th>
              <th className="py-2 px-4 text-left text-white">Labels</th>
              <th className="py-2 px-4 text-left text-white">Date</th>
              <th className="py-2 px-4 text-left text-white">Planned</th>
              <th className="py-2 px-4 text-left text-white">Spending</th>
            </tr>
          </thead>
          <tbody className="bg-gray-100">
            {reports.map((report, index) => (
              <tr key={index} className="border-t h-14">
                <td className="py-2 px-4">{report.category}</td>
                <td className="py-2 px-4">
                  <ul className="list-disc pl-6">
                    {report.label.map((lbl, idx) => (
                      <li key={idx}>{lbl}</li>
                    ))}
                  </ul>
                </td>
                <td className="py-2 px-4">
                  {report.startDate} - {report.endDate}
                </td>
                <td className="py-2 px-4">{report.planned}</td>
                <td className="py-2 px-4">{report.spending}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
