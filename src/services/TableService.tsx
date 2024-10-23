import axiosInstance from "../axios";

const getTables = () => {
    return axiosInstance.get(`/Admin/Tables/GetEventTables?IdEvent=1&Offset=0`)
}

const insertTable = (table: any) => {
    return axiosInstance.post(`/Admin/Tables/InsertEventTable`, table)
}
const updateTable = (table: any) => {
    console.log(table)
    return axiosInstance.put(`/Admin/Tables/UpdateEventTable`, table)
}

const deleteTable = (id: number) => {
    return axiosInstance.delete(`/Admin/Tables/DeleteEventTable`, { data: { IdEventTable: id } })
}

export const TableService = {
    getTables,
    insertTable,
    updateTable,
    deleteTable
};