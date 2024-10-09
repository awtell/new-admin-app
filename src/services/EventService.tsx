import axiosInstance from "../axios";

const getEvents = () => {
    return axiosInstance.get(`/Admin/Events/GetEvents?Offset=0`)
};

const createEvent = (event: any) => {
    return axiosInstance.post(`/Admin/Events/InsertEvent`, event);
}

const getEventById = (id: number) => {
    return axiosInstance.get(`/Admin/Events/GetEvent?IdEvent=${id}`);
}

const updateEvent = (event: any) => {
    console.log(event)
    return axiosInstance.put(`/Admin/Events/UpdateEvent`, event);
}

const EventService = {
    getEvents,
    createEvent,
    getEventById,
    updateEvent
};

export default EventService;