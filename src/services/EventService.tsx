import instance from "../axios";

const getEvents = () => {
    return instance.get(`/Admin/Events/GetEvents?Offset=0`)
};

const createEvent = (event: any) => {
    return instance.post(`/Admin/Events/InsertEvent`, event);
}

const getEventById = (id: number) => {
    return instance.get(`/Admin/Events/GetEvent?IdEvent=${id}`);
}

const getEventNameById = (id: number) => {
    return instance.get(`/Admin/Events/GetEvent?IdEvent=${id}`);
}

const updateEvent = (event: any) => {
    return instance.put(`/Admin/Events/UpdateEvent`, event);
}

const EventService = {
    getEvents,
    createEvent,
    getEventById,
    updateEvent,
    getEventNameById
};

export default EventService;