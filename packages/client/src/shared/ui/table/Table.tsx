import React, { type ReactElement } from 'react'
import {
  Box,
  Table as ChakraTable,
  type SystemStyleObject,
} from '@chakra-ui/react'

type Row = Record<string, unknown>

type CellProps<R extends Row> =
  | SystemStyleObject
  | ((row: R, rowIndex: number) => SystemStyleObject)

type Column<R extends Row> = {
  key: string
  title: string
  headerCellProps?: SystemStyleObject
  cellProps?: CellProps<R>
}

type TableProps<R extends Row> = {
  className?: string
  rows: R[]
  columns?: Column<R>[]
  getRowProps?: (row: R, rowIndex: number) => SystemStyleObject
}

const resolveCellProps = <R extends Row>(
  cellProps: CellProps<R> | undefined,
  row: R,
  rowIndex: number
): SystemStyleObject | undefined =>
  typeof cellProps === 'function' ? cellProps(row, rowIndex) : cellProps

export const Table = <R extends Row>({
  className = '',
  rows = [],
  columns = [],
  getRowProps,
}: TableProps<R>): ReactElement => {
  return (
    <Box
      className={className}
      css={{ background: 'card/80', borderRadius: 'card', boxShadow: 'card' }}
      w="full"
      overflow="hidden">
      <ChakraTable.Root variant="line" w="full">
        <ChakraTable.Body>
          {rows.map((row, rowIndex) => (
            <ChakraTable.Row
              key={`row-${rowIndex}`}
              css={getRowProps?.(row, rowIndex)}>
              {columns.map(({ key, cellProps }) => (
                <ChakraTable.Cell
                  key={`cell-${rowIndex}-${key}`}
                  padding="10px 20px"
                  css={resolveCellProps(cellProps, row, rowIndex)}>
                  {renderCell(row[key])}
                </ChakraTable.Cell>
              ))}
            </ChakraTable.Row>
          ))}
        </ChakraTable.Body>
      </ChakraTable.Root>
    </Box>
  )
}

const renderCell = (value: unknown): ReactElement | string => {
  if (value === null || value === undefined) {
    return '-'
  }

  if (React.isValidElement(value)) {
    return value
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}
