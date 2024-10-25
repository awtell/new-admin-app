import instance from "../axios";

const insertPartner = async (attachment: File, eventId: number) => {
   return instance.post(`/Admin/Events/InsertEventPartner`, { attachment, eventId });
}
const deletePartner = async (IdEventPartner: number) => {
   return instance.delete(`/Admin/Events/DeleteEventPartner`, { data: { IdEventPartner } });
}


export const PartnerService = {
   insertPartner,
   deletePartner
};
