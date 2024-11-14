import instance from "../axios";

const getTableTopics = (IdEventTable: number) => {
    return instance.get(`/Admin/Tables/GetTableTopics`, {
        params: {
            IdEventTable: IdEventTable
        }
    });
}

export const TableTopicService = {
    getTableTopics

};
