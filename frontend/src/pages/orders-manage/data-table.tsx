import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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
import { useContext, useState } from 'react'
import { domain } from 'wailsjs/go/models'
import { Button } from '@/components/ui/button'
import PaginationButton from '@/components/pagination-button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { OrdersManagerCtx } from '@/context/orders-manager-provider'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  // setSelectedOrder: React.Dispatch<React.SetStateAction<domain.Order | null>>
}

export default function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const {setSelectedOrder} = useContext(OrdersManagerCtx)
  const [pageSize, setPageSize] = useState(6) // Estado para el tamaño de la página
  const [pageIndex, setPageIndex] = useState(0) // Estado para el índice de la página

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex,
        pageSize
      }
    },
    onPaginationChange: updater => {
      const newPagination =
        typeof updater === 'function'
          ? updater({ pageIndex, pageSize })
          : updater
      setPageIndex(newPagination.pageIndex)
      setPageSize(newPagination.pageSize)
    },
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
    <Card className="flex flex-col grow">
      <CardHeader>
        <CardTitle>Ordenes</CardTitle>
        <CardDescription>Aca puedes ver todo lo relacionado con una order y a la vez manipular las.</CardDescription>
      </CardHeader>
     <CardContent className='grow'>
     <Table >
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
     </CardContent>

      <CardFooter className="flex items-center justify-between border-t px-6 py-3 bg-muted/50">
        <span className="text-muted-foreground text-xs">{`Mostrando ${
          table.getRowModel().rows.length
        }-${pageSize} de ${data.length} ordenes`}</span>

        <div className="flex space-x-2">
          <PaginationButton
            direction="left"
            handler={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          />
          <PaginationButton
            direction="right"
            handler={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          />
        </div>
      </CardFooter>
    </Card>
  )
}

function isRowSelected(rowId: string, selectedRowIds: Set<string>) {
  return selectedRowIds.has(rowId)
}
