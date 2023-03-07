import React, { useState, useEffect } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

function SourceTable() {
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState({
    sizePerPage: 10,
    page: 1,
    totalSize: 0,
  });
  const [filter, setFilter] = useState('');

  const fetchData = async (page, sizePerPage, searchText) => {
    const url = `https://your-server.com/api/data?page=${page}&sizePerPage=${sizePerPage}&searchText=${searchText}`;
    const response = await axios.get(url);
    const { data, totalSize } = response.data;
    setTableData(data);
    setPagination({ ...pagination, totalSize });
  };

  const handlePageChange = (page, sizePerPage) => {
    fetchData(page, sizePerPage, filter);
    setPagination({ ...pagination, page, sizePerPage });
  };

  const handleSearch = (event) => {
    const searchText = event.target.value;
    fetchData(1, pagination.sizePerPage, searchText);
    setFilter(searchText);
  };

  const columns = [
    {
      dataField: 'id',
      text: 'ID',
    },
    {
      dataField: 'name',
      text: 'Name',
      filter: textFilter(),
    },
    {
      dataField: 'age',
      text: 'Age',
    },
    {
      dataField: 'email',
      text: 'Email',
      filter: textFilter(),
    },
  ];

  useEffect(() => {
    fetchData(pagination.page, pagination.sizePerPage, filter);
  }, []);

  return (
    <>
      <input
        type="text"
        value={filter}
        onChange={handleSearch}
        placeholder="Search"
      />
      <BootstrapTable
        remote={{ pagination: true, filter: true }}
        keyField="id"
        data={tableData}
        columns={columns}
        pagination={paginationFactory(pagination)}
        filter={filterFactory()}
        onTableChange={handlePageChange}
        noDataIndication={() => 'No data available'}
      />
    </>
  );
}

export default SourceTable;



// // django code below
// from django.core.paginator import Paginator
// from django.db.models import Q
// from django.http import JsonResponse
// from django.views.decorators.csrf import csrf_exempt
// from myapp.models import MyModel

// @csrf_exempt
// def get_data(request):
//     # Get query parameters
//     page = request.GET.get('page', 1)
//     size = request.GET.get('sizePerPage', 10)
//     search_text = request.GET.get('searchText', '')

//     # Build search query
//     search_query = Q(name__icontains=search_text) | Q(email__icontains=search_text)

//     # Get data and apply search filter
//     data = MyModel.objects.filter(search_query)

//     # Paginate data
//     paginator = Paginator(data, size)
//     page_data = paginator.get_page(page)

//     # Format data for response
//     formatted_data = [{
//         'id': item.id,
//         'name': item.name,
//         'age': item.age,
//         'email': item.email
//     } for item in page_data]

//     # Return response
//     return JsonResponse({
//         'data': formatted_data,
//         'totalSize': data.count(),
//     })
