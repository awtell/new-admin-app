import React, { useState } from 'react';
// import './Orders.css';

const ordersData = [
  {
    eventName: 'CSIS 2022',
    date: 'Oct 10, 2022',
    reservationName: 'Jane Smith',
    tableNumber: 'Table 1',
    cost: '$100',
  },
  {
    eventName: 'UX Design Conference',
    date: 'Oct 05, 2024',
    reservationName: 'John Doe',
    tableNumber: 'Table 2',
    cost: '$200',
  },
  {
    eventName: 'Product Management Forum',
    date: 'Nov 01, 2024',
    reservationName: 'Samantha Johnson',
    tableNumber: 'Table 3',
    cost: '$300',
  },
  {
    eventName: 'Software Engineering Symposium',
    date: 'Sep 15, 2024',
    reservationName: 'Michael Brown',
    tableNumber: 'Table 4',
    cost: '$400',
  },
  {
    eventName: 'Blockchain Innovators Expo',
    date: 'Dec 01, 2024',
    reservationName: 'Emily Lee',
    tableNumber: 'Table 5',
    cost: '$500',
  },
  {
    eventName: 'CSIS 2022',
    date: 'Oct 10, 2022',
    reservationName: 'Jane Smith',
    tableNumber: 'Table 1',
    cost: '$100',
  },
  {
    eventName: 'UX Design Conference',
    date: 'Oct 05, 2024',
    reservationName: 'John Doe',
    tableNumber: 'Table 2',
    cost: '$200',
  },
  {
    eventName: 'Product Management Forum',
    date: 'Nov 01, 2024',
    reservationName: 'Samantha Johnson',
    tableNumber: 'Table 3',
    cost: '$300',
  },
  {
    eventName: 'Software Engineering Symposium',
    date: 'Sep 15, 2024',
    reservationName: 'Michael Brown',
    tableNumber: 'Table 4',
    cost: '$400',
  },
  {
    eventName: 'Blockchain Innovators Expo',
    date: 'Dec 01, 2024',
    reservationName: 'Emily Lee',
    tableNumber: 'Table 5',
    cost: '$500',
  },
];

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredOrders = ordersData.filter((order) =>
    order.reservationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="orders-page">
      <header className="orders-header">
        <h1>Table Reservations</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search reservations"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </header>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Date</th>
            <th>Table #</th>
            <th>Reservation Name</th>
            <th>Cost</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, index) => (
            <tr key={index}>
              <td>{order.eventName}</td>
              <td>{order.date}</td>
              <td>{order.tableNumber}</td>
              <td>{order.reservationName}</td>
              <td>{order.cost}</td>
              <td>
                <button className="details-button">View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
