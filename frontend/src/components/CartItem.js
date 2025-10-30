import React from 'react';

const CartItem = ({ item, onRemove, onUpdateQty, loading }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-6">
      <img 
        src={item.image} 
        alt={item.name}
        className="w-24 h-24 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
        <p className="text-slate-600">${item.price}</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdateQty(item._id, Math.max(1, item.qty - 1))}
            disabled={loading || item.qty <= 1}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 w-8 h-8 rounded-lg font-bold disabled:opacity-50"
          >
            -
          </button>
          <span className="w-12 text-center font-semibold">{item.qty}</span>
          <button
            onClick={() => onUpdateQty(item._id, item.qty + 1)}
            disabled={loading}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 w-8 h-8 rounded-lg font-bold disabled:opacity-50"
          >
            +
          </button>
        </div>
        <div className="text-right min-w-24">
          <p className="text-lg font-bold text-slate-800">${(item.price * item.qty).toFixed(2)}</p>
        </div>
        <button
          onClick={() => onRemove(item._id)}
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
