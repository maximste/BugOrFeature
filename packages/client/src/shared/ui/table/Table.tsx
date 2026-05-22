import { ReactElement } from 'react'

type Row = Record<string, unknown>

type TableProps = {
  className?: string
  rows: Row[]
  columns?: { key: string; title: string }[]
}

export const Table = ({
  className = '',
  rows = [],
  columns = [],
}: TableProps): ReactElement => {
  return (
    <table className={className}>
      {columns.length > 0 && (
        <thead>
          <tr>
            {columns.map(({ key, title }) => (
              <th key={key}>{title}</th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={`row-${rowIndex}`}>
            {columns.map(({ key }) => (
              <td key={`cell-${rowIndex}-${key}`}>{renderCell(row[key])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// Вспомогательная функция для безопасного рендеринга ячеек
const renderCell = (value: unknown): ReactElement | string => {
  if (value === null || value === undefined) {
    return '-'
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}
