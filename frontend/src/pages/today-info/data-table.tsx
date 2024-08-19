import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useState } from 'react'
import { domain } from 'wailsjs/go/models'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  setSelectedOrder: React.Dispatch<React.SetStateAction<domain.Order | null>>
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  setSelectedOrder
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),

    // @ts-ignore
    getRowId: row => row.id
  })

  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set())

  const handleRowClick = (rowId: string, order: domain.Order) => {
    setSelectedRowIds(prevSelectedRowIds => {
      const updatedRowIds = new Set(prevSelectedRowIds)

      if (isRowSelected(rowId, updatedRowIds)) {
        updatedRowIds.delete(rowId) // Deseleccionar si ya está seleccionado
        setSelectedOrder(null)
      } else {
        updatedRowIds.clear() // Limpiar las selecciones anteriores
        updatedRowIds.add(rowId) // Seleccionar la nueva fila
        setSelectedOrder(order)
      }

      return updatedRowIds
    })
  }

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map(header => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody className="text-sm text-black/80">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map(row => (
            <TableRow
              key={row.id}
              onClick={() => {
                handleRowClick(row.id, row.original as domain.Order)
              }}
              data-state={row.getIsSelected() && 'selected'}
              className={`cursor-pointer ${
                selectedRowIds.has(row.id) ? 'bg-accent' : ''
              }`}
            >
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No hay resultados.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

function isRowSelected(rowId: string, selectedRowIds: Set<string>) {
  return selectedRowIds.has(rowId)
}
