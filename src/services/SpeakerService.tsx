import instance from "../axios";

const getAllSpeakers = () => {
    return instance.get(`/Admin/Events/GetSpeakers?Offset=0`);
};

const addSpeaker = (speaker: any) => {
    return instance.post(`/Admin/Events/InsertSpeaker`, speaker);
};

const addEventSpeaker = (IdSpeaker: number, IdEvent: number) => {
    return instance.post(`/Admin/Events/InsertEventSpeaker`, { IdEvent, IdSpeaker });
}

const editEventSpeaker = (speaker: any) => {
    return instance.put(`/Admin/Events/UpdateSpeaker`, speaker);
};

const deleteEventSpeaker = (IdEventSpeaker: number) => {
    return instance.delete(`/Admin/Events/DeleteEventSpeaker`, { data: { IdEventSpeaker } });
};


// const getEventSpeaker = (IdSpeaker: number) => {
//     return axiosInstance.get(`/Admin/Events/GetSpeaker`, {
//         // params: { IdSpeaker }
//     });
// };

const deleteSpeaker = (IdSpeaker: number) => {
    return instance.delete(`/Admin/Events/DeleteSpeaker`, { data: { 'IdSpeaker': IdSpeaker } });
}

export const SpeakerService = {
    getAllSpeakers,
    addSpeaker,
    editEventSpeaker,
    deleteEventSpeaker,
    // getEventSpeaker,
    addEventSpeaker,
    deleteSpeaker
};