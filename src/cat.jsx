import React, { useState, useEffect } from 'react';
import { Plus, Minus, Calculator, FileText, Package, ShoppingCart, ChevronDown } from 'lucide-react';

const CateringInventorySystem = () => {
  // Sample dishes with their material requirements
  const [dishes] = useState({
    'Biriyani': {
      'Basmati Rice': 1, // kg per serving
      'Chicken': 1,
      'Onions': 0.5,
      'Spices Mix': 0.3,
      'Ghee': 0.02,
      'Yogurt': 0.03
    },
    'Fish Curry': {
      'Fish': 0.12,
      'Coconut': 0.1,
      'Onions': 0.04,
      'Tomatoes': 0.03,
      'Spices Mix': 0.008,
      'Coconut Oil': 0.01
    },
    'Sambar': {
      'Toor Dal': 0.05,
      'Vegetables': 0.08,
      'Tamarind': 0.005,
      'Spices Mix': 0.005,
      'Curry Leaves': 0.002
    },
    'Rasam': {
      'Toor Dal': 0.03,
      'Tomatoes': 0.04,
      'Tamarind': 0.008,
      'Rasam Powder': 0.003,
      'Curry Leaves': 0.002
    },
    'Appam': {
      'Rice Flour': 0.08,
      'Coconut Milk': 0.05,
      'Yeast': 0.001,
      'Sugar': 0.005
    },
    'Puttu': {
      'Rice Flour': 0.1,
      'Coconut': 0.03,
      'Salt': 0.001
    }
  });

  // Sample current stock (normally from Tally Prime)
  const [currentStock] = useState({
    'Basmati Rice': 5,
    'Chicken': 4,
    'Fish': 3,
    'Onions': 3,
    'Tomatoes': 2,
    'Coconut': 8,
    'Spices Mix': 6,
    'Ghee': 1,
    'Yogurt': 1,
    'Coconut Oil': 8,
    'Toor Dal': 15,
    'Vegetables': 25,
    'Tamarind': 3,
    'Curry Leaves': 2,
    'Rasam Powder': 1.5,
    'Rice Flour': 20,
    'Coconut Milk': 10,
    'Yeast': 0.5,
    'Sugar': 15,
    'Salt': 5
  });

  const [selectedDishes, setSelectedDishes] = useState({});
  const [materialRequirements, setMaterialRequirements] = useState({});
  const [shortage, setShortage] = useState({});
  const [selectedDishForAdd, setSelectedDishForAdd] = useState('');

  // Add dish from dropdown
  const addDishFromDropdown = () => {
    if (selectedDishForAdd && !selectedDishes.hasOwnProperty(selectedDishForAdd)) {
      setSelectedDishes(prev => ({
        ...prev,
        [selectedDishForAdd]: 1
      }));
      setSelectedDishForAdd('');
    }
  };

  // Remove dish completely
  const removeDish = (dish) => {
    setSelectedDishes(prev => {
      const newDishes = { ...prev };
      delete newDishes[dish];
      return newDishes;
    });
  };

  // Add or update dish quantity
  const updateDishQuantity = (dish, quantity) => {
    if (quantity <= 0) {
      removeDish(dish);
    } else {
      setSelectedDishes(prev => ({
        ...prev,
        [dish]: quantity
      }));
    }
  };

  // Calculate material requirements
  useEffect(() => {
    const requirements = {};
    const shortageCalc = {};

    // Calculate total requirements for all selected dishes
    Object.entries(selectedDishes).forEach(([dish, quantity]) => {
      if (quantity > 0) {
        Object.entries(dishes[dish]).forEach(([material, requiredPerServing]) => {
          requirements[material] = (requirements[material] || 0) + (requiredPerServing * quantity);
        });
      }
    });

    // Calculate shortage
    Object.entries(requirements).forEach(([material, required]) => {
      const available = currentStock[material] || 0;
      if (required > available) {
        shortageCalc[material] = required - available;
      }
    });

    setMaterialRequirements(requirements);
    setShortage(shortageCalc);
  }, [selectedDishes, dishes, currentStock]);

  const totalDishes = Object.values(selectedDishes).reduce((sum, qty) => sum + qty, 0);
  const totalShortageItems = Object.keys(shortage).length;

  // Export shopping list as PDF
  const exportShoppingListToPDF = () => {
    if (totalShortageItems === 0) {
      alert('No items to export. Shopping list is empty!');
      return;
    }

    const currentDate = new Date().toLocaleDateString('en-IN');
    const currentTime = new Date().toLocaleTimeString('en-IN');
    
    // Create HTML content for PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Kerala Catering Service - Shopping List</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Arial, sans-serif; 
      padding: 30px; 
      color: #333;
      line-height: 1.4;
      background: white;
    }
    .header { 
      text-align: center; 
      margin-bottom: 25px; 
      border-bottom: 2px solid #e97317;
      padding-bottom: 15px;
    }
    .company-name { 
      font-size: 28px; 
      font-weight: bold; 
      color: #ea580c;
      margin-bottom: 8px;
    }
    .subtitle { 
      font-size: 16px; 
      color: #666; 
      margin-bottom: 8px;
    }
    .date-info { 
      font-size: 12px; 
      color: #888; 
    }
    .summary { 
      background: #fef2f2; 
      padding: 20px; 
      border-radius: 8px; 
      margin: 25px 0;
      border-left: 5px solid #dc2626;
    }
    .summary-title { 
      font-size: 18px; 
      font-weight: bold; 
      color: #dc2626; 
      margin-bottom: 15px;
    }
    .summary-grid { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 12px;
      font-size: 14px;
    }
    .summary-item {
      padding: 5px 0;
    }
    .dishes-section {
      margin: 25px 0;
      background: #fef7ed;
      padding: 20px;
      border-radius: 8px;
      border-left: 5px solid #ea580c;
    }
    .dishes-title {
      font-size: 18px;
      font-weight: bold;
      color: #ea580c;
      margin-bottom: 15px;
    }
    .dish-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
    }
    .dish-item {
      padding: 8px;
      background: white;
      border-radius: 4px;
    }
    .dish-name {
      font-weight: bold;
      color: #333;
      font-size: 14px;
    }
    .dish-qty {
      color: #666;
      font-size: 12px;
      margin-top: 2px;
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 25px 0;
      font-size: 14px;
    }
    th { 
      background: #ea580c; 
      color: white; 
      padding: 12px 8px; 
      text-align: left;
      font-weight: bold;
    }
    td { 
      padding: 10px 8px; 
      border-bottom: 1px solid #ddd;
    }
    tr:nth-child(even) { 
      background: #f9f9f9;
    }
    .shortage-qty { 
      font-weight: bold; 
      color: #dc2626;
    }
    .footer { 
      margin-top: 30px; 
      text-align: center; 
      font-size: 11px; 
      color: #666;
      border-top: 1px solid #ddd;
      padding-top: 15px;
    }
    .print-btn {
      position: fixed;
      top: 10px;
      right: 10px;
      background: #dc2626;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      z-index: 1000;
    }
    .print-btn:hover {
      background: #b91c1c;
    }
    @media print {
      .print-btn { display: none; }
      body { padding: 15px; }
      .header { margin-bottom: 20px; padding-bottom: 10px; }
      .summary, .dishes-section { margin: 15px 0; padding: 15px; }
      table { margin: 15px 0; }
      .footer { margin-top: 20px; padding-top: 10px; }
    }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">📄 Save as PDF</button>
  
  <div class="header">
    <div class="company-name">Kerala Catering Service</div>
    <div class="subtitle">Shopping List - Material Purchase Requirements</div>
    <div class="date-info">Generated on: ${currentDate} at ${currentTime}</div>
  </div>

  <div class="summary">
    <div class="summary-title">📋 Order Summary</div>
    <div class="summary-grid">
      <div class="summary-item"><strong>Items to Purchase:</strong> ${totalShortageItems} items</div>
      <div class="summary-item"><strong>Total Servings:</strong> ${totalDishes} servings</div>
      <div class="summary-item"><strong>Dish Varieties:</strong> ${Object.keys(selectedDishes).length}</div>
      <div class="summary-item"><strong>Status:</strong> Ready for Purchase</div>
    </div>
  </div>

  ${Object.keys(selectedDishes).length > 0 ? `
  <div class="dishes-section">
    <div class="dishes-title">🍽️ Dishes Being Prepared</div>
    <div class="dish-grid">
      ${Object.entries(selectedDishes).map(([dish, qty]) => `
        <div class="dish-item">
          <div class="dish-name">${dish}</div>
          <div class="dish-qty">${qty} servings</div>
        </div>
      `).join('')}
    </div>
  </div>
  ` : ''}

  <div style="margin: 25px 0;">
    <h3 style="color: #dc2626; margin-bottom: 15px; font-size: 18px;">🛒 Shopping List</h3>
    <table>
      <thead>
        <tr>
          <th>Material Name</th>
          <th>Required (kg)</th>
          <th>In Stock (kg)</th>
          <th>Need to Buy (kg)</th>
        </tr>
      </thead>
      <tbody>
        ${Object.entries(shortage).map(([material, shortageQty]) => {
          const required = materialRequirements[material];
          const available = currentStock[material] || 0;
          return `
            <tr>
              <td><strong>${material}</strong></td>
              <td>${required.toFixed(2)}</td>
              <td>${available.toFixed(2)}</td>
              <td class="shortage-qty">${shortageQty.toFixed(2)}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p><strong>Kerala Catering Service Inventory Management System</strong></p>
    <p>📞 Contact kitchen manager for any queries | ✅ Please verify quantities before purchasing</p>
    <p style="margin-top: 5px; font-size: 10px;">Document generated automatically on ${currentDate} ${currentTime}</p>
  </div>

  <script>
    // Auto-focus and show instructions
    window.onload = function() {
      setTimeout(() => {
        alert('PDF ready! Click the "📄 Save as PDF" button in the top-right corner, or press Ctrl+P (Cmd+P on Mac) to save as PDF.');
      }, 500);
    }
    
    // Add keyboard shortcut
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        window.print();
      }
    });
  </script>
</body>
</html>`;

    // Create and open the PDF window
    const pdfWindow = window.open('', '_blank', 'width=800,height=900');
    
    if (pdfWindow) {
      pdfWindow.document.write(htmlContent);
      pdfWindow.document.close();
      pdfWindow.focus();
      
      console.log('PDF window opened successfully');
    } else {
      // Fallback for popup blockers
      alert('Please allow popups for this site to export PDF, or try again.');
      
      // Alternative: create downloadable HTML file
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Kerala_Catering_Shopping_List_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('PDF export window blocked. Downloaded HTML file instead - open it in browser and print as PDF.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-800 mb-2">Kerala Catering Service</h1>
          <p className="text-lg text-orange-600">Material Planning & Inventory Management</p>
          <div className="flex justify-center items-center gap-4 mt-4 text-sm text-orange-700">
            <span className="flex items-center gap-1">
              <Package className="w-4 h-4" />
              Connected to Tally Prime
            </span>
            <span className="flex items-center gap-1">
              <Calculator className="w-4 h-4" />
              Auto-calculation enabled
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Dish Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" />
              Select Dishes & Quantities
            </h2>
            
            {/* Dropdown to add new dishes */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Dish:
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select
                    value={selectedDishForAdd}
                    onChange={(e) => setSelectedDishForAdd(e.target.value)}
                    className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white"
                  >
                    <option value="">Choose a dish to add...</option>
                    {Object.keys(dishes)
                      .filter(dish => !selectedDishes.hasOwnProperty(dish))
                      .map(dish => (
                        <option key={dish} value={dish}>{dish}</option>
                      ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
                <button
                  onClick={addDishFromDropdown}
                  disabled={!selectedDishForAdd}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
            
            {/* Selected dishes */}
            <div className="space-y-4">
              {Object.keys(selectedDishes).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No dishes selected. Use the dropdown above to add dishes.</p>
                </div>
              ) : (
                Object.entries(selectedDishes).map(([dish, quantity]) => (
                  <div key={dish} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-700">{dish}</h3>
                      <button
                        onClick={() => removeDish(dish)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Servings:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateDishQuantity(dish, quantity - 1)}
                          className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value) || 0;
                            updateDishQuantity(dish, newQuantity);
                          }}
                          className="w-16 text-center font-medium border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          onFocus={(e) => e.target.select()}
                        />
                        <button
                          onClick={() => updateDishQuantity(dish, quantity + 1)}
                          className="w-8 h-8 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center text-green-600"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 p-4 bg-orange-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-800">{totalDishes}</div>
                <div className="text-sm text-orange-600">Total Servings</div>
              </div>
            </div>
          </div>

          {/* Material Requirements */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-500" />
              Material Requirements
            </h2>

            {Object.keys(materialRequirements).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Select dishes to see material requirements</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(materialRequirements).map(([material, required]) => (
                  <div key={material} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-700">{material}</span>
                    <div className="text-right">
                      <div className="font-medium text-gray-800">
                        {required.toFixed(2)} kg
                      </div>
                      <div className="text-xs text-gray-500">
                        Stock: {(currentStock[material] || 0).toFixed(2)} kg
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shopping List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-red-500" />
              Shopping List
            </h2>

            {totalShortageItems === 0 ? (
              <div className="text-center py-8 text-green-600">
                <Package className="w-12 h-12 mx-auto mb-2" />
                <p className="font-medium">All materials in stock!</p>
                <p className="text-sm text-gray-500 mt-1">No additional purchase needed</p>
              </div>
            ) : (
              <>
                <div className="mb-4 p-3 bg-red-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-xl font-bold text-red-700">{totalShortageItems}</div>
                    <div className="text-sm text-red-600">Items to Purchase</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(shortage).map(([material, shortageQty]) => (
                    <div key={material} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="font-medium text-red-800">{material}</span>
                      <div className="text-right">
                        <div className="font-bold text-red-700">
                          {shortageQty.toFixed(2)} kg
                        </div>
                        <div className="text-xs text-red-600">
                          Need to buy
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={exportShoppingListToPDF}
                  className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Export Shopping List as PDF
                </button>
              </>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{Object.keys(materialRequirements).length}</div>
            <div className="text-sm text-gray-600">Materials Needed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {Object.keys(materialRequirements).length - totalShortageItems}
            </div>
            <div className="text-sm text-gray-600">Available in Stock</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{totalShortageItems}</div>
            <div className="text-sm text-gray-600">Need to Purchase</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{totalDishes}</div>
            <div className="text-sm text-gray-600">Total Servings</div>
          </div>
        </div>

        {/* Integration Note */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Tally Prime Integration</h3>
          <p className="text-sm text-blue-700">
            This system is designed to connect with your Tally Prime data. Stock levels shown are sample data. 
            In production, this would sync with your actual Tally Prime inventory in real-time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CateringInventorySystem;