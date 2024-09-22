import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateTable.css';
import LoadingAnimation from '../Loading/LoadingAnimation';


const CreateTable: React.FC = () => {
  const [tableData, setTableData] = useState({
    name: '',
    capacity: '',
    costPerChair: '',
    availability: '',
    startTime: '',
    endTime: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTableData({ ...tableData, [name]: value });
  };

  const allFieldsFilled = () => {
    return (
      tableData.name !== '' &&
      tableData.capacity !== '' &&
      tableData.costPerChair !== '' &&
      tableData.availability !== '' &&
      tableData.startTime !== '' &&
      tableData.endTime !== ''
    );
  };

  const handleSubmit = () => {
    if (!allFieldsFilled()) {
      return;
    }

    setLoading(true); // Set loading state to true when submission starts

    // Simulate a delay for table creation (e.g., server request)
    setTimeout(() => {
      navigate('/tables');
      setLoading(false); // Set loading state to false after completion
    }, 2000); // Simulating 2 seconds delay
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="flex flex-col items-center py-10 px-4 overflow-auto max-h-80vh">
        <div className="max-w-4xl w-full">
          <h1 className="text-4xl font-black text-gray-900 my-6">New Table</h1>

          <div className="flex space-x-6">
            {/* Left Column */}
            <div className="flex-1 space-y-6">
              <div>
                <label>Table name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Table Name"
                  className="w-full bg-gray-200 text-gray-900 rounded-xl p-4"
                  value={tableData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label>Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  className="w-full bg-gray-200 text-gray-900 rounded-xl p-4"
                  value={tableData.capacity}
                  onChange={handleInputChange}
                  min={0}
                  required
                />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Cost per chair</label>
                <input
                  type="number"
                  name="costPerChair"
                  className="w-full bg-gray-200 text-gray-900 rounded-xl p-4"
                  value={tableData.costPerChair}
                  onChange={handleInputChange}
                  min={0}
                  required
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 space-y-6">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Availability</label>
                <div className="availability-container">
                  <button
                    className={`chip ${tableData.availability === 'available' ? 'chip-selected' : ''}`}
                    onClick={() => setTableData({ ...tableData, availability: 'available' })}
                  >
                    Available
                  </button>
                  <button
                    className={`chip ${tableData.availability === 'unavailable' ? 'chip-selected' : ''}`}
                    onClick={() => setTableData({ ...tableData, availability: 'unavailable' })}
                  >
                    Unavailable
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="time-container">
                  <div className="flex-1">
                    <label className="block text-base font-medium text-gray-700 mb-2">Time starting</label>
                    <input
                      type="time"
                      name="startTime"
                      className="time-input"
                      value={tableData.startTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-base font-medium text-gray-700 mb-2">Time ending</label>
                    <input
                      type="time"
                      name="endTime"
                      className="time-input"
                      value={tableData.endTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!allFieldsFilled() || loading}
            className={`w-full text-white py-3 rounded-xl text-lg font-bold mt-6 ${allFieldsFilled() && !loading ? 'bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            {loading ? <LoadingAnimation /> : 'Create Table'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTable;
