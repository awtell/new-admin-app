import instance from "../axios";

const getTables = () => {
    return instance.get(`/Admin/Tables/GetEventTables?IdEvent=1&Offset=0`)
}

const insertTable = (table: any) => {
    return instance.post(`/Admin/Tables/InsertEventTable`, table)
}
const updateTable = (table: any) => {
    return instance.put(`/Admin/Tables/UpdateEventTable`, table)
}

const deleteTable = (id: number) => {
    return instance.delete(`/Admin/Tables/DeleteEventTable`, { data: { IdEventTable: id } })
}

export const TableService = {
    getTables,
    insertTable,
    updateTable,
    deleteTable
};