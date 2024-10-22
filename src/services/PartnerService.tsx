import axiosInstance from "../axios";

const insertPartner = async (eventId: string, attachment1: File, attachment2: File) => {
    const formData = new FormData();
    formData.append("eventId", eventId);
    formData.append("attachment1", attachment1);
    formData.append("attachment2", attachment2);

    try {
        console.log('object')
        const response = await axiosInstance.post("/Admin/Events/InsertEventPartners", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response;
    } catch (error) {
        console.error("Error inserting partner:", error);
    }
}


export const PartnerService = {
    insertPartner
};
