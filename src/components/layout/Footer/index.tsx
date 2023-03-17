import React from 'react'
import styled, { css } from 'styled-components'

// import { brands } from '@fortawesome/fontawesome-svg-core/import.macro'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { HashLink } from 'react-router-hash-link'

import { Logo } from '../../common/Logo'
import { InnerContainer } from '../../pureStyledComponents/InnerContainer'

const Wrapper = styled.footer`
  display: flex;
  background-color: black;
  height: auto;
  justify-content: center;
  margin-top: 100px;
  overflow: visible;
  padding: 65px 0 65px 0;
  width: 100%;
`

const Inner = styled(InnerContainer)`
  column-gap: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  list-style: none;
  margin: 0;
  padding-bottom: 0;
  padding-left: ${(props) => props.theme.layout.horizontalPadding};
  padding-right: ${(props) => props.theme.layout.horizontalPadding};
  padding-top: 0;
  row-gap: 10px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    // align-items: center;
    column-gap: unset;
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    flex-shrink: 0;
    grid-template-columns: unset;
    justify-content: space-between;
    // justify-content: center;
    row-gap: unset;
  }
`

const LogoLink = styled(HashLink)`
  display: none;
  text-decoration: none;
  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    display: block;
  }
`

const Item = styled.span`
  // color: ${({ theme }) => theme.text1};
  color: white;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  opacity: 0.8;

  // &:hover {
  //   opacity: 1;
  // }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    margin-right: 30px;

    &:last-child {
      margin-right: 0;
    }
  }
`

const LinkCSS = css`
  color: grey;
  text-decoration: none;
  transition: color 0.05s linear;

  &:hover {
    color: ${({ theme }) => theme.primary1};
  }
`
const List = styled.li`
  padding: 5px 0 5px;
  font-size: 15px;
  list-style: none;
  color: grey;
  margin-left: 0;
`

const HorizontalList = styled.li`
  padding: 5px 0 5px;
  float: left;
  margin-right: 10px;
`

const HeadText = styled.p`
  margin-bottom: 10px;
`

const ExternalLink = styled.a`
  display: block;
  text-decoration: none;
  color: grey;
  ${LinkCSS}
`

// const Link = styled(HashLink)`
//   ${LinkCSS}
// `

export const Footer: React.FC = (props) => {
  const { ...restProps } = props
  const date = new Date()
  const year = date.getFullYear()

  return (
    <Wrapper {...restProps}>
      <Inner>
        <LogoLink className="logoLink" to="/#topAnchor">
          <Logo />
          <br></br>
          <ExternalLink
            href="https://forum.gnosis.io/c/dao/20"
            rel="noopener noreferrer"
            target="_blank"
          >
            {`©${year} GnosisDAO Forum`}
          </ExternalLink>
        </LogoLink>
        <Item>
          <HeadText>ORGANIZATION</HeadText>
          <List>
            <ExternalLink
              href="https://www.gnosis.builders/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Gnosis Builders
            </ExternalLink>
          </List>
          <List>
            <ExternalLink
              href="https://www.gnosis.builders/careers"
              rel="noopener noreferrer"
              target="_blank"
            >
              Careers
            </ExternalLink>
          </List>
          <List>
            <ExternalLink
              href="https://www.gnosischain.com/evm"
              rel="noopener noreferrer"
              target="_blank"
            >
              Gnosis Chain
            </ExternalLink>
          </List>
        </Item>
        <Item>
          <HeadText>TOOLS</HeadText>
          <List>
            <ExternalLink
              href="https://gnosisfaucet.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              xDAI Faucet
            </ExternalLink>
          </List>
          <List>
            <ExternalLink href="https://buyxdai.com" rel="noopener noreferrer" target="_blank">
              Buy xDAI
            </ExternalLink>
          </List>
          <List>
            <ExternalLink href="https://buyxdai.com/gno" rel="noopener noreferrer" target="_blank">
              Buy GNO
            </ExternalLink>
          </List>
          <List>
            <ExternalLink
              href="https://mgno.validategnosis.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              mGNO Validator Deposit
            </ExternalLink>
          </List>
          <List>
            <ExternalLink href="https://d14n.info/" rel="noopener noreferrer" target="_blank">
              d14n
            </ExternalLink>
          </List>
          <List>
            <ExternalLink
              href="https://gnosiswallets.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              Wallet Finder
            </ExternalLink>
          </List>
          <List>
            <ExternalLink
              href="https://www.gnosismetrics.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              Gnosis Metrics
            </ExternalLink>
          </List>
          <List>
            <ExternalLink
              href="https://www.validategnosis.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              Validate Gnosis
            </ExternalLink>
          </List>
        </Item>
        <Item>
          <HeadText>BLOG</HeadText>
          <List>
            <ExternalLink
              href="https://www.gnosis.builders/gnosis-builders-blog"
              rel="noopener noreferrer"
              target="_blank"
            >
              Builders Blog
            </ExternalLink>
          </List>
        </Item>
        <Item>
          <HeadText>SOCIALS</HeadText>
          <HorizontalList>
            <ExternalLink
              href="https://twitter.com/gnosisbuilders"
              rel="noopener noreferrer"
              target="_blank"
            >
              {/* <FontAwesomeIcon icon={brands('twitter')} size="2x" /> */}
              Twitter
            </ExternalLink>
          </HorizontalList>
          <HorizontalList>
            <ExternalLink
              href="https://t.me/GnosisBuildersCommunity"
              rel="noopener noreferrer"
              target="_blank"
            >
              {/* <FontAwesomeIcon icon={brands('telegram')} size="2x" /> */}
              Telegram
            </ExternalLink>
          </HorizontalList>
        </Item>
        {/* <Item>
          <ExternalLink
            href="https://discord.com/invite/M39dTHQ"
            rel="noopener noreferrer"
            target="_blank"
          >
            Support
          </ExternalLink>
        </Item> */}
      </Inner>
    </Wrapper>
  )
}
