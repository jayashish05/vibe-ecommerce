import React from 'react';

const ReceiptModal = ({ receipt, onClose }) => {
  if (!receipt) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Order Confirmed!</h2>
          <p className="text-slate-600">{receipt.message}</p>
        </div>

        <div className="bg-slate-50 rounded-lg p-6 mb-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Customer:</span>
            <span className="font-semibold text-slate-800">{receipt.customerName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Email:</span>
            <span className="font-semibold text-slate-800">{receipt.customerEmail}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Items:</span>
            <span className="font-semibold text-slate-800">{receipt.items}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Date:</span>
            <span className="font-semibold text-slate-800">
              {new Date(receipt.timestamp).toLocaleDateString()}
            </span>
          </div>
          <div className="border-t border-slate-200 pt-3 mt-3">
            <div className="flex justify-between">
              <span className="text-lg font-bold text-slate-800">Total:</span>
              <span className="text-2xl font-bold text-emerald-600">${receipt.total}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default ReceiptModal;
