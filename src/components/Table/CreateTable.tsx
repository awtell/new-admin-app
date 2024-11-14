import React, { useEffect, useState } from 'react';
import './CreateTable.css';
import LoadingAnimation from '../Loading/LoadingAnimation';
import { TableService } from '../../services/TableService';
import { useNavigate } from 'react-router-dom';
import EventService from '../../services/EventService';
import ConfirmationModal from '../ConfirmationModal/ConfiramtionModal';
import TopicModal from './TopicModal';

const CreateTable: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [tableData, setTableData] = useState({
    IdEvent: 1,
    TableName: '',
    Capacity: '',
    CostPerChair: '',
    Availability: true,
    // StartTime: '',
    // EndTime: '',
    Attachment: '',
  });

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTableData({
      ...tableData,
      [name]: name === 'IdEvent' || name === 'Capacity' || name === 'IdAdmin' || name === 'IdEventTable' ? parseInt(value, 10) : value,
    });
  };

  const allFieldsFilled = () => {
    return (
      tableData.TableName !== '' &&
      tableData.Capacity !== '' &&
      tableData.CostPerChair !== '' 
      // tableData.StartTime !== '' &&
      // tableData.EndTime !== ''
    );
  };

  const handleSubmit = () => {
    if (!allFieldsFilled()) {
      return;
    }

    setLoading(true);
    handleCreateTable().catch((error) => {
      console.error('Error creating table:', error);
      setLoading(false);
    });
  };

  useEffect(() => {
    document.title = 'Create Table';

    const fetchEvents = async () => {
      try {
        const eventResponse = await EventService.getEvents();
        const eventData = eventResponse.data.My_Result;
        setEvents(eventData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleCreateTable = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('IdEvent', tableData.IdEvent.toString());
      formData.append('TableName', tableData.TableName);
      formData.append('Capacity', tableData.Capacity);
      formData.append('CostPerChair', tableData.CostPerChair);
      formData.append('Availability', tableData.Availability.toString());
      // formData.append('StartTime', tableData.StartTime);
      // formData.append('EndTime', tableData.EndTime);

      const attachmentInput = document.getElementById('Attachment') as HTMLInputElement;
      if (attachmentInput && attachmentInput.files && attachmentInput.files.length > 0) {
        formData.append('Attachment', attachmentInput.files[0]);
      }

      await TableService.insertTable(formData);

      setIsModalOpen(true); // Show confirmation dialog
    } catch (error) {
      console.error('Error creating table:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    setIsTopicModalOpen(true); // Show topic modal
  };

  const handleTopicConfirm = (description: string, time: string) => {
    // Handle the topic description and time here
    console.log('Topic Description:', description);
    console.log('Topic Time:', time);
    setIsTopicModalOpen(false);
    navigate('/add-topic'); // Replace '/add-topic' with the actual route to add a topic
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    navigate('/tables');
  };

  const handleTopicCancel = () => {
    setIsTopicModalOpen(false);
    navigate('/tables');
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
                  id="TableName"
                  type="text"
                  name="TableName"
                  placeholder="Table Name"
                  className="w-full bg-gray-200 text-gray-900 rounded-xl p-4"
                  value={tableData.TableName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Event</label>
                <select
                  id="IdEvent"
                  name="IdEvent"
                  className="w-full bg-gray-200 text-gray-900 rounded-xl p-4"
                  value={tableData.IdEvent}
                  onChange={handleInputChange}
                  required
                >
                  {events.map((event: any) => (
                    <option key={event.IdEvent} value={event.IdEvent}>
                      {event.EventName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className='block text-base font-medium text-gray-700 mb-2'>Capacity</label>
                  <input
                    id="Capacity"
                    type="number"
                    name="Capacity"
                    className="w-full bg-gray-200 text-gray-900 rounded-xl p-4"
                    value={tableData.Capacity}
                    onChange={handleInputChange}
                    min={0}
                    required
                    style={{ appearance: 'textfield' }}
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-base font-medium text-gray-700 mb-2">Cost per chair</label>
                  <input
                    id="CostPerChair"
                    type="number"
                    name="CostPerChair"
                    className="w-full bg-gray-200 text-gray-900 rounded-xl p-4"
                    value={tableData.CostPerChair}
                    onChange={handleInputChange}
                    min={0}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 space-y-6">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Availability</label>
                <div className="availability-container">
                  <button
                    className={`chip ${tableData.Availability ? 'chip-selected' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setTableData({ ...tableData, Availability: true });
                    }}
                  >
                    Available
                  </button>
                  <button
                    className={`chip ${!tableData.Availability ? 'chip-selected' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setTableData({ ...tableData, Availability: false });
                    }}
                  >
                    Unavailable
                  </button>
                </div>
              </div>

              {/* <div className="flex space-x-4">
                <div className="time-container">
                  <div className="flex-1">
                    <label className="block text-base font-medium text-gray-700 mb-2">Time starting</label>
                    <input
                      id="StartTime"
                      type="time"
                      name="StartTime"
                      className="time-input"
                      value={tableData.StartTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-base font-medium text-gray-700 mb-2">Time ending</label>
                    <input
                      id="EndTime"
                      type="time"
                      name="EndTime"
                      className="time-input"
                      value={tableData.EndTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div> */}
              <div className="flex-1">
                <label className="block text-base font-medium text-gray-700 mb-2">Attachment</label>
                <input
                  id="Attachment"
                  type="file"
                  name="Attachment"
                  className="time-input"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setTableData({ ...tableData, Attachment: e.target.files[0].name });
                    }
                  }}
                />
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

      {isModalOpen && (
        <ConfirmationModal
          message="Table created successfully! Would you like to add a topic?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}

      {isTopicModalOpen && (
        <TopicModal
          onConfirm={handleTopicConfirm}
          onCancel={handleTopicCancel}
        />
      )}
    </div>
  );
};

export default CreateTable;