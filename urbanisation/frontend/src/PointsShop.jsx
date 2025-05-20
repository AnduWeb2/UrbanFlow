import React from "react";
import "./PointsShop.css"; // Importăm fișierul CSS
import { toast } from "react-toastify";

const PointsShop = () => {
    const items = [
        { id: 1, name: "Free Bus Pass - 1 Month", price: 200, description: "Enjoy unlimited bus travel for 1 month." },
        { id: 2, name: "Free Bus Pass - 3 Months", price: 500, description: "Enjoy unlimited bus travel for 3 month." },
        { id: 3, name: "Free Bus Pass - 6 Months", price: 800, description: "Enjoy unlimited bus travel for 6 month." },
        { id:4, name: "20% Discount - Palas Mall", price: 450, description: "Enjoy 20% discount to any store inside the Palas Mall Iasi" },
        { id:4, name: "40% Discount - Palas Mall", price: 700, description: "Enjoy 40% discount to any store inside the Palas Mall Iasi" }
    ];
    const handleBuy = (itemName, itemPrice) => {
        const points = localStorage.getItem("points");
        if (itemPrice > points)
            toast.error(`You need ${itemPrice-points} more points!`);
        else
            toast.success(`You have succesfully bought ${itemName}`)
    }
    return (
        <div className="points-shop">
            <h2>Points Shop</h2>
            <p>Here you can spend your points on various rewards!</p>
            <div className="items-container">
                {items.map((item) => (
                    <div key={item.id} className="item-card">
                        <h3>{item.name}</h3>
                        <p className="item-price">Price: {item.price} points</p>
                        <p className="item-description">{item.description}</p>
                        <button className="buy-button" onClick={() => handleBuy(item.name, item.price)}>
                            Buy
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PointsShop;