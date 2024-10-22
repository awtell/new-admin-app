import axiosInstance from "../axios";

const getAllSpeakers = () => {
    return axiosInstance.get(`/Admin/Events/GetSpeakers?Offset=0`);
};

const addSpeaker = (speaker: any) => {
    return axiosInstance.post(`/Admin/Events/InsertSpeaker`, speaker);
};

const addEventSpeaker = (IdSpeaker: number, IdEvent: number) => {
    return axiosInstance.post(`/Admin/Events/InsertEventSpeaker`, { IdEvent, IdSpeaker });
}

const editEventSpeaker = (speaker: any) => {
    return axiosInstance.put(`/Admin/Events/UpdateSpeaker`, speaker);
};

const deleteEventSpeaker = (IdEventSpeaker: number) => {
    console.log(IdEventSpeaker)
    return axiosInstance.delete(`/Admin/Events/DeleteEventSpeaker`, { data: { IdEventSpeaker } });
};


const getEventSpeaker = (IdSpeaker: number) => {
    return axiosInstance.get(`/Admin/Events/GetSpeaker`, {
        params: { IdSpeaker }
    });
};

const deleteSpeaker = (IdSpeaker: number) => {
    return axiosInstance.delete(`/Admin/Events/DeleteSpeaker`, { data: { 'IdSpeaker': IdSpeaker } });
}

export const SpeakerService = {
    getAllSpeakers,
    addSpeaker,
    editEventSpeaker,
    deleteEventSpeaker,
    getEventSpeaker,
    addEventSpeaker,
    deleteSpeaker
};