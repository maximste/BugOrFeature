import { useEffect, useState } from 'react'
import { Box, Text } from '@chakra-ui/react'

const DEFAULT_LOCATION = null

export const GeolocationWidget = () => {
  const [userLatitude, setUserLatitude] = useState<number | null>(
    DEFAULT_LOCATION
  )
  const [userLongitude, setUserLongitude] = useState<number | null>(
    DEFAULT_LOCATION
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLatitude(position.coords.latitude)
          setUserLongitude(position.coords.longitude)
          setError(null)
        },
        err => {
          let message = 'Невозможно получить ваше местоположение'
          if (err.code === 1) {
            message = 'Вы запретили доступ к местоположению'
          } else if (err.code === 2) {
            message = 'Устройство не может определить местоположение'
          } else if (err.code === 3) {
            message = 'Превышено время ожидания получения координат'
          }
          setError(message)
        }
      )
    } else {
      setError('Определение местоположения не поддерживается браузером')
    }
  }, [])

  return (
    <Box fontWeight={400} fontSize="0.875rem" mt={4} textAlign="center">
      {!error && userLatitude !== null && userLongitude !== null ? (
        <>
          <Text>Битва проводится на крыше по координатам:</Text>
          <Text>
            <strong>широта</strong> - {userLatitude.toFixed(3)}
          </Text>
          <Text>
            <strong>долгота</strong> - {userLongitude.toFixed(3)}
          </Text>
          <Text>🐾 🐾 🐾 🐾 🐾 Мяу! 🐾 🐾 🐾 🐾 🐾 🐾</Text>
        </>
      ) : (
        <Text color="gray.500">{error ?? 'Определение координат…'}</Text>
      )}
    </Box>
  )
}
