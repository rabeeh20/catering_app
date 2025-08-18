import React, { useState, useEffect } from 'react';
import { Plus, Minus, Calculator, FileText, Package, ShoppingCart, ChevronDown, X, CheckCircle } from 'lucide-react';
// Note: jsPDF imports are removed as we will load them from a CDN.

// --- Data (Could be fetched from an API) ---
const DISH_RECIPES = {
    'Biriyani': { 'Basmati Rice': 1, 'Chicken': 1, 'Onions': 0.5, 'Spices Mix': 0.3, 'Ghee': 0.02, 'Yogurt': 0.03 },
    'Fish Curry': { 'Fish': 0.12, 'Coconut': 0.1, 'Onions': 0.04, 'Tomatoes': 0.03, 'Spices Mix': 0.008, 'Coconut Oil': 0.01 },
    'Sambar': { 'Toor Dal': 0.05, 'Vegetables': 0.08, 'Tamarind': 0.005, 'Spices Mix': 0.005, 'Curry Leaves': 0.002 },
    'Rasam': { 'Toor Dal': 0.03, 'Tomatoes': 0.04, 'Tamarind': 0.008, 'Rasam Powder': 0.003, 'Curry Leaves': 0.002 },
    'Appam': { 'Rice Flour': 0.08, 'Coconut Milk': 0.05, 'Yeast': 0.001, 'Sugar': 0.005 },
    'Puttu': { 'Rice Flour': 0.1, 'Coconut': 0.03, 'Salt': 0.001 }
};

const INITIAL_STOCK = {
    'Basmati Rice': 5, 'Chicken': 4, 'Fish': 3, 'Onions': 3, 'Tomatoes': 2, 'Coconut': 8, 'Spices Mix': 6, 'Ghee': 1, 'Yogurt': 1,
    'Coconut Oil': 8, 'Toor Dal': 15, 'Vegetables': 25, 'Tamarind': 3, 'Curry Leaves': 2, 'Rasam Powder': 1.5, 'Rice Flour': 20,
    'Coconut Milk': 10, 'Yeast': 0.5, 'Sugar': 15, 'Salt': 5
};

// --- Child Components ---

const StockModal = ({ stock, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Package className="w-5 h-5 text-orange-500" /> Current Stock Levels
                </h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-3">
                    {Object.entries(stock)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([material, quantity]) => (
                            <div key={material} className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-sm text-gray-700">{material}</span>
                                <div className="font-medium text-gray-800">{quantity.toFixed(2)} kg</div>
                            </div>
                        ))}
                </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-b-xl text-right">
                 <button 
                    onClick={onClose} 
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
);


const Header = ({ onShowStock }) => (
    <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-orange-800 mb-2">Kerala Catering Service</h1>
        <p className="text-lg text-orange-600">Material Planning & Inventory Management</p>
        <div className="flex justify-center items-center gap-4 mt-4 text-sm text-orange-700">
            <span className="flex items-center gap-1"><Package className="w-4 h-4" /> Connected to Tally Prime</span>
            <span className="flex items-center gap-1"><Calculator className="w-4 h-4" /> Auto-calculation enabled</span>
            <button onClick={onShowStock} className="flex items-center gap-1 hover:underline cursor-pointer">
                <Package className="w-4 h-4" /> All Stocks
            </button>
        </div>
    </div>
);

const DishSelector = ({ dishes, selectedDishes, onUpdate, onAdd, onRemove }) => {
    const [selectedDishForAdd, setSelectedDishForAdd] = useState('');

    const handleAddDish = () => {
        if (selectedDishForAdd) {
            onAdd(selectedDishForAdd);
            setSelectedDishForAdd('');
        }
    };
    
    const totalServings = Object.values(selectedDishes).reduce((sum, qty) => sum + qty, 0);

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" /> Select Dishes & Quantities
            </h2>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Dish:</label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <select
                            value={selectedDishForAdd}
                            onChange={(e) => setSelectedDishForAdd(e.target.value)}
                            className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white"
                        >
                            <option value="">Choose a dish...</option>
                            {Object.keys(dishes)
                                .filter(dish => !selectedDishes.hasOwnProperty(dish))
                                .map(dish => <option key={dish} value={dish}>{dish}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                    <button
                        onClick={handleAddDish}
                        disabled={!selectedDishForAdd}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors flex items-center gap-1"
                    >
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>
            </div>
            
            <div className="space-y-4 flex-grow overflow-y-auto pr-2">
                {Object.keys(selectedDishes).length === 0 ? (
                    <div className="text-center py-8 text-gray-500 h-full flex flex-col justify-center items-center">
                        <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No dishes selected.</p>
                        <p className="text-sm">Use the dropdown above to add dishes.</p>
                    </div>
                ) : (
                    Object.entries(selectedDishes).map(([dish, quantity]) => (
                        <DishItem key={dish} dish={dish} quantity={quantity} onUpdate={onUpdate} onRemove={onRemove} />
                    ))
                )}
            </div>

            <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                <div className="text-center">
                    <div className="text-2xl font-bold text-orange-800">{totalServings}</div>
                    <div className="text-sm text-orange-600">Total Servings</div>
                </div>
            </div>
        </div>
    );
};

const DishItem = ({ dish, quantity, onUpdate, onRemove }) => (
    <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-700">{dish}</h3>
            <button onClick={() => onRemove(dish)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
        </div>
        <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Servings:</span>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onUpdate(dish, quantity - 1)}
                    className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600"
                >
                    <Minus className="w-4 h-4" />
                </button>
                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => onUpdate(dish, parseInt(e.target.value) || 0)}
                    className="w-16 text-center font-medium border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    onFocus={(e) => e.target.select()}
                />
                <button
                    onClick={() => onUpdate(dish, quantity + 1)}
                    className="w-8 h-8 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center text-green-600"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
);


const MaterialRequirements = ({ requirements, stock }) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-500" /> Material Requirements
        </h2>
        {Object.keys(requirements).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Select dishes to see requirements.</p>
            </div>
        ) : (
            <div className="space-y-3">
                {Object.entries(requirements).map(([material, required]) => (
                    <div key={material} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-700">{material}</span>
                        <div className="text-right">
                            <div className="font-medium text-gray-800">{required.toFixed(2)} kg</div>
                            <div className="text-xs text-gray-500">Stock: {(stock[material] || 0).toFixed(2)} kg</div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);

const ShoppingList = ({ shortage, requirements, stock, selectedDishes, isPdfLibReady, onUpdateStock }) => {
    const totalShortageItems = Object.keys(shortage).length;
    const totalDishes = Object.values(selectedDishes).reduce((sum, qty) => sum + qty, 0);
    const hasRequirements = Object.keys(requirements).length > 0;

    const exportShoppingListToPDF = () => {
        if (!isPdfLibReady || !window.jspdf) {
            console.error("PDF generation library is not ready.");
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const currentDate = new Date().toLocaleDateString('en-IN');
        const currentTime = new Date().toLocaleTimeString('en-IN');

        doc.setFontSize(20);
        doc.setTextColor('#ea580c');
        doc.text("Kerala Catering Service", 14, 22);
        doc.setFontSize(12);
        doc.setTextColor('#333');
        doc.text("Shopping List - Material Purchase Requirements", 14, 30);
        doc.setFontSize(9);
        doc.setTextColor('#888');
        doc.text(`Generated on: ${currentDate} at ${currentTime}`, 14, 36);

        doc.autoTable({
            startY: 45,
            body: [
                [{ content: '📋 Order Summary', colSpan: 4, styles: { fillColor: '#fef2f2', textColor: '#dc2626', fontStyle: 'bold' } }],
                ['Items to Purchase:', `${totalShortageItems} items`, 'Total Servings:', `${totalDishes} servings`],
                ['Dish Varieties:', `${Object.keys(selectedDishes).length}`, 'Status:', 'Ready for Purchase'],
            ],
            theme: 'grid',
            styles: { cellPadding: 2, fontSize: 10 },
        });

        const tableColumn = ["Material Name", "Required (kg)", "In Stock (kg)", "Need to Buy (kg)"];
        const tableRows = [];
        Object.entries(shortage).forEach(([material, shortageQty]) => {
            const row = [
                material,
                (requirements[material] || 0).toFixed(2),
                (stock[material] || 0).toFixed(2),
                { content: shortageQty.toFixed(2), styles: { fontStyle: 'bold', textColor: '#dc2626' } },
            ];
            tableRows.push(row);
        });

        doc.autoTable(tableColumn, tableRows, {
            startY: doc.lastAutoTable.finalY + 10,
            headStyles: { fillColor: '#ea580c', textColor: 'white', fontStyle: 'bold' },
            alternateRowStyles: { fillColor: '#f9f9f9' },
        });

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor('#666');
            doc.text('Please verify quantities before purchasing.', 14, doc.internal.pageSize.height - 10);
            doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 35, doc.internal.pageSize.height - 10);
        }

        doc.save(`Kerala_Catering_Shopping_List_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between">
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-red-500" /> Shopping List & Actions
                </h2>
                {totalShortageItems === 0 ? (
                    <div className="text-center py-8 text-green-600">
                        <Package className="w-12 h-12 mx-auto mb-2" />
                        <p className="font-medium">All materials in stock!</p>
                        <p className="text-sm text-gray-500 mt-1">No additional purchase needed.</p>
                    </div>
                ) : (
                     <div className="space-y-3">
                        {Object.entries(shortage).map(([material, shortageQty]) => (
                            <div key={material} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                <span className="font-medium text-red-800">{material}</span>
                                <div className="font-bold text-red-700">{shortageQty.toFixed(2)} kg</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-4 space-y-2">
                 
                <button
                    onClick={exportShoppingListToPDF}
                    disabled={!isPdfLibReady || totalShortageItems === 0}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <FileText className="w-4 h-4" /> 
                    {isPdfLibReady ? 'Export Shopping List' : 'Loading PDF Tools...'}
                </button>
                <button
                    onClick={onUpdateStock}
                    disabled={!hasRequirements}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <Package className="w-4 h-4" />
                    Update Stock & Finalize
                </button>
            </div>
        </div>
    );
};

const SummaryCards = ({ requirements, shortage, selectedDishes }) => {
    const totalShortageItems = Object.keys(shortage).length;
    const totalMaterials = Object.keys(requirements).length;
    const totalServings = Object.values(selectedDishes).reduce((sum, qty) => sum + qty, 0);

    return (
        <div className="grid md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{totalMaterials}</div>
                <div className="text-sm text-gray-600">Materials Needed</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{totalMaterials - totalShortageItems}</div>
                <div className="text-sm text-gray-600">Available in Stock</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{totalShortageItems}</div>
                <div className="text-sm text-gray-600">Need to Purchase</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{totalServings}</div>
                <div className="text-sm text-gray-600">Total Servings</div>
            </div>
        </div>
    );
};

// --- Main App Component ---

const CateringInventorySystem = () => {
    const [dishes] = useState(DISH_RECIPES);
    const [currentStock, setCurrentStock] = useState(INITIAL_STOCK);
    const [selectedDishes, setSelectedDishes] = useState({});
    const [materialRequirements, setMaterialRequirements] = useState({});
    const [shortage, setShortage] = useState({});
    const [isPdfLibReady, setIsPdfLibReady] = useState(false);
    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [notification, setNotification] = useState('');

    // Effect to dynamically load PDF generation scripts
    useEffect(() => {
        const jspdfScript = document.createElement('script');
        jspdfScript.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        jspdfScript.id = "jspdf-script";
        jspdfScript.async = true;
        
        const autoTableScript = document.createElement('script');
        autoTableScript.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js";
        autoTableScript.id = "jspdf-autotable-script";
        autoTableScript.async = true;

        const loadScripts = () => {
            document.body.appendChild(jspdfScript);
        };

        jspdfScript.onload = () => {
            document.body.appendChild(autoTableScript);
        };
        
        autoTableScript.onload = () => {
            setIsPdfLibReady(true);
        };

        if (!document.getElementById('jspdf-script')) {
            loadScripts();
        } else if (window.jspdf && window.jspdf.jsPDF.autoTable) {
             setIsPdfLibReady(true);
        }

        return () => {
            const script1 = document.getElementById('jspdf-script');
            const script2 = document.getElementById('jspdf-autotable-script');
            if (script1) document.body.removeChild(script1);
            if (script2) document.body.removeChild(script2);
        };
    }, []);

    useEffect(() => {
        const requirements = {};
        Object.entries(selectedDishes).forEach(([dish, quantity]) => {
            if (quantity > 0) {
                Object.entries(dishes[dish]).forEach(([material, requiredPerServing]) => {
                    requirements[material] = (requirements[material] || 0) + (requiredPerServing * quantity);
                });
            }
        });

        const shortageCalc = {};
        Object.entries(requirements).forEach(([material, required]) => {
            const available = currentStock[material] || 0;
            if (required > available) {
                shortageCalc[material] = required - available;
            }
        });

        setMaterialRequirements(requirements);
        setShortage(shortageCalc);
    }, [selectedDishes, dishes, currentStock]);

    const handleAddDish = (dish) => {
        setSelectedDishes(prev => ({ ...prev, [dish]: 1 }));
    };

    const handleRemoveDish = (dish) => {
        setSelectedDishes(prev => {
            const newDishes = { ...prev };
            delete newDishes[dish];
            return newDishes;
        });
    };

    const handleUpdateDishQuantity = (dish, quantity) => {
        if (quantity <= 0) {
            handleRemoveDish(dish);
        } else {
            setSelectedDishes(prev => ({ ...prev, [dish]: quantity }));
        }
    };

    const handleUpdateStock = () => {
        if (Object.keys(materialRequirements).length === 0) {
            setNotification("No dishes selected to update stock.");
            setTimeout(() => setNotification(''), 3000);
            return;
        }

        setCurrentStock(prevStock => {
            const newStock = { ...prevStock };
            for (const material in materialRequirements) {
                if (newStock.hasOwnProperty(material)) {
                    const required = materialRequirements[material];
                    const newQuantity = newStock[material] - required;
                    newStock[material] = Math.max(0, newQuantity);
                }
            }
            return newStock;
        });
        
        // Clear the plan after updating the stock
        setSelectedDishes({});

        setNotification("Stock updated and plan reset for next order.");
        setTimeout(() => setNotification(''), 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 sm:p-6">
            {notification && (
                <div className="fixed top-5 right-5 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2" role="alert">
                    <CheckCircle className="w-5 h-5" />
                    <span className="block sm:inline">{notification}</span>
                </div>
            )}
            {isStockModalOpen && <StockModal stock={currentStock} onClose={() => setIsStockModalOpen(false)} />}
            <div className="max-w-7xl mx-auto">
                <Header onShowStock={() => setIsStockModalOpen(true)} />

                <div className="grid lg:grid-cols-3 gap-6">
                    <DishSelector
                        dishes={dishes}
                        selectedDishes={selectedDishes}
                        onAdd={handleAddDish}
                        onRemove={handleRemoveDish}
                        onUpdate={handleUpdateDishQuantity}
                    />
                    <MaterialRequirements requirements={materialRequirements} stock={currentStock} />
                    <ShoppingList
                        shortage={shortage}
                        requirements={materialRequirements}
                        stock={currentStock}
                        selectedDishes={selectedDishes}
                        isPdfLibReady={isPdfLibReady}
                        onUpdateStock={handleUpdateStock}
                    />
                </div>

                <SummaryCards requirements={materialRequirements} shortage={shortage} selectedDishes={selectedDishes} />

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
