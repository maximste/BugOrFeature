import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import ChatIcon from '@/assets/icons/chat.svg?react'
import { usePage } from '@/app/hooks/usePage'
import { Button } from '@/shared/ui/button'
import { MainFeatureCards } from '@/widgets/main-feature-cards'

import LogoIcon from '@/assets/icons/logo.svg?react'
import StarIcon from '@/assets/icons/star.svg?react'

import { MAIN_FEATURE_CARDS } from '../model/mainFeatureCards'
import { initMainPage } from '../model/initMainPage'

export const MainPage = () => {
  usePage({ initPage: initMainPage })
  const navigate = useNavigate()

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap={8}
      w="full">
      <Helmet>
        <meta charSet="utf-8" />
        <title>BugOrFeature</title>
        <meta name="description" content="BugOrFeature" />
      </Helmet>
      <Box as="main" pt="32px" pb="32px">
        <Flex
          as="section"
          direction="column"
          alignItems="center"
          justifyContent="center"
          w="full"
          maxW="1200px"
          mx="auto"
          px="20px"
          textAlign="center">
          <Text
            display="flex"
            alignItems="center"
            gap={2}
            cursor="text"
            margin="0 auto 24px"
            fontFamily="body"
            fontSize="14px"
            fontWeight="500"
            background="purple/50"
            padding="6px 16px"
            borderRadius="pill"
            color="buttonText"
            maxW="max-content"
            m={0}>
            <StarIcon />
            Уютная игра для пушистых умов
          </Text>
          <Heading
            as="h1"
            fontFamily="body"
            fontWeight="800"
            fontSize="clamp(2rem, 6vw, 4.5rem)"
            lineHeight="1.05"
            letterSpacing="-0.02em"
            m={0}>
            Сапёр, но с{' '}
            <Box as="span" color="buttonBg">
              котиками
            </Box>{' '}
            и{' '}
            <Flex
              as="span"
              display="inline-flex"
              alignItems="center"
              gap={2}
              color="#0d3242">
              рыбками &#128031;
            </Flex>
          </Heading>
          <Text
            w="331px"
            fontFamily="body"
            fontSize="12px"
            fontWeight="400"
            lineHeight="12px"
            color="subtitleText"
            textAlign="center">
            Открывайте пушистые клеточки, ставьте рыбки-флажки и берегитесь
            спящих пёсиков.
          </Text>
          <Flex
            gap={4}
            pt="12px"
            pb="36px"
            alignItems="center"
            justifyContent="space-between">
            <Button
              type="button"
              display="flex"
              alignItems="center"
              gap={4}
              height="40px"
              padding="0 32px"
              borderRadius="9999px"
              onClick={() => {
                navigate('/game')
              }}>
              <LogoIcon width={16} height={16} />
              Играть
            </Button>
            <Button
              type="button"
              variant="cyan"
              display="flex"
              alignItems="center"
              gap={4}
              height="40px"
              padding="0 32px"
              borderRadius="9999px"
              onClick={() => {
                navigate('/forum')
              }}>
              <ChatIcon width={16} height={16} />
              На форум
            </Button>
          </Flex>
          <Box>
            <img
              src="img/main-page-image.png"
              alt="Иллюстрация игры Котосапёр"
            />
          </Box>
          <MainFeatureCards cards={MAIN_FEATURE_CARDS} />
        </Flex>
      </Box>
      <Flex
        as="footer"
        fontFamily="body"
        fontSize="12px"
        fontWeight="400"
        alignItems="center"
        justifyContent="center"
        w="full"
        pt="32px"
        borderTop="1px solid"
        borderColor="border">
        Команда BugOrFeature. 2026
      </Flex>
    </Flex>
  )
}
