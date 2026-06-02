import { Popover, Text, Button, HStack, VStack, Input } from '@chakra-ui/react'
import { FC, useState } from 'react'
import CustomizeIcon from '@/assets/icons/customize.svg?react'
import { TRANSITION } from '../../../theme'
import { CUSTOM_FIELD_MAX_SIZE, CUSTOM_FIELD_MIN_SIZE } from '../constants/game'
import { useCustomGameForm } from '../hooks/useCustomGameForm'

type TProps = {
  isActive: boolean
  onCustomStart: (rows: number, cols: number, mines: number) => void
}

export const CustomGamePopover: FC<TProps> = props => {
  const { isActive, onCustomStart } = props

  const [isOpen, setIsOpen] = useState(false)

  const {
    formRows,
    setFormRows,
    safeRows,
    formCols,
    setFormCols,
    safeCols,
    formMines,
    setFormMines,
    safeMines,
    minMines,
    maxMines,
    start,
  } = useCustomGameForm({ onStart: onCustomStart })

  return (
    <Popover.Root
      open={isOpen}
      onOpenChange={(details: { open: boolean }) => setIsOpen(details.open)}>
      <Popover.Trigger
        unstyled
        bg={isActive ? 'pink' : isOpen ? 'purple' : 'card'}
        borderRadius="full"
        px={3}
        py={2}
        cursor="pointer"
        display="flex"
        alignItems="center"
        justifyContent="center"
        transition={TRANSITION}
        shadow={isActive ? 'button' : undefined}
        _hover={{ bg: isActive ? 'pink' : 'purple' }}
        title="Настройка сложности">
        <CustomizeIcon width={16} height={16} />
      </Popover.Trigger>

      <Popover.Positioner>
        <Popover.Content
          bg="card"
          boxShadow="card"
          borderRadius="2xl"
          width="210px"
          border="1px solid {colors.peach}"
          p={4}>
          <Popover.Body p={0}>
            <VStack align="stretch" gap={3}>
              <HStack justify="space-between" gap={2}>
                <Text fontWeight={600} fontSize="0.875rem" whiteSpace="nowrap">
                  Строки
                </Text>
                <Input
                  type="number"
                  value={formRows}
                  min={CUSTOM_FIELD_MIN_SIZE}
                  max={CUSTOM_FIELD_MAX_SIZE}
                  w="72px"
                  size="sm"
                  borderRadius="xl"
                  textAlign="center"
                  onChange={e => {
                    const v = parseInt(e.target.value, 10)

                    if (!isNaN(v)) setFormRows(v)
                  }}
                  onBlur={() => setFormRows(safeRows)}
                />
              </HStack>

              <HStack justify="space-between" gap={2}>
                <Text fontWeight={600} fontSize="0.875rem" whiteSpace="nowrap">
                  Колонки
                </Text>
                <Input
                  type="number"
                  value={formCols}
                  min={CUSTOM_FIELD_MIN_SIZE}
                  max={CUSTOM_FIELD_MAX_SIZE}
                  w="72px"
                  size="sm"
                  borderRadius="xl"
                  textAlign="center"
                  onChange={e => {
                    const v = parseInt(e.target.value, 10)

                    if (!isNaN(v)) setFormCols(v)
                  }}
                  onBlur={() => setFormCols(safeCols)}
                />
              </HStack>
              <VStack align="stretch" gap={1}>
                <HStack justify="space-between" gap={4}>
                  <HStack gap={1}>
                    <Text
                      fontWeight={600}
                      fontSize="0.875rem"
                      whiteSpace="nowrap">
                      Пёсики
                    </Text>
                  </HStack>
                  <Input
                    type="number"
                    value={formMines}
                    min={minMines}
                    max={maxMines}
                    w="72px"
                    size="sm"
                    borderRadius="xl"
                    textAlign="center"
                    onChange={e => {
                      const v = parseInt(e.target.value, 10)

                      if (!isNaN(v)) setFormMines(v)
                    }}
                    onBlur={() => setFormMines(safeMines)}
                  />
                </HStack>
                <Text fontSize="0.7rem" opacity={0.5} textAlign="right">
                  от {minMines} до {maxMines}
                </Text>
              </VStack>

              <Text fontSize="0.75rem" opacity={0.8} lineHeight="1.4">
                Размер поля от 5×5 до 24×24. Игры с кастомным размером поля не
                идут в топ.
              </Text>

              <Button
                unstyled
                bg="pink"
                borderRadius="2xl"
                fontSize="0.85rem"
                fontWeight={600}
                px={3}
                py={2}
                shadow="button"
                cursor="pointer"
                transition={TRANSITION}
                _hover={{ opacity: '0.8' }}
                onClick={() => {
                  start()
                  setIsOpen(false)
                }}>
                Начать игру
              </Button>
            </VStack>
          </Popover.Body>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  )
}
