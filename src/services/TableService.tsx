import axiosInstance from "../axios";

const getTables = () => {
    return axiosInstance.get(`/Admin/Tables/GetEventTables?IdEvent=1&Offset=0`)
}

const insertTable = (table: any) => {
    
    return axiosInstance.post(`/Admin/Tables/InsertEventTable`, table)
}

export const TableService = {
    getTables,
    insertTable
};