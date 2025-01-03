import "./datatable.scss"
import { DataGrid } from "@mui/x-data-grid"
import useFetch from "../../hooks/useFetch"
import { Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

const Datatable = ({ columns }) => {
  const [list, setList] = useState([])
  const location = useLocation()
  const path = location.pathname.split("/")[1]

  const { data, loading, error } = useFetch(`/${path}`)

  useEffect(() => {
    setList(data)
  }, [data])

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this item?"
    )

    if (isConfirmed) {
      try {
        await axios.delete(`/${path}/${id}`)

        setList(list.filter((item) => item._id !== id))
      } catch (err) {
        console.error(err)
      }
    }
  }

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              to={`/${path}/${params.row._id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">Update</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </div>
          </div>
        )
      }
    }
  ]

  return (
    <div className="datatable">
      <div className="datatableTitle">
        {path}
        <Link to={`/${path}/new`} className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        rows={list}
        columns={columns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={(row) => row._id}
        className="datagrid"
      />
    </div>
  )
}

export default Datatable